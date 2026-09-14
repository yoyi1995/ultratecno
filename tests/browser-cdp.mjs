import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export async function browser() {
  const out = resolve(process.env.QA_OUT || '../../project-state/ultratecno/qa');
  mkdirSync(out, { recursive: true });
  const executable = process.env.QA_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const profile = mkdtempSync(join(tmpdir(), 'ultratecno-qa-'));
  const child = spawn(executable, ['--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--remote-debugging-port=9231', '--remote-debugging-address=127.0.0.1', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let spawnError;
  child.on('error', error => { spawnError = error; });
  let socket;
  const stop = () => {
    socket?.close();
    if (child.pid) try { execFileSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore', timeout: 10000 }); } catch { /* Chrome may have exited already. */ }
  };
  try {
    let targets;
    for (let i = 0; i < 60; i++) {
      if (spawnError) throw spawnError;
      try { targets = await (await fetch('http://127.0.0.1:9231/json', { signal: AbortSignal.timeout(1000) })).json(); break; } catch { await sleep(200); }
    }
    if (!targets) throw new Error('Chrome CDP did not start within 12 seconds');
    socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
    let id = 0;
    const pending = new Map(), errors = [], checks = [];
    socket.onmessage = message => {
      const data = JSON.parse(message.data);
      if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails);
      if (data.method === 'Runtime.consoleAPICalled' && data.params.type === 'error') errors.push({ console: data.params.args.map(arg => arg.value || arg.description).join(' ') });
      if (data.id && pending.has(data.id)) {
        const p = pending.get(data.id); pending.delete(data.id); clearTimeout(p.timer);
        if (data.error) p.reject(new Error(JSON.stringify(data.error)));
        else p.resolve(data.result);
      }
    };
    const call = (method, params = {}) => new Promise((resolve, reject) => {
      const n = ++id;
      const timer = setTimeout(() => { pending.delete(n); reject(new Error(`CDP timeout: ${method}`)); }, 15000);
      pending.set(n, { resolve, reject, timer }); socket.send(JSON.stringify({ id: n, method, params }));
    });
    const evaluate = async expression => {
      const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    const wait = async (expression, label = expression) => {
      const deadline = Date.now() + 15000;
      while (Date.now() < deadline) { if (await evaluate(expression)) return; await sleep(150); }
      throw new Error(`Condition timeout: ${label}`);
    };
    const go = async path => { await call('Page.navigate', { url: new URL(path, process.env.QA_URL || 'http://localhost:3000').href }); await wait('document.readyState === "complete"'); await sleep(400); };
    const click = async selector => { await wait(`!!document.querySelector(${JSON.stringify(selector)})`); await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`); await sleep(200); };
    const fill = async (selector, value) => evaluate(`(() => {
      let e = document.querySelector('input' + ${JSON.stringify(selector)} + ', textarea' + ${JSON.stringify(selector)} + ', select' + ${JSON.stringify(selector)}) || document.querySelector(${JSON.stringify(selector)});
      if (!e) throw Error('Missing field: ' + ${JSON.stringify(selector)});
      if (e.tagName !== 'INPUT' && e.tagName !== 'TEXTAREA' && e.tagName !== 'SELECT') {
        const inner = e.querySelector('input, textarea, select');
        if (inner) e = inner;
      }
      const proto = e instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : e instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
      const desc = Object.getOwnPropertyDescriptor(proto, 'value');
      if (desc && desc.set) { desc.set.call(e, ${JSON.stringify(value)}); } else { e.value = ${JSON.stringify(value)}; }
      e.dispatchEvent(new Event('input', { bubbles: true }));
      e.dispatchEvent(new Event('change', { bubbles: true }));
    })()`);
    const check = (name, passed, evidence) => { checks.push({ name, passed: Boolean(passed), evidence }); if (!passed) throw new Error(`Assertion failed: ${name}`); };
    const shot = async name => { const result = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }); writeFileSync(join(out, `${name}.png`), Buffer.from(result.data, 'base64')); };
    const report = error => writeFileSync(join(out, 'browser-results.json'), JSON.stringify({ timestamp: new Date().toISOString(), url: process.env.QA_URL || 'http://localhost:3000', browser: executable, checks, errors, error: error ? String(error) : null }, null, 2));
    await call('Runtime.enable'); await call('Page.enable');
    await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    return { call, evaluate, wait, go, click, fill, check, shot, report, stop, errors, checks };
  } catch (error) { stop(); throw error; }
}
