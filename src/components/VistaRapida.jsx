import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FotoProducto from './FotoProducto';
import Cantidad from './Cantidad';
import { PuntoSabor } from './TarjetaProducto';
import { IconoCaja, IconoCalendario, IconoMas, IconoVaso } from './Iconos';
import { usePedido } from '../context/Pedido';
import {
  colorSabor, datosDe, nombreCategoria, nombreObjetivo, porId, varianteDe, variantePorDefecto, variantes,
} from '../data/productos';
import { shop } from '../data/starke';
import { bloquearScroll } from '../lib/scroll';
import { plata } from '../lib/util';

const golpe = [0.7, 0, 0.25, 1];

// Ficha del producto: foto que cambia con el sabor, descripción, beneficios, sabor, tamaño, cantidad y "Agregar"
export default function VistaRapida() {
  const { vista, cerrarVista, agregar } = usePedido();
  const p = vista ? porId[vista] : null;
  return <AnimatePresence>{p && <Ficha key={p.id} p={p} cerrar={cerrarVista} agregar={agregar} />}</AnimatePresence>;
}

const iconoDato = (txt) => (/servicio/i.test(txt) ? IconoVaso : /mes|día|dias|días/i.test(txt) ? IconoCalendario : IconoCaja);

function Ficha({ p, cerrar, agregar }) {
  const vs = variantes(p);
  const inicial = variantePorDefecto(p);
  const [s, setS] = useState(inicial.s);
  const [t, setT] = useState(inicial.t);
  const [cant, setCant] = useState(1);
  const [uso, setUso] = useState(false);
  const foto = useRef(null);
  const btnCerrar = useRef(null);

  useEffect(() => {
    bloquearScroll(true);
    btnCerrar.current?.focus();
    const tecla = (e) => e.key === 'Escape' && cerrar();
    window.addEventListener('keydown', tecla);
    return () => {
      bloquearScroll(false);
      window.removeEventListener('keydown', tecla);
    };
  }, [cerrar]);

  const actual = varianteDe(p, s, t) || inicial;
  const ruta = actual.img || p.img;
  const color = colorSabor(p, s);

  // solo los sabores y tamaños que existen en las variantes
  const sabores = (p.sabores || []).filter(([n]) => vs.some((v) => v.s === n));
  const tamanos = (p.tamanos || []).filter(([n]) => vs.some((v) => v.t === n));

  // al elegir algo que no existe con la otra opción, se acomoda solo
  const posTam = (n) => (p.tamanos || []).findIndex(([x]) => x === n);
  const elegirSabor = (x) => {
    // si ese sabor no viene en el tamaño elegido, pasa al tamaño más parecido que sí tenga
    const v =
      varianteDe(p, x, t) ||
      vs.filter((y) => y.s === x).sort((a, b) => Math.abs(posTam(a.t) - posTam(t)) - Math.abs(posTam(b.t) - posTam(t)))[0];
    setS(v.s);
    setT(v.t);
  };
  const elegirTam = (x) => {
    const v = varianteDe(p, s, x) || vs.find((y) => y.t === x);
    setS(v.s);
    setT(v.t);
  };

  // miniaturas: una por sabor (con el tamaño elegido si existe)
  const minis = sabores
    .map(([n, c]) => ({ n, c, img: (varianteDe(p, n, t) || vs.find((y) => y.s === n))?.img }))
    .filter((m) => m.img);
  const conMinis = new Set(minis.map((m) => m.img)).size > 1;

  const datos = datosDe(p, t);
  const fuente = p.url || (p.ena ? `https://www.enasport.com/products/${p.ena}` : null);

  const comprar = (
    <div className="flex gap-2.5">
      <Cantidad valor={cant} onCambiar={(d) => setCant((c) => Math.max(1, Math.min(20, c + d)))} />
      <button
        type="button"
        className="btn btn-rojo flex-1 px-4"
        onClick={() => {
          agregar(p.id, { s: actual.s, t: actual.t, q: cant, desde: foto.current });
          cerrar();
        }}
      >
        {shop.mostrarPrecios && actual.precio != null ? `Agregar · ${plata(actual.precio * cant)}` : 'Agregar a la consulta'}
      </button>
    </div>
  );

  return (
    <motion.div className="fixed inset-0 z-[80] grid place-items-center p-0 md:p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/80" onClick={cerrar} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={p.n}
        className="relative flex h-[100svh] w-full flex-col overflow-hidden bg-panel md:h-auto md:max-h-[calc(100svh-24px)] md:w-[min(1040px,100%)]"
        initial={{ y: 40, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.4, ease: golpe }}
      >
        <button
          ref={btnCerrar}
          type="button"
          onClick={cerrar}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-[3] grid h-11 w-11 place-items-center bg-negro text-xl hover:bg-rojo"
        >
          ✕
        </button>

        <div className="min-h-0 flex-1 overflow-auto" data-lenis-prevent>
        <div className="grid md:grid-cols-[1.05fr_1fr]">
          {/* ---------- FOTO ---------- */}
          <div ref={foto} className="relative aspect-square overflow-hidden bg-tiza md:sticky md:top-0 md:aspect-auto md:h-full md:max-h-[calc(100svh-24px)] md:min-h-[560px]">
            {/* halo del color del sabor */}
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-[46%] aspect-square w-[78%] rounded-full"
              style={{ x: '-50%', y: '-50%' }}
              animate={{ backgroundColor: color || '#e3131b', opacity: color ? 0.38 : 0.12, scale: [0.92, 1] }}
              transition={{ duration: 0.5, ease: golpe }}
              key={`halo-${s}`}
            />
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={ruta}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 40, rotate: 4, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, rotate: -4, scale: 0.96 }}
                transition={{ duration: 0.45, ease: golpe }}
              >
                <FotoProducto p={p} ruta={ruta} eager className="h-full w-full object-contain p-[11%] mix-blend-multiply" />
              </motion.div>
            </AnimatePresence>

            {conMinis && (
              <div className="sin-barra absolute inset-x-0 bottom-0 flex gap-2 overflow-x-auto p-3" role="group" aria-label="Sabores en foto">
                {minis.map((m) => (
                  <button
                    key={m.n}
                    type="button"
                    onClick={() => elegirSabor(m.n)}
                    aria-label={m.n}
                    aria-pressed={m.n === s}
                    className={`relative h-16 w-16 flex-none overflow-hidden border-2 bg-white transition-transform hover:-translate-y-0.5 ${
                      m.n === s ? 'border-rojo' : 'border-black/10'
                    }`}
                  >
                    <FotoProducto p={p} ruta={m.img} chica className="h-full w-full object-contain p-1" />
                    <i className="absolute bottom-1 right-1 h-3 w-3 rounded-full ring-1 ring-black/20" style={{ background: m.c }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ---------- INFO ---------- */}
          <div className="flex flex-col gap-4 px-[18px] pb-8 pt-6 md:px-[30px] md:pb-[30px] md:pt-[34px]">
            <p className="text-sm text-gris">
              <span className="font-semibold text-white/80">{p.m}</span> · {nombreCategoria[p.c]}
              {p.g.length > 0 && ` · ${p.g.map((g) => nombreObjetivo[g]).join(', ')}`}
            </p>
            <h2 className="tit -mt-2 pr-12 text-[clamp(36px,4vw,54px)] leading-[.9]">{p.n}</h2>

            {datos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <AnimatePresence mode="popLayout" initial={false}>
                  {datos.map((d) => {
                    const Ico = iconoDato(d);
                    return (
                      <motion.span
                        key={d}
                        layout
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="inline-flex items-center gap-2 bg-panel-2 px-3 py-2 text-[15px]"
                      >
                        <Ico className="text-rojo" />
                        {d}
                      </motion.span>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            <p className="text-[#d6d6d6]">{p.d}</p>

            {p.pills?.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {p.pills.map((x) => (
                  <li key={x} className="border-2 border-[#3a3a3a] px-3 py-1 font-cond text-[15px] font-bold uppercase tracking-[.05em]">
                    {x}
                  </li>
                ))}
              </ul>
            )}

            {sabores.length > 0 && (
              <fieldset className="mt-1">
                <legend className="mb-2.5 font-cond text-lg font-extrabold uppercase tracking-[.06em]">
                  Elegí {(p.labelS || 'Sabor').toLowerCase()} <span className="font-semibold normal-case tracking-normal text-gris">· {s}</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {sabores.map(([n, c]) => {
                    const activo = n === s;
                    const combina = !t || Boolean(varianteDe(p, n, t));
                    return (
                      <button
                        key={n}
                        type="button"
                        aria-pressed={activo}
                        onClick={() => elegirSabor(n)}
                        title={combina ? n : `${n}: solo en otro tamaño`}
                        className={`relative inline-flex min-h-[46px] items-center gap-2.5 rounded-full border-2 py-1.5 pl-2 pr-4 text-[15px] font-semibold transition-colors ${
                          activo ? 'border-white bg-white text-negro' : 'border-[#3a3a3a] hover:border-white'
                        } ${combina || activo ? '' : 'opacity-45'}`}
                      >
                        <PuntoSabor color={c} className="h-7 w-7" />
                        {n}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {tamanos.length > 0 && (
              <fieldset className="mt-1">
                <legend className="mb-2.5 font-cond text-lg font-extrabold uppercase tracking-[.06em]">Elegí {(p.labelTam || 'Tamaño').toLowerCase()}</legend>
                <div className="grid gap-2">
                  {tamanos.map(([n, serv, dur]) => {
                    const activo = n === t;
                    const v = varianteDe(p, s, n);
                    const precio = shop.mostrarPrecios ? (v || vs.find((y) => y.t === n)).precio : null;
                    return (
                      <button
                        key={n}
                        type="button"
                        aria-pressed={activo}
                        onClick={() => elegirTam(n)}
                        className={`grid grid-cols-[22px_1fr_auto] items-center gap-3 border-2 px-3.5 py-3 text-left transition-colors ${
                          activo ? 'border-rojo bg-rojo/15' : 'border-[#3a3a3a] hover:border-white'
                        } ${v || activo ? '' : 'opacity-50'}`}
                      >
                        <span className={`grid h-[22px] w-[22px] place-items-center rounded-full border-2 ${activo ? 'border-rojo' : 'border-[#555]'}`}>
                          {activo && <motion.i layoutId={`tam-${p.id}`} className="h-2.5 w-2.5 rounded-full bg-rojo" />}
                        </span>
                        <span>
                          <span className="block font-cond text-xl font-extrabold uppercase leading-none">{n}</span>
                          <span className="mt-1 block text-[13px] text-gris">
                            {[serv, dur].filter(Boolean).join(' · ')}
                            {!v && !activo && ' · otro sabor'}
                          </span>
                        </span>
                        <span className="font-cond text-xl font-extrabold">{precio != null && plata(precio)}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {p.uso && (
              <div className="border-y-2 border-linea">
                <button
                  type="button"
                  aria-expanded={uso}
                  onClick={() => setUso((u) => !u)}
                  className="flex w-full items-center justify-between py-3.5 font-cond text-lg font-extrabold uppercase tracking-[.06em]"
                >
                  Modo de uso
                  <IconoMas abierto={uso} />
                </button>
                <AnimatePresence initial={false}>
                  {uso && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden text-[15px] text-[#cfcfcf]"
                    >
                      <span className="block pb-4">{p.uso}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="mt-auto hidden pt-2 md:block">{comprar}</div>
            <p className="text-[13px] text-[#777]">
              Foto e información:{' '}
              {fuente ? (
                <a href={fuente} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                  {p.m}
                </a>
              ) : (
                p.m
              )}
              .
              {!shop.mostrarPrecios && ' Precio y stock: consultalo por WhatsApp.'}
            </p>
          </div>
        </div>
        </div>

        {/* en el celu, la compra queda fija abajo */}
        <div className="flex-none border-t-2 border-linea bg-panel p-3 md:hidden">{comprar}</div>
      </motion.div>
    </motion.div>
  );
}
