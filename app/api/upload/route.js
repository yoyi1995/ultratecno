import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

async function readUploadFile(file) {
  if (!file) return null

  if (typeof file.arrayBuffer === 'function') {
    return Buffer.from(await file.arrayBuffer())
  }

  if (typeof file.stream === 'function') {
    const stream = file.stream()

    if (typeof stream.getReader === 'function') {
      const reader = stream.getReader()
      const chunks = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(Buffer.from(value))
      }

      return Buffer.concat(chunks)
    }

    return new Promise((resolve, reject) => {
      const chunks = []
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
      stream.on('end', () => resolve(Buffer.concat(chunks)))
      stream.on('error', reject)
    })
  }

  if (file instanceof Buffer) {
    return file
  }

  if (file.buffer) {
    return file.buffer
  }

  throw new Error('El archivo no puede leerse en el servidor')
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No se subió ningún archivo' }, { status: 400 })
    }

    const buffer = await readUploadFile(file)

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'ultratecno/products',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id
    })
  } catch (error) {
    console.error('Error al subir imagen:', error)
    return NextResponse.json({ error: error?.message || 'Error al subir la imagen' }, { status: 500 })
  }
}