export interface Base { id: string | number; active: boolean }
export interface Product extends Base { name: string; description: string; price: number; category: string; brand: string; image_url: string; images: string[]; specifications: Record<string,string>; in_stock: boolean; featured: boolean }
export interface Category extends Base { name: string; slug: string; sort_order: number; image_url: string }
export interface Service extends Base { title: string; category: string; image_url: string; description: string; includes: string[]; problems: string[]; recommendations: string[]; featured: boolean }
export interface Course extends Base { title: string; image_url: string; description: string; syllabus: string[]; level: string; modality: string; duration: string; start_date: string | null; schedule: string; seats: number | null; status: 'upcoming' | 'open' | 'closed'; featured: boolean }
export interface Tip extends Base { title: string; description: string; content: string; kind: 'article' | 'youtube' | 'video'; url: string; image_url: string; category: string }
export interface ContentMap { products: Product; categories: Category; services: Service; courses: Course; tips: Tip }
export type Collection = keyof ContentMap;
