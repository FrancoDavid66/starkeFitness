import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { porId, precioDesde, varianteDe } from '../data/productos';
import { mensajes } from '../data/starke';
import { fotoProducto } from '../lib/fotos';
import { guardarLocal, leerLocal, linkWhatsApp, plata } from '../lib/util';

const PedidoCtx = createContext(null);
const CLAVE = 'starke-pedido-v2';

// l = línea del pedido: { key, id, s (sabor), t (tamaño), q (cantidad) }
const varianteLinea = (l) => varianteDe(porId[l.id], l.s, l.t);
export const precioLinea = (l) => varianteLinea(l)?.precio ?? precioDesde(porId[l.id]);
export const fotoLinea = (l) => varianteLinea(l)?.img || null;
export const variante = (l) => [l.t, l.s].filter(Boolean).join(' · ');

export function PedidoProvider({ children }) {
  const [items, setItems] = useState(() => leerLocal(CLAVE, []).filter((l) => porId[l.id] && varianteDe(porId[l.id], l.s, l.t)));
  const [abierto, setAbierto] = useState(false);
  const [vista, setVista] = useState(null); // id del producto en la vista rápida
  const [vuelos, setVuelos] = useState([]);
  const [golpe, setGolpe] = useState(0); // cambia => el contador del pedido rebota
  const destinos = useRef(new Set());
  const reducir = useReducedMotion();

  useEffect(() => guardarLocal(CLAVE, items), [items]);

  // Botones del pedido (navbar y botón flotante) a donde "vuela" el producto
  const destino = useCallback((el) => {
    if (!el) return;
    destinos.current.add(el);
    return () => destinos.current.delete(el);
  }, []);

  const volar = useCallback(
    (desde, p, ruta) => {
      const visibles = [...destinos.current]
        .filter((el) => el.getClientRects().length)
        .sort((a, b) => (b.dataset.prioridad || 0) - (a.dataset.prioridad || 0));
      const meta = visibles[0];
      if (reducir || !desde || !meta) {
        setGolpe((g) => g + 1);
        return;
      }
      const a = desde.getBoundingClientRect();
      const b = meta.getBoundingClientRect();
      const lado = Math.min(a.width, a.height, 180);
      setVuelos((v) => [
        ...v,
        {
          key: Date.now() + Math.random(),
          src: fotoProducto(p, ruta),
          lado,
          x0: a.left + (a.width - lado) / 2,
          y0: a.top + (a.height - lado) / 2,
          x1: b.left + b.width / 2 - lado / 2,
          y1: b.top + b.height / 2 - lado / 2,
        },
      ]);
    },
    [reducir]
  );

  const agregar = useCallback(
    (id, { t = null, s = null, q = 1, desde = null } = {}) => {
      const key = `${id}|${t ?? ''}|${s ?? ''}`;
      setItems((prev) => {
        const ya = prev.find((l) => l.key === key);
        return ya
          ? prev.map((l) => (l.key === key ? { ...l, q: Math.min(20, l.q + q) } : l))
          : [...prev, { key, id, t, s, q }];
      });
      volar(desde, porId[id], varianteDe(porId[id], s, t)?.img);
    },
    [volar]
  );

  const cambiar = useCallback((key, delta) => {
    setItems((prev) =>
      prev.map((l) => (l.key === key ? { ...l, q: Math.min(20, l.q + delta) } : l)).filter((l) => l.q > 0)
    );
  }, []);

  const quitar = useCallback((key) => setItems((prev) => prev.filter((l) => l.key !== key)), []);

  const cantidad = items.reduce((a, l) => a + l.q, 0);
  const total = items.reduce((a, l) => a + precioLinea(l) * l.q, 0);

  const enviar = useCallback(
    ({ nombre, entrega }) => {
      if (!items.length) return;
      const lineas = items.map((l) => {
        const v = variante(l);
        return `• ${l.q} x ${porId[l.id].n}${v ? ` (${v})` : ''}: ${plata(precioLinea(l) * l.q)}`;
      });
      const texto = [
        mensajes.pedidoIntro,
        '',
        ...lineas,
        '',
        `Total: ${plata(total)}`,
        `Entrega: ${entrega}`,
        nombre ? `Nombre: ${nombre}` : null,
      ]
        .filter((x) => x !== null)
        .join('\n');
      window.open(linkWhatsApp(texto), '_blank', 'noopener');
    },
    [items, total]
  );

  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);
  const verProducto = useCallback((id) => setVista(id), []);
  const cerrarVista = useCallback(() => setVista(null), []);

  const valor = useMemo(
    () => ({
      items, cantidad, total, abierto, vista, golpe,
      agregar, cambiar, quitar, enviar, destino,
      abrir, cerrar, verProducto, cerrarVista,
    }),
    [items, cantidad, total, abierto, vista, golpe, agregar, cambiar, quitar, enviar, destino, abrir, cerrar, verProducto, cerrarVista]
  );

  return (
    <PedidoCtx.Provider value={valor}>
      {children}
      {/* productos volando hacia el botón del pedido */}
      <div className="pointer-events-none fixed inset-0 z-[95]" aria-hidden="true">
        <AnimatePresence>
          {vuelos.map((v) => (
            <motion.div
              key={v.key}
              className="absolute left-0 top-0 overflow-hidden bg-tiza"
              style={{ width: v.lado, height: v.lado }}
              initial={{ x: v.x0, y: v.y0, scale: 1, rotate: 0, opacity: 1 }}
              animate={{
                x: [v.x0, (v.x0 + v.x1) / 2, v.x1],
                y: [v.y0, Math.min(v.y0, v.y1) - 120, v.y1],
                scale: [1, 0.6, 0.12],
                rotate: [0, -12, -20],
                opacity: [1, 1, 0.4],
              }}
              transition={{ duration: 0.75, ease: [0.55, 0, 0.35, 1] }}
              onAnimationComplete={() => {
                setVuelos((todos) => todos.filter((x) => x.key !== v.key));
                setGolpe((g) => g + 1);
              }}
            >
              <img src={v.src} alt="" className="h-full w-full object-contain p-[8%] mix-blend-multiply" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </PedidoCtx.Provider>
  );
}

export const usePedido = () => useContext(PedidoCtx);
