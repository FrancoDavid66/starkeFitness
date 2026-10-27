// Fotos de productos.
// 1) Foto bajada con `npm run fotos` en src/assets/productos/.
// 2) Si no está bajada, la foto online de la marca (ENA, Star, Gold, Granger).
// 3) Si tampoco carga, el componente muestra el nombre del producto.
//
// Para reemplazar a mano la foto principal de un producto: src/assets/productos/<id>.webp
// (el id es el que figura en los datos del producto).
import { nombreLocal, urlRemota } from './nombre-foto';

const locales = import.meta.glob('../assets/productos/*.{webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const porNombre = {};
for (const [ruta, url] of Object.entries(locales)) {
  porNombre[ruta.split('/').pop().toLowerCase()] = url;
}

const reemplazoManual = (id) =>
  ['webp', 'jpg', 'jpeg', 'png'].map((ext) => porNombre[`${id.toLowerCase()}.${ext}`]).find(Boolean) || null;

// foto online (se usa cuando la local no está o no carga)
export const fotoEna = (ruta) => urlRemota(ruta);

// p = producto, ruta = foto de la variante (si no hay, la principal)
export const fotoProducto = (p, ruta = null) => {
  if (!ruta || ruta === p.img) {
    const manual = reemplazoManual(p.id);
    if (manual) return manual;
  }
  const r = ruta || p.img;
  return porNombre[nombreLocal(r)] || urlRemota(r);
};
