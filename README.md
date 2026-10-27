# STARKE FITNESS — web

Vite + React + Tailwind + Framer Motion + Lenis. Misma base que GRAMO / MUM / Venzza.

Tres páginas en una sola web:

- **`/`** portada del gym (hero con el reloj LED, actividades, primera clase gratis, suplementos destacados, horarios)
- **`/shop`** shop de suplementos (ENA, Star Nutrition, Gold Nutrition y Granger · 149 productos) sin precios: la gente arma la consulta y la manda por WhatsApp
- **`/links`** página para la bio de Instagram (reemplaza el Linktree)

## Arrancar

```bash
npm install
npm run fotos     # baja las fotos de los productos de las 4 marcas (una sola vez)
npm run dev
```

## Páginas y links para el perfil de Instagram

| Link | Abre |
|---|---|
| `TU-DOMINIO.com.ar/links` | Menú de links (clase gratis, web, productos, mapa, horarios, actividades) |
| `TU-DOMINIO.com.ar/` | La web completa (con la intro 3, 2, 1) |
| `TU-DOMINIO.com.ar/shop` | Productos y suplementos |
| `TU-DOMINIO.com.ar/mapa` | Mapa de Starke a pantalla completa |
| `TU-DOMINIO.com.ar/actividades` | La web, directo en las actividades |
| `TU-DOMINIO.com.ar/horarios` | La web, directo en horarios y mapa |

Entrando por cualquier link que no sea la portada, la intro no aparece (va directo).

## Dónde se edita todo

- **`src/data/starke.js`** → WhatsApp, Instagram, dirección, mapa, horarios, actividades (con sus wa.link), pasos de la clase gratis, cintas, formas de entrega, crédito del footer.
- **Precios** → `shop.mostrarPrecios` en `src/data/starke.js`. Hoy está en `false` (lo pidió el dueño): no se ve ningún precio, las tarjetas dicen "Consultá precio" y el WhatsApp sale como "Quiero consultar precio y disponibilidad de…". Si algún día quieren mostrarlos, se pone en `true` y se cargan los precios en las variantes. `shop.porPagina` = cuántos productos se ven antes del botón "Ver más".
- **`src/data/productos.js`** → catálogo de ENA (datos reales de ENA), las categorías, las marcas y `DESTACADOS` (los que salen en la portada). Formato: descripción, beneficios, modo de uso, sabores con su color, tamaños con servicios y duración, y las variantes `[sabor, tamaño, precio, foto]`. Si Starke no tiene un sabor o tamaño, se borra esa línea de `v`.
- **`src/data/proveedores/`** → `star.js` (51), `gold.js` (31) y `granger.js` (30): productos sacados de starnutrition.com.ar, goldnutrition.com.ar y grangernutricion.com (nombre, foto por sabor, descripción, modo de uso, presentación). Mismo formato que ENA, sin precios. Para sacar un producto que Starke no trae: se borra su bloque `{ … }`.
- **Marcas (arriba del shop)** → `src/data/marcas.js`: logo de cada marca (en `src/assets/marcas/`, sacados de las webs oficiales y pasados a blanco), tamaño del logo (`esc`) y el producto que sale de foto en su tarjeta. Sin marca elegida se ven 4 tarjetas (carrusel en el celu, 2 por fila en tablet, 4 en compu); al tocar una se convierte en un banner rojo con el logo grande, la cantidad de productos, de qué tiene más y botones para cambiar de marca o ver todas. En compu también se cambia desde la barra fija; en el celu esa fila se esconde para que la barra ocupe menos.
- **Orden del shop** → por categoría y, adentro de cada una, intercalando marcas (así en la primera página se ven las 4). Filtros: buscador (por nombre, marca, categoría o sabor), marca, categoría y objetivo.
- **Fotos de productos** → `src/assets/productos/`. `npm run fotos` baja la principal y la de cada sabor/tamaño de las 4 marcas (`npm run fotos -- --marca=gold` para una sola). Las de ENA quedan con el mismo nombre que en ENA; las otras como `star-…`, `gold-…`, `granger-…`. Para poner a mano la principal de un producto: `<id>.webp`. Si falta una foto, la web usa la online de la marca; si tampoco carga, muestra el nombre del producto.
- **Mapa** → todo en `src/data/starke.js`: `negocio.ubicacion` (lat/lng del pin) y el bloque `mapa`: estilo con el que arranca (oscuro / claro / calles), si la gente puede cambiarlo, zoom, color del pin y de la ruta, texto del cartel, radio del círculo, una indicación extra ("portón negro…"), la ruta (activa, modos auto / a pie / bici, indicaciones paso a paso), botones opcionales (Waze, Google Maps) y puntos de referencia extra (paradas, estacionamiento…).
  - No usa Google ni abre ninguna app: el mapa base es CARTO/OpenStreetMap y "Cómo llegar" pide la ubicación y dibuja el camino en el mismo mapa con OSRM (servidor gratis de FOSSGIS). Si ese servicio no responde, muestra la distancia en línea recta.
  - Uso del servicio de rutas: gratis para poco tráfico (1 pedido por segundo como máximo, con créditos a OpenStreetMap, que ya están en la tarjeta).
