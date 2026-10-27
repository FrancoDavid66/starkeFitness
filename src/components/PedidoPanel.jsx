import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FotoProducto from './FotoProducto';
import Cantidad from './Cantidad';
import { Digito } from './Led';
import { IconoWhatsApp } from './Iconos';
import { fotoLinea, precioLinea, usePedido, variante } from '../context/Pedido';
import { nombreCategoria, porId } from '../data/productos';
import { entregas, shop } from '../data/starke';
import { Link } from '../lib/router';
import { bloquearScroll } from '../lib/scroll';
import { plata } from '../lib/util';

// Panel del pedido: a la derecha en compu, desde abajo en el celu
export default function PedidoPanel() {
  const { abierto, cerrar, items, cantidad, total, cambiar, quitar, enviar } = usePedido();
  const [nombre, setNombre] = useState('');
  const [entrega, setEntrega] = useState(entregas[0]);
  const movil = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

  useEffect(() => {
    if (!abierto) return;
    bloquearScroll(true);
    const tecla = (e) => e.key === 'Escape' && cerrar();
    window.addEventListener('keydown', tecla);
    return () => {
      bloquearScroll(false);
      window.removeEventListener('keydown', tecla);
    };
  }, [abierto, cerrar]);

  const fuera = movil ? { y: '105%' } : { x: '105%' };

  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div
            key="velo"
            className="fixed inset-0 z-[70] bg-black/70"
            onClick={cerrar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Tu pedido"
            className="fixed inset-x-0 bottom-0 z-[71] flex h-[90svh] flex-col border-t-[3px] border-rojo bg-[#0e0e0e] md:inset-y-0 md:left-auto md:right-0 md:h-auto md:w-[440px] md:border-l-[3px] md:border-t-0"
            initial={fuera}
            animate={{ x: 0, y: 0 }}
            exit={fuera}
            transition={{ duration: 0.45, ease: [0.7, 0, 0.25, 1] }}
          >
            <header className="flex items-center justify-between border-b-2 border-linea px-[22px] py-5">
              <h2 className="tit text-[40px] leading-none">Tu pedido</h2>
              <button type="button" onClick={cerrar} aria-label="Cerrar pedido" className="grid h-11 w-11 place-items-center border-2 border-[#3a3a3a] text-xl hover:border-white">
                ✕
              </button>
            </header>

            <div className="flex-1 overflow-auto px-[22px] py-2" data-lenis-prevent>
              {!items.length && (
                <div className="px-1.5 py-10 text-center text-[#cfcfcf]">
                  <Digito c="0" className="mx-auto mb-5 h-auto w-[60px]" />
                  <p className="mb-5">Tu pedido está vacío. Elegí un suplemento del shop para empezar.</p>
                  <Link to="/shop" onClick={cerrar} className="btn btn-borde btn-chico">
                    Ir al shop
                  </Link>
                </div>
              )}
              <AnimatePresence initial={false}>
                {items.map((l) => {
                  const p = porId[l.id];
                  return (
                    <motion.div
                      key={l.key}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40, height: 0, paddingTop: 0, paddingBottom: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-[64px_1fr_auto] items-center gap-3.5 overflow-hidden border-b border-linea py-3.5"
                    >
                      <div className="relative h-16 w-16 overflow-hidden bg-tiza">
                        <FotoProducto key={fotoLinea(l) || p.img} p={p} ruta={fotoLinea(l)} chica className="h-full w-full object-contain p-1.5 mix-blend-multiply" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-cond text-[19px] font-extrabold uppercase leading-none">{p.n}</h4>
                        <p className="mb-1.5 mt-[3px] text-[13px] text-gris">{[p.m, variante(l) || nombreCategoria[p.c]].filter(Boolean).join(' · ')}</p>
                        <Cantidad chico valor={l.q} onCambiar={(d) => cambiar(l.key, d)} />
                      </div>
                      <div className="text-right">
                        {shop.mostrarPrecios && precioLinea(l) != null && (
                          <div className="font-cond text-xl font-extrabold">{plata(precioLinea(l) * l.q)}</div>
                        )}
                        <button type="button" onClick={() => quitar(l.key)} className="mt-1.5 text-[13px] text-gris underline hover:text-white">
                          Quitar
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {items.length > 0 && (
              <div className="grid gap-3.5 border-t-2 border-linea px-[22px] pb-[22px] pt-[18px]">
                <div className="flex items-baseline justify-between font-cond text-[22px] font-extrabold uppercase">
                  <span>{total != null ? 'Total' : 'Productos'}</span>
                  <motion.strong key={total ?? cantidad} initial={{ y: -8, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} className="text-4xl font-black italic">
                    {total != null ? plata(total) : cantidad}
                  </motion.strong>
                </div>
                {total == null && <p className="-mt-2 text-sm text-gris">Te pasamos precio y disponibilidad por WhatsApp.</p>}

                <fieldset className="grid gap-2">
                  <legend className="mb-1.5 text-sm text-gris">Entrega</legend>
                  {entregas.map((e) => (
                    <label
                      key={e}
                      className={`flex cursor-pointer items-center gap-2.5 border-2 px-3 py-2.5 text-[15px] ${entrega === e ? 'border-white' : 'border-[#333]'}`}
                    >
                      <input type="radio" name="entrega" value={e} checked={entrega === e} onChange={() => setEntrega(e)} className="h-[18px] w-[18px] accent-rojo" />
                      {e}
                    </label>
                  ))}
                </fieldset>

                <label className="grid gap-1.5 text-sm text-gris">
                  <span>Tu nombre</span>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    autoComplete="name"
                    placeholder="Para saber a quién responderle"
                    className="min-h-[48px] border-2 border-[#333] bg-negro p-3 text-base text-white outline-none focus:border-white"
                  />
                </label>

                <button type="button" className="btn btn-rojo w-full" onClick={() => enviar({ nombre: nombre.trim(), entrega })}>
                  <IconoWhatsApp />
                  {shop.mostrarPrecios ? 'Enviar pedido por WhatsApp' : 'Consultar por WhatsApp'}
                </button>
                <p className="text-center text-[13px] text-[#777]">Se abre WhatsApp con la consulta escrita. La revisás y la mandás.</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
