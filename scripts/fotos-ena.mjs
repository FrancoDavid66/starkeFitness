// =====================================================================
//  Baja de ENA Sport todas las fotos del shop (la principal y la de
//  cada sabor / tamaño) a src/assets/productos/
//
//  Uso:
//    npm run fotos            -> baja solo las que faltan
//    npm run fotos -- --todas -> vuelve a bajar todas
//
//  Mientras una foto no esté bajada, la web usa la foto online de ENA.
// =====================================================================
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { productos, rutasDeFotos } from '../src/data/productos.js';

const ENA = 'https://www.enasport.com';
const ANCHO = 800;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const carpeta = path.join(aqui, '..', 'src', 'assets', 'productos');
const todas = process.argv.includes('--todas');

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const nombreArchivo = (ruta) => ruta.split('?')[0].split('/').pop();
const urlEna = (ruta) => `${ENA}/cdn/shop/${ruta}${ruta.includes('?') ? '&' : '?'}width=${ANCHO}`;

async function bajar(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'image/png,image/jpeg,image/*;q=0.8' } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const tipo = r.headers.get('content-type') || '';
  if (!tipo.startsWith('image/')) throw new Error(`no es una imagen (${tipo})`);
  return Buffer.from(await r.arrayBuffer());
}

// Si ENA cambió la foto principal, se pide la actual al producto
async function fotoActual(p) {
  try {
    const r = await fetch(`${ENA}/products/${p.ena}.json`, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
    if (!r.ok) return null;
    const j = await r.json();
    const src = j.product?.image?.src || j.product?.images?.[0]?.src;
    if (!src) return null;
    const u = new URL(src.startsWith('//') ? `https:${src}` : src);
    u.searchParams.set('width', String(ANCHO));
    return u.toString();
  } catch {
    return null;
  }
}

await mkdir(carpeta, { recursive: true });
const yaEstan = new Set((await readdir(carpeta)).map((f) => f.toLowerCase()));

let bajadas = 0;
let salteadas = 0;
const fallas = [];

console.log(`\nFotos de ENA -> ${path.relative(process.cwd(), carpeta)}\n`);

for (const p of productos) {
  for (const ruta of rutasDeFotos(p)) {
    const archivo = nombreArchivo(ruta);
    if (!todas && yaEstan.has(archivo.toLowerCase())) {
      salteadas++;
      continue;
    }
    try {
      let datos;
      try {
        datos = await bajar(urlEna(ruta));
      } catch (e) {
        const actual = ruta === p.img ? await fotoActual(p) : null;
        if (!actual) throw e;
        datos = await bajar(actual);
      }
      await writeFile(path.join(carpeta, archivo), datos);
      yaEstan.add(archivo.toLowerCase());
      console.log(`  ✓ ${p.n.padEnd(26)} ${archivo} (${Math.round(datos.length / 1024)} KB)`);
      bajadas++;
    } catch (e) {
      fallas.push(`${p.n} (${archivo})`);
      console.log(`  ✗ ${p.n.padEnd(26)} ${archivo}: ${e.message}`);
    }
    await esperar(200); // de a una, sin saturar a ENA
  }
}

console.log(`\nListo: ${bajadas} bajadas, ${salteadas} ya estaban, ${fallas.length} con error.`);
if (fallas.length) console.log('Las que fallaron siguen usando la foto online de ENA. Probá de nuevo más tarde.');
console.log('Reiniciá "npm run dev" para que la web tome las fotos nuevas.\n');
