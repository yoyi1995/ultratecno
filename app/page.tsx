'use client'
import { Card, Button, Chip } from '@heroui/react'
import { Package, BookOpen, Phone, Mail, MapPin, ArrowRight, Star, Shield, Truck, Award, Clock, DollarSign } from 'lucide-react'
import Link from 'next/link'
import AnimatedText from '@/components/AnimatedText'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden hero-bg bg-cover bg-center text-white py-20 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Chip color="warning" variant="soft" className="mb-4">
                <Star size={16} className="mr-1" />
                Tienda #1 en Tecnología
              </Chip>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-2xl">
                Bienvenido a <span className="text-blue-100">UltraTecno</span>
                <span className="block mt-2 min-h-20">
                  <AnimatedText />
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 drop-shadow">
                Más allá de la Tecnología. Encuentra repuestos originales, componentes electrónicos, tintas y mucho más.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-white text-blue-900 hover:bg-blue-50 shadow-xl rounded-xl font-semibold inline-flex items-center justify-center gap-2"
                  >
                    Ver Productos
                    <ArrowRight size={20} />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button
                    size="lg"
                    className="bg-white/10 border border-white/30 text-white hover:bg-white/20 shadow-xl rounded-xl font-semibold inline-flex items-center justify-center gap-2"
                  >
                    Ver Cursos
                    <ArrowRight size={20} />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right-side feature panel removed to show hero image fully */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Garantía Total</h3>
              <p className="text-sm text-gray-600">Todos nuestros productos son originales</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Envío Rápido</h3>
              <p className="text-sm text-gray-600">Entrega en 24-48 horas</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Expertos</h3>
              <p className="text-sm text-gray-600">Más de 10 años de experiencia</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Soporte 24/7</h3>
              <p className="text-sm text-gray-600">Atención personalizada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Visuales */}
      <section className="py-16 px-4 bg-linear-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Explora por Categoría
            </h2>
            <p className="text-gray-600 text-lg">
              Selecciona una categoría y encuentra lo que necesitas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { 
                name: 'Repuestos de Impresoras', 
                image: 'https://tiendaeconoprint.com/cdn/shop/products/image_2048x.png?v=1754239287',
                slug: 'impresoras'
              },
              { 
                name: 'Repuestos de Laptops', 
                image: 'https://s.alicdn.com/@sc04/kf/H2f0adfcac4714ff3852605421ebcbc81y.jpg',
                slug: 'laptops'
              },
              { 
                name: 'Tintas Epson', 
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5y9P2nK_PdaFsC-fIKpJfyUXA3d7X01vxWXgELxKtReZ8kxZzBlwh7ec&s=10',
                slug: 'tintas'
              },
              { 
                name: 'Cartuchos', 
                image: 'https://www.123tinta.es/image/Canon_PG-575CL-576_Pack_ahorro_negro_y_color_marca_123tinta_130731_m1_big.jpg',
                slug: 'cartuchos'
              },
              { 
                name: 'Repuestos de Electrónica', 
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPIQ_23GQGtoJpehSSTWuz18_lp3eRT5ZA8C8dKKEL9Bl5xscoyl0r8Hw&s=10',
                slug: 'electronica'
              },
            ].map((category, index) => (
              <Link 
                key={index} 
                href={`/products?category=${category.slug}`}
                className="group"
              >
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 mb-3">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-blue-800 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-blue-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-gray-800 text-center group-hover:text-blue-700 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver productos →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cursos Destacados */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Cursos Destacados
            </h2>
            <p className="text-gray-600 text-lg">
              Aprende con los mejores expertos en tecnología
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Reparación de Laptops',
                description: 'Aprende a diagnosticar y reparar laptops desde cero',
                price: '150',
                duration: '4 semanas',
                image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop',
              },
              {
                title: 'Reparación de Impresoras',
                description: 'Domina el mantenimiento de impresoras Epson, HP y Canon',
                price: '120',
                duration: '3 semanas',
                image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop',
              },
              {
                title: 'Electrónica Básica',
                description: 'Fundamentos de electrónica y reparación de componentes',
                price: '100',
                duration: '2 semanas',
                image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
              },
            ].map((course, index) => (
              <Card key={index} className="bg-white hover:shadow-2xl transition-shadow border-0 overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Chip color="success" variant="soft" className="rounded-lg font-semibold">
                      Disponible
                    </Chip>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock size={16} className="text-blue-600" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-blue-900 text-lg">
                      <DollarSign size={18} />
                      {course.price}
                    </span>
                  </div>
                  <Link href="/courses">
                    <Button
                      fullWidth
                      className="bg-linear-to-r from-blue-700 to-blue-900 text-white hover:from-blue-800 hover:to-blue-950 rounded-xl font-semibold"
                    >
                      Ver Más Cursos
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-linear-to-br from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Necesitas ayuda con tu impresora?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contáctanos y te ayudamos a encontrar el repuesto exacto que necesitas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/51999999999" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-green-500 text-white hover:bg-green-600 shadow-xl rounded-xl font-semibold inline-flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path fill="white" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </Button>
            </a>
            <Link href="/contact">
              <Button
                size="lg"
                variant="ghost"
                className="border-white text-white hover:bg-white/10 rounded-xl font-semibold"
              >
                <Mail className="mr-2" size={20} />
                Contacto
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">U</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">UltraTecno</h3>
                  <p className="text-xs text-gray-400">Más allá de la Tecnología</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Tu tienda de confianza para repuestos de impresoras y tecnología.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/products" className="hover:text-white transition-colors">Productos</Link></li>
                <li><Link href="/courses" className="hover:text-white transition-colors">Cursos</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contacto</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone size={16} />
                  +1 234 567 890
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} />
                  info@ultratecno.com
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={16} />
                  Machala, Ecuador
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Horario</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>visitanos en 10 de Agosto y 8va norte Frente a la Ferrteria Armijos</li>
                <li>Lun - Vie: 8:30 - 18:00</li>
                <li>Sáb: 8:30 - 18:00</li>
                <li>Dom: Cerrado</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 UltraTecno. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}