import { Providers } from '@/components/Providers'
import './globals.css'
import WhatsAppButton from '@/components/WhatsAppButton'
export const metadata = {
  title: 'UltraTecno - Repuestos y Tecnología',
  description: 'Los mejores repuestos, tintas y cursos de tecnología',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {children}
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  )
}