import type { ContentMap, Collection } from './types';
import { serviceContent } from './service-content';
export type Database = { [K in Collection]: ContentMap[K][] };
const photo = (id:string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;
const laptop=photo('photo-1496181133206-80ce9b88a853');
const pc=photo('photo-1587831990711-23ca6441447b');
const electronics=photo('photo-1518770660439-4636190af475');
const printer='https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=900&q=85';
const adapter=photo('photo-1625948515291-69613efd103f');
const headphones=photo('photo-1546435770-a3e426bf472b');
const ups='https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Uninterruptible_power_supply.jpg/960px-Uninterruptible_power_supply.jpg';
const categories = [ ['Laptops','laptops',laptop],['Impresoras','impresoras',printer],['Electrónica','electronica',electronics],['Software y Antivirus','software-antivirus',pc],['Cables y Adaptadores','cables-adaptadores',adapter],['Multimedia y Accesorios','multimedia-accesorios',headphones],['Protección Eléctrica','proteccion-electrica',ups] ];
export const demoData: Database = {
  categories: categories.map(([name,slug,image],i)=>({id:`category-${i+1}`,name,slug,image_url:image,sort_order:i,active:true})),
  products: [
    ['Laptop para estudio y trabajo',649,'laptops','Selección UltraTecno',laptop],
    ['Laptop profesional 15 pulgadas',899,'laptops','Selección UltraTecno',photo('photo-1517336714731-489689fd1ca8')],
    ['Impresora multifunción de tinta',249,'impresoras','Selección UltraTecno',printer],
    ['Kit de electrónica para aprender',35,'electronica','Genérica',electronics],
    ['Antivirus para tu equipo',29.9,'software-antivirus','Licencia por confirmar',electronics],
    ['Adaptador USB-C multipuerto',24.9,'cables-adaptadores','Genérica',adapter],
    ['Audífonos para trabajo y estudio',39.9,'multimedia-accesorios','Selección UltraTecno',headphones],
    ['Protector de voltaje para PC',19.9,'proteccion-electrica','Genérica',electronics],
  ].map(([name,price,category,brand,image],i)=>({id:`product-${i+1}`,name:String(name),price:Number(price),category:String(category),brand:String(brand),image_url:String(image),images:[String(image)],description:'Producto de demostración. Consulta modelo, precio final y disponibilidad por WhatsApp antes de comprar.',specifications:{'Catálogo':'Demostración','Garantía':'Consultar condiciones','Entrega':'Coordinar por WhatsApp'},in_stock:true,featured:i<4,active:true})),
  services: serviceContent,
  courses: ['Electricidad básica','Electrónica básica','Soporte técnico','Mantenimiento de computadoras','Reparación de laptops','Impresoras','Redes','Diagnóstico de hardware'].map((title,i)=>({id:`course-${i+1}`,title,image_url:i===5?printer:i<2?electronics:laptop,description:'Capacitación propuesta para desarrollar habilidades prácticas. Consulta apertura, contenidos definitivos y requisitos.',syllabus:['Fundamentos y seguridad','Herramientas y procedimientos','Práctica guiada','Diagnóstico y buenas prácticas'],level:i<4?'Inicial':'Intermedio',modality:'Por confirmar',duration:'Por confirmar',start_date:null,schedule:'Por confirmar',seats:null,status:'upcoming',featured:i<3,active:true})),
  tips: [
    {id:'tip-1',title:'Tu laptop también necesita respirar',description:'Tres cuidados sencillos para controlar la temperatura.',content:'Utiliza tu laptop sobre una superficie firme y deja libres las rejillas. Evita camas y sofás mientras está encendida. Si notas calor excesivo o apagados, apaga el equipo y solicita una revisión técnica; no abras el dispositivo sin experiencia.',kind:'article',url:'',image_url:laptop,category:'Mantenimiento',active:true},
    {id:'tip-2',title:'Una copia de seguridad puede salvar tu trabajo',description:'Protege tus archivos antes de que ocurra una falla.',content:'Mantén una copia en un dispositivo independiente y otra en un servicio de confianza. Verifica periódicamente que puedes abrir los archivos respaldados. Antes de llevar tu equipo a revisión, realiza un respaldo reciente.',kind:'article',url:'',image_url:pc,category:'Cuidados',active:true},
    {id:'tip-3',title:'Antes de imprimir, revisa estos detalles',description:'Papel adecuado, tinta y una prueba de impresión.',content:'Usa papel seco y compatible con tu impresora. Comprueba niveles de tinta y conexiones. Ejecuta la prueba de impresión del fabricante; si persisten las líneas o errores, solicita diagnóstico en lugar de repetir limpiezas continuamente.',kind:'article',url:'',image_url:printer,category:'Impresoras',active:true},
  ],
};
