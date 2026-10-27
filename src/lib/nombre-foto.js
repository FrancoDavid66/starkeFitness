// Cómo se llama cada foto: la usan la web (src/lib/fotos.js) y `npm run fotos` (scripts/fotos-ena.mjs),
// así la foto que baja el script es la misma que después busca la web.

const ENA = 'https://www.enasport.com/cdn/shop/';

// Ruta guardada en los datos -> URL online
//  - ENA: 'files/Foto.webp?v=123' (relativa al CDN de ENA)
//  - Star / Gold / Granger: URL completa
export const urlRemota = (ruta, ancho = 800) => {
  if (!ruta) return null;
  const url = /^https?:\/\//.test(ruta) ? ruta : ENA + ruta;
  // los CDN de Shopify (ENA y Star) achican la foto con ?width=
  if (/cdn\.shopify\.com|\/cdn\/shop\//.test(url)) return `${url}${url.includes('?') ? '&' : '?'}width=${ancho}`;
  return url;
};

const limpio = (s) =>
  decodeURIComponent(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9.\-_]+/g, '-');

const PREFIJO = [
  [/starnutrition|0567\/4716\/3735/, 'star'],
  [/goldnutrition/, 'gold'],
  [/mitiendanube|grangernutricion/, 'granger'],
];

// Nombre del archivo local en src/assets/productos/
//  - ENA: el mismo nombre que en ENA (Foto.webp)
//  - resto: marca-nombre.ext (star-Whey.png, gold-100-whey-protein-2lb-chocolate.webp…)
export const nombreLocal = (ruta) => {
  if (!ruta) return null;
  const archivo = ruta.split('?')[0].split('/').pop();
  if (!/^https?:\/\//.test(ruta)) return archivo.toLowerCase();
  const marca = PREFIJO.find(([re]) => re.test(ruta))?.[1] || 'foto';
  return `${marca}-${limpio(archivo)}`;
};
