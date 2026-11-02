import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// La web usa direcciones con # (dominio.com.ar/#/ingreso). Para que los links "limpios"
// (dominio.com.ar/ingreso, /links, /shop…) también funcionen en CUALQUIER hosting, el build
// crea una carpeta por página con un index.html chiquito que redirige a la versión con #.
const RUTAS_LIMPIAS = ['links', 'shop', 'mapa', 'ingreso', 'inscripcion', 'inscribite', 'empezar', 'actividades', 'horarios'];

const redireccion = (r) => `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Starke Fitness</title>
    <script>location.replace(location.pathname.replace(/\\/${r}\\/?$/i, '/') + location.search + '#/${r}');</script>
    <meta http-equiv="refresh" content="0; url=../#/${r}" />
  </head>
  <body style="margin:0;background:#000;color:#fff;font-family:system-ui,sans-serif">
    <a href="../#/${r}" style="color:#fff;display:block;padding:24px">Entrar a Starke Fitness</a>
  </body>
</html>
`;

const rutasLimpias = () => ({
  name: 'starke-rutas-limpias',
  apply: 'build',
  generateBundle() {
    for (const r of RUTAS_LIMPIAS) this.emitFile({ type: 'asset', fileName: `${r}/index.html`, source: redireccion(r) });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), rutasLimpias()],
  // el catálogo (149 productos de 4 marcas) hace que el JS pese más de 500 kB: es normal
  build: { chunkSizeWarningLimit: 800 },
});
