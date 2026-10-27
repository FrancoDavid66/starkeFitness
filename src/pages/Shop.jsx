import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TarjetaProducto from '../components/TarjetaProducto';
import { IconoLupa } from '../components/Iconos';
import { CATEGORIAS, MARCAS, OBJETIVOS, nombreCategoria, productos } from '../data/productos';
import { shop } from '../data/starke';
import { moverPor } from '../lib/scroll';
import { normalizar } from '../lib/util';

const TITULO = 'STARKE SHOP'.split('');

// texto donde busca el buscador: nombre, marca, categoría y sabores
const textoDe = Object.fromEntries(
  productos.map((p) => [p.id, normalizar(`${p.n} ${p.m} ${nombreCategoria[p.c]} ${(p.sabores || []).map(([n]) => n).join(' ')}`)])
);

const cuantos = (n) => (n === 1 ? '1 producto' : `${n} productos`);

export default function Shop() {
  const [cat, setCat] = useState('todo');
  const [marca, setMarca] = useState(null);
  const [obj, setObj] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [mostrar, setMostrar] = useState(shop.porPagina);
  const herramientas = useRef(null);
  const cuerpo = useRef(null);

  const q = normalizar(busqueda.trim());
  const palabras = q.split(/\s+/).filter(Boolean); // "star whey" encuentra "Platinum Whey… Star Nutrition"
  const pasa = (p, { sinCat = false, sinMarca = false } = {}) =>
    (sinCat || cat === 'todo' || p.c === cat) &&
    (sinMarca || !marca || p.m === marca) &&
    (!obj || p.g.includes(obj)) &&
    palabras.every((w) => textoDe[p.id].includes(w));

  const lista = useMemo(() => productos.filter((p) => pasa(p)), [cat, marca, obj, q]); // eslint-disable-line react-hooks/exhaustive-deps

  // cuántos productos hay en cada categoría / marca con el resto de los filtros puestos
  const porCat = useMemo(() => {
    const c = { todo: 0 };
    productos.forEach((p) => {
      if (!pasa(p, { sinCat: true })) return;
      c.todo++;
      c[p.c] = (c[p.c] || 0) + 1;
    });
    return c;
  }, [marca, obj, q]); // eslint-disable-line react-hooks/exhaustive-deps

  const porMarca = useMemo(() => {
    const c = {};
    productos.forEach((p) => pasa(p, { sinMarca: true }) && (c[p.m] = (c[p.m] || 0) + 1));
    return c;
  }, [cat, obj, q]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibles = lista.slice(0, mostrar);
  const faltan = lista.length - visibles.length;

  // Al cambiar el filtro vuelve a la primera "página" y, si bajaste mucho, al principio de la grilla
  const alFiltrar = () => {
    setMostrar(shop.porPagina);
    requestAnimationFrame(() => {
      const y = cuerpo.current.getBoundingClientRect().top - herramientas.current.getBoundingClientRect().bottom;
      if (y < 0) moverPor(y);
    });
  };

  const limpiar = () => {
    setCat('todo');
    setMarca(null);
    setObj(null);
    setBusqueda('');
    setMostrar(shop.porPagina);
  };

  return (
    <>
      <section className="px-gutter pb-[30px] pt-[130px]">
        <h1 className="tit text-[clamp(70px,13vw,200px)] leading-[.84]" aria-label="Starke shop">
          {TITULO.map((c, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="inline-block"
              initial={{ y: -90, opacity: 0, rotate: -8 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.15 + i * 0.04 }}
            >
              {c === ' ' ? '\u00A0' : c}
            </motion.span>
          ))}
        </h1>
        <p className="bajada">
          Suplementos {MARCAS.slice(0, -1).join(', ')} y {MARCAS.at(-1)} para acompañar tu entrenamiento.{' '}
          {shop.mostrarPrecios
            ? 'Armás el pedido acá, lo mandás por WhatsApp y lo retirás en el gym.'
            : 'Elegí lo que te interesa, mandanos la consulta por WhatsApp y te pasamos precio y disponibilidad.'}
        </p>
      </section>

      <div
        ref={herramientas}
        className="sticky z-20 grid gap-3.5 border-b-2 border-linea bg-black/[.97] px-gutter py-4 backdrop-blur-md transition-[top] duration-300"
        style={{ top: 'var(--nav-h, 76px)' }}
      >
        <div className="grid gap-3.5 lg:flex lg:items-center">
          <label className="flex min-h-[50px] w-full items-center gap-2.5 border-2 border-[#3a3a3a] bg-[#0b0b0b] px-3.5 focus-within:border-white lg:max-w-[440px]">
            <IconoLupa className="flex-none opacity-60" />
            <span className="sr-only">Buscar producto</span>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setMostrar(shop.porPagina);
              }}
              placeholder="Buscar: whey, creatina, Star, chocolate…"
              className="min-w-0 flex-1 bg-transparent py-3 text-[17px] text-white outline-none placeholder:text-[#777]"
            />
          </label>

          <div className="sin-barra flex items-center gap-2 overflow-x-auto" role="group" aria-label="Marca">
            <span className="mr-1 flex-none text-[15px] text-gris">Marca:</span>
            {MARCAS.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={marca === m}
                onClick={() => {
                  setMarca((x) => (x === m ? null : m));
                  alFiltrar();
                }}
                className={`chip isolate ${marca === m ? 'border-white text-negro' : ''} ${porMarca[m] ? '' : 'opacity-40'}`}
              >
                {marca === m && <motion.span layoutId="chip-marca" className="absolute -inset-[2px] -z-10 bg-white" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                {m}
                <small className={`ml-1.5 text-[13px] font-semibold not-italic ${marca === m ? 'text-negro/60' : 'text-gris'}`}>{porMarca[m] || 0}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="sin-barra flex gap-2 overflow-x-auto" role="group" aria-label="Categorías">
          {CATEGORIAS.map(([k, l]) => (
            <button
              key={k}
              type="button"
              aria-pressed={cat === k}
              onClick={() => {
                setCat(k);
                alFiltrar();
              }}
              className={`chip isolate ${cat === k ? 'border-white text-negro' : ''} ${porCat[k] || cat === k ? '' : 'opacity-40'}`}
            >
              {cat === k && <motion.span layoutId="chip-cat" className="absolute -inset-[2px] -z-10 bg-white" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
              {l}
            </button>
          ))}
        </div>
      </div>

      <section ref={cuerpo} className="px-gutter pb-[120px] pt-5" aria-label="Productos">
        <div className="sin-barra mb-4 flex items-center gap-2 overflow-x-auto" role="group" aria-label="Objetivo">
          <span className="mr-1 flex-none text-[15px] text-gris">Tu objetivo:</span>
          {OBJETIVOS.map(([k, l]) => (
            <button
              key={k}
              type="button"
              aria-pressed={obj === k}
              onClick={() => {
                setObj((o) => (o === k ? null : k));
                alFiltrar();
              }}
              className={`chip isolate ${obj === k ? 'border-rojo' : ''}`}
            >
              {obj === k && <motion.span layoutId="chip-obj" className="absolute -inset-[2px] -z-10 bg-rojo" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
              {l}
            </button>
          ))}
        </div>

        <div className="mb-[18px] flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] text-gris" aria-live="polite">
          <span>
            {cuantos(lista.length)}
            {marca && ` de ${marca}`}
          </span>
          {(cat !== 'todo' || marca || obj || q) && (
            <button type="button" onClick={limpiar} className="underline hover:text-white">
              Sacar filtros
            </button>
          )}
        </div>

        {lista.length ? (
          <>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(225px,1fr))] sm:gap-[18px]">
              <AnimatePresence mode="popLayout" initial={false}>
                {visibles.map((p, i) => (
                  <TarjetaProducto key={p.id} p={p} i={i % shop.porPagina} />
                ))}
              </AnimatePresence>
            </div>

            {faltan > 0 && (
              <div className="mt-10 grid justify-items-center gap-3">
                <p className="text-[15px] text-gris">
                  Viendo {visibles.length} de {lista.length}
                </p>
                <div className="h-1 w-[min(320px,80%)] overflow-hidden bg-[#222]">
                  <motion.div className="h-full bg-rojo" animate={{ width: `${(visibles.length / lista.length) * 100}%` }} transition={{ duration: 0.4 }} />
                </div>
                <button type="button" className="btn btn-borde mt-2" onClick={() => setMostrar((n) => n + shop.porPagina)}>
                  Ver más productos
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="border-2 border-dashed border-[#3a3a3a] px-6 py-[50px] text-center">
            <p className="mb-[18px] text-[#cfcfcf]">
              No hay productos para “{busqueda || 'ese filtro'}”. Probá con otra palabra o mirá todo el catálogo.
            </p>
            <button type="button" className="btn btn-borde btn-chico" onClick={limpiar}>
              Ver todo el catálogo
            </button>
          </div>
        )}
      </section>
    </>
  );
}