- **Colores y tipografías** → `tailwind.config.js` (negro, rojo, led, tiza…) y `src/main.jsx` (Barlow Condensed + Barlow, autoalojadas con @fontsource).
- **Logo** → `src/components/Logo.jsx` y `public/favicon.svg` (versión dibujada del logo del Instagram).

## Animaciones

- Intro: el reloj LED del gym hace 3, 2, 1 y la pantalla se parte en dos (no sale si entran directo a /links).
- Hero: el título sube línea por línea; "STARKE" gigante calado de fondo con parallax.
- Tablero con reloj de siete segmentos: cuenta en vivo cuánto falta para cerrar (o para abrir) según los horarios.
- Cintas cruzadas roja y blanca que corren solas y se tuercen con la velocidad del scroll (`useVelocity`).
- Títulos que aparecen cortados de abajo hacia arriba; filas de actividades con barrido rojo.
- Pasos de la clase gratis: el número se enciende segmento por segmento.
- Cambio de página con barrido rojo "STARKE".
- Shop: letras del título que caen con resorte, filtros con píldora que se desliza (`layoutId`), grilla que se reacomoda (`layout` + `AnimatePresence`), puntitos de colores con los sabores en cada tarjeta.
- Ficha del producto: al elegir sabor o tamaño cambia la foto (entra girando) y el círculo de fondo toma el color del sabor; miniaturas por sabor; servicios y duración que cambian con el tamaño; si un sabor no viene en ese tamaño, se acomoda solo al más parecido; modo de uso desplegable. El producto vuela hasta el botón del pedido y el contador rebota.
- Mapa de Starke (portada, /mapa y "Cómo llegar" en /links): pin con el logo que flota y late, radio de 5 cuadras, estado abierto/cerrado, cambio de estilo (oscuro / claro / calles), y "Cómo llegar" que dibuja el camino desde donde estás con tiempo, distancia, modo (auto / caminando / bici) e indicaciones paso a paso. En el celu (salvo en /mapa) el mapa se mueve recién después de tocarlo.
- Pedido / consulta: panel lateral (abajo en el celu), líneas que entran y salen, contador de productos que se actualiza (o el total, si se muestran precios). Shop con "Ver más" y barrita de progreso.
- Navbar que se esconde al bajar, menú del celu tipo telón rojo, scroll suave con Lenis.
- Respeta "reducir movimiento" del sistema (`MotionConfig reducedMotion="user"`).

## Builds

```bash
npm run build          # dist/ para subir a Hostinger (public_html), incluye .htaccess
npm run build:single   # dist-single/index.html (todo en un archivo, abre con doble clic)
```

En Hostinger las páginas son `/shop`, `/links`, `/mapa`, `/actividades` y `/horarios` (el `.htaccess` hace que funcionen).
Abierto con doble clic usa `#/shop`, `#/links`, `#/mapa`.

## Pendiente de confirmar con Starke

- Número de WhatsApp (`negocio.whatsapp`): hoy es el 11 2370-9305 de la web vieja y los flyers.
- Dirección exacta y horarios reales (los de ahora son de ejemplo; lo único confirmado es que cierra a las 22). Confirmar que el pin del mapa está bien puesto.
- Qué productos, sabores y tamaños trae de cada marca (hoy están todos los de las webs de ENA, Star, Gold y Granger). Los precios no se muestran.
- Que revende esas marcas oficialmente (las fotos y textos son de las webs de cada marca).
- Logo en vector y fotos/videos del gym.
- Dominio: hoy dice `TU-DOMINIO.com.ar` en `index.html`, `public/robots.txt`, `public/sitemap.xml` y `src/data/starke.js`.
