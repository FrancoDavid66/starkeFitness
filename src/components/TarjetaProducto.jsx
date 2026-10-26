import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import FotoProducto from './FotoProducto';
import { usePedido } from '../context/Pedido';
import { nombreCategoria, nombreObjetivo, precioDesde, tieneOpciones, variantePorDefecto, variosPrecios } from '../data/productos';
import { plata } from '../lib/util';

// Puntito de color de un sabor (con borde si el color es muy claro)
export const PuntoSabor = ({ color, className = 'h-3.5 w-3.5' }) => (
  <i className={`inline-block flex-none rounded-full ring-1 ring-white/25 ${className}`} style={{ background: color }} aria-hidden="true" />
);

export default function TarjetaProducto({ p, i = 0, ref }) {
  const { agregar, verProducto } = usePedido();
  const foto = useRef(null);
  const [agregado, setAgregado] = useState(false);
  const opciones = tieneOpciones(p);
  const sabores = p.sabores || [];

  const alTocar = () => {
    if (opciones) return verProducto(p.id);
    const v = variantePorDefecto(p);
    agregar(p.id, { s: v.s, t: v.t, desde: foto.current });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1300);
  };

  return (
    <motion.article
      ref={ref}
      layout="position"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, pointerEvents: 'none', transition: { duration: 0.25, delay: 0 } }}
      transition={{ duration: 0.4, delay: Math.min(i, 12) * 0.03, ease: [0.7, 0, 0.25, 1] }}
      className="flex w-full min-w-0 flex-col bg-panel"
    >
      <button
        ref={foto}
        type="button"
        onClick={() => verProducto(p.id)}
        className="group relative block aspect-square w-full overflow-hidden bg-tiza"
        aria-label={`Ver ${p.n}`}
      >
        <FotoProducto
          p={p}
          className="h-full w-full object-contain p-[9%] mix-blend-multiply transition-transform duration-500 ease-golpe group-hover:-rotate-2 group-hover:scale-[1.06]"
        />
        {p.g[0] && (
          <span className="absolute left-2.5 top-2.5 bg-negro px-2 py-[3px] font-cond text-sm font-bold uppercase tracking-[.04em] text-white">
            {nombreObjetivo[p.g[0]]}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-[11px] pb-[13px] sm:p-3.5 sm:pb-4">
        <p className="text-sm text-gris">{nombreCategoria[p.c]}</p>
        <h3 className="font-cond text-xl font-extrabold uppercase leading-none sm:text-2xl">{p.n}</h3>

        {sabores.length > 1 && (
          <div className="mt-1 flex items-center gap-1.5" aria-label={`${sabores.length} sabores: ${sabores.map(([n]) => n).join(', ')}`}>
            {sabores.slice(0, 6).map(([n, color]) => (
              <PuntoSabor key={n} color={color} />
            ))}
            <span className="ml-0.5 text-[13px] text-gris">{sabores.length} sabores</span>
          </div>
        )}

        <div className="mt-auto flex flex-col items-stretch gap-2.5 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="precio self-start text-xl sm:self-auto sm:text-[22px]">
            <span>
              {variosPrecios(p) && <small className="mr-1 text-sm font-bold">desde</small>}
              {plata(precioDesde(p))}
            </span>
          </span>
          <button
            type="button"
            onClick={alTocar}
            className={`min-h-[40px] border-2 px-3.5 font-cond text-[17px] font-extrabold uppercase italic transition-colors ${
              agregado ? 'border-verde bg-verde text-negro' : 'border-white hover:bg-white hover:text-negro'
            }`}
          >
            {opciones ? 'Elegir' : agregado ? 'Agregado' : 'Agregar'}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
