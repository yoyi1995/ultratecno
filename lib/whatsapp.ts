export const WHATSAPP_NUMBER = '593987808181';

export function money(amount: number): string {
  return `$${(Number.isFinite(amount) ? amount : 0).toFixed(2)}`;
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function cartMessage(items: ReadonlyArray<{ name: string; price: number; quantity: number }>): string {
  const totalCents = items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0);
  return `¡Hola, UltraTecno! Quiero consultar esta compra:\n\n${items.map(item =>
    `${item.quantity} × ${item.name} — ${money(Math.round(item.price * 100) * item.quantity / 100)}`
  ).join('\n')}\n\nTotal estimado: ${money(totalCents / 100)} USD.\nPor favor, confirmen disponibilidad, precio final y entrega.`;
}

export function serviceMessage(serviceTitle: string): string {
  return `¡Hola, UltraTecno! Quiero solicitar el servicio técnico: ${serviceTitle}.\nMi equipo y la falla que presenta son: `;
}

export function courseMessage(courseTitle: string): string {
  return `¡Hola, UltraTecno! Quisiera consultar información y disponibilidad para el curso: ${courseTitle}.`;
}

export function productMessage(productName: string, price: number): string {
  return `¡Hola, UltraTecno! Quisiera consultar sobre el producto: ${productName} (${money(price)}).`;
}

export function tipMessage(tipTitle: string): string {
  return `¡Hola, UltraTecno! Estuve viendo el tip técnico «${tipTitle}» y quisiera hacerles una consulta sobre mi equipo: `;
}
