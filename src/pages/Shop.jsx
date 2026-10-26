import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TarjetaProducto from '../components/TarjetaProducto';
import { IconoLupa } from '../components/Iconos';
import { CATEGORIAS, OBJETIVOS, nombreCategoria, productos } from '../data/productos';
import { moverPor } from '../lib/scroll';
import { normalizar } from '../lib/util';

const TITULO = 'STARKE SHOP'.split('');

export default function Shop() {
  const [cat, setCat] = useState('todo');
  const [obj, setObj] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const herramientas = useRef(null);
  const cuerpo = useRef(null);

  const lista = useMemo(() => {
    const q = normalizar(busqueda.trim());
    return productos.filter(
      (p) =>
        (cat === 'todo' || p.c === cat) &&
        (!obj || p.g.includes(obj)) &&
        (!q || normalizar(`${p.n} ${nombreCategoria[p.c]}`).includes(q))
    );
  }, [cat, obj, busqueda]);

  // Al cambiar el filtro, si bajaste mucho, vuelve al principio de la grilla
  const alGrilla = () =>
    requestAnimationFrame(() => {
      const y = cuerpo.current.getBoundingClientRect().top - herramientas.current.getBoundingClientRect().bottom;
      if (y < 0) moverPor(y);
    });

  const limpiar = () => {
    setCat('todo');
    setObj(null);
    setBusqueda('');
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
              {c === ' ' ? ' ' : c}
            </motion.span>
          ))}
        </h1>
        <p className="bajada">Suplementos ENA para acompañar tu entrenamiento. Armás el pedido acá, lo mandás por WhatsApp y lo retirás en el gym.</p>
      </section>

      <div
        ref={herramientas}
        className="sticky z-20 grid gap-3.5 border-b-2 border-linea bg-black/90 px-gutter py-4 backdrop-blur-md transition-[top] duration-300"
        style={{ top: 'var(--nav-h, 76px)' }}
      >
        <label className="flex min-h-[50px] max-w-[520px] items-center gap-2.5 border-2 border-[#3a3a3a] bg-[#0b0b0b] px-3.5 focus-within:border-white">
          <IconoLupa className="flex-none opacity-60" />
          <span className="sr-only">Buscar producto</span>
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar: whey, creatina, magnesio…"
            className="min-w-0 flex-1 bg-transparent py-3 text-[17px] text-white outline-none placeholder:text-[#777]"
          />
        </label>

        <div className="sin-barra flex gap-2 overflow-x-auto" role="group" aria-label="Categorías">
          {CATEGORIAS.map(([k, l]) => (
            <button
              key={k}
              type="button"
              aria-pressed={cat === k}
              onClick={() => {
                setCat(k);
                alGrilla();
              }}
              className={`chip isolate ${cat === k ? 'border-white text-negro' : ''}`}
            >
              {cat === k && <motion.span layoutId="chip-cat" className="absolute -inset-[2px] -z-10 bg-white" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
              {l}
            </button>
          ))}
        </div>

        <div className="sin-barra flex items-center gap-2 overflow-x-auto" role="group" aria-label="Objetivo">
          <span className="mr-1 flex-none text-[15px] text-gris">Tu objetivo:</span>
          {OBJETIVOS.map(([k, l]) => (
            <button
              key={k}
              type="button"
              aria-pressed={obj === k}
              onClick={() => {
                setObj((o) => (o === k ? null : k));
                alGrilla();
              }}
              className={`chip isolate ${obj === k ? 'border-rojo' : ''}`}
            >
              {obj === k && <motion.span layoutId="chip-obj" className="absolute -inset-[2px] -z-10 bg-rojo" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
              {l}
            </button>
          ))}
        </div>
      </div>

      <section ref={cuerpo} className="px-gutter pb-[120px] pt-7" aria-label="Productos">
        <p className="mb-[18px] text-[15px] text-gris" aria-live="polite">
          {lista.length === 1 ? '1 producto' : `${lista.length} productos`}
        </p>

        {lista.length ? (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(225px,1fr))] sm:gap-[18px]">
            <AnimatePresence mode="popLayout" initial={false}>
              {lista.map((p, i) => (
                <TarjetaProducto key={p.id} p={p} i={i} />
              ))}
            </AnimatePresence>
          </div>
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
