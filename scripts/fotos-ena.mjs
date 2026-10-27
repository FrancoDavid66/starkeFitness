// =====================================================================
//  Baja todas las fotos del shop (ENA, Star Nutrition, Gold Nutrition y
//  Granger: la principal y la de cada sabor / tamaño) a src/assets/productos/
//
//  Uso:
//    npm run fotos            -> baja solo las que faltan
//    npm run fotos -- --todas -> vuelve a bajar todas
//    npm run fotos -- --marca=gold  -> solo una marca (ena, star, gold, granger)
//
//  Mientras una foto no esté bajada, la web usa la foto online de la marca.
// =====================================================================
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { productos, rutasDeFotos } from '../src/data/productos.js';
import { nombreLocal, urlRemota } from '../src/lib/nombre-foto.js';

const ENA = 'https://www.enasport.com';
const ANCHO = 800;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const carpeta = path.join(aqui, '..', 'src', 'assets', 'productos');
const todas = process.argv.includes('--todas');
const soloMarca = (process.argv.find((a) => a.startsWith('--marca=')) || '').split('=')[1]?.toLowerCase() || null;

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function bajar(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'image/webp,image/png,image/jpeg,image/*;q=0.8' } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const tipo = r.headers.get('content-type') || '';
  if (!tipo.startsWith('image/')) throw new Error(`no es una imagen (${tipo})`);
  return Buffer.from(await r.arrayBuffer());
}

// Solo ENA: si cambió la foto principal, se pide la actual al producto
async function fotoActualEna(p) {
  if (!p.ena) return null;
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
const lista = productos.filter((p) => !soloMarca || p.m.toLowerCase().startsWith(soloMarca));

console.log(`\nFotos de ${soloMarca ? lista[0]?.m || soloMarca : 'todas las marcas'} -> ${path.relative(process.cwd(), carpeta)}\n`);

for (const p of lista) {
  for (const ruta of rutasDeFotos(p)) {
    const archivo = nombreLocal(ruta);
    if (!todas && yaEstan.has(archivo.toLowerCase())) {
      salteadas++;
      continue;
    }
    try {
      let datos;
      try {
        datos = await bajar(urlRemota(ruta, ANCHO));
      } catch (e) {
        const actual = ruta === p.img ? await fotoActualEna(p) : null;
        if (!actual) throw e;
        datos = await bajar(actual);
      }
      await writeFile(path.join(carpeta, archivo), datos);
      yaEstan.add(archivo.toLowerCase());
      console.log(`  ✓ ${p.m.padEnd(15)} ${p.n.slice(0, 34).padEnd(34)} ${archivo} (${Math.round(datos.length / 1024)} KB)`);
      bajadas++;
    } catch (e) {
      fallas.push(`${p.m} · ${p.n} (${archivo})`);
      console.log(`  ✗ ${p.m.padEnd(15)} ${p.n.slice(0, 34).padEnd(34)} ${archivo}: ${e.message}`);
    }
    await esperar(200); // de a una, sin saturar a las marcas
  }
}

console.log(`\nListo: ${bajadas} bajadas, ${salteadas} ya estaban, ${fallas.length} con error.`);
if (fallas.length) console.log('Las que fallaron siguen usando la foto online de la marca. Probá de nuevo más tarde.');
console.log('Reiniciá "npm run dev" para que la web tome las fotos nuevas.\n');
