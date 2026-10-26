// Fotos de productos.
// 1) Foto bajada con `npm run fotos` en src/assets/productos/ (mismo nombre de archivo que en ENA).
// 2) Si no está bajada, la foto online del CDN de ENA.
// 3) Si tampoco carga, el componente muestra el nombre del producto.
//
// Para reemplazar a mano la foto principal de un producto: src/assets/productos/<id>.webp
// (el id es el que figura en src/data/productos.js).

const locales = import.meta.glob('../assets/productos/*.{webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const porNombre = {};
for (const [ruta, url] of Object.entries(locales)) {
  porNombre[ruta.split('/').pop().toLowerCase()] = url;
}

const nombreArchivo = (rutaEna) => rutaEna.split('?')[0].split('/').pop().toLowerCase();
const reemplazoManual = (id) =>
  ['webp', 'jpg', 'jpeg', 'png'].map((ext) => porNombre[`${id.toLowerCase()}.${ext}`]).find(Boolean) || null;

export const fotoEna = (rutaEna) => `https://www.enasport.com/cdn/shop/${rutaEna}${rutaEna.includes('?') ? '&' : '?'}width=800`;

// p = producto, ruta = foto de la variante (si no hay, la principal)
export const fotoProducto = (p, ruta = null) => {
  if (!ruta || ruta === p.img) {
    const manual = reemplazoManual(p.id);
    if (manual) return manual;
  }
  const r = ruta || p.img;
  return porNombre[nombreArchivo(r)] || fotoEna(r);
};
