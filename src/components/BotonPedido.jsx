import { AnimatePresence, motion } from 'framer-motion';
import { IconoBolsa } from './Iconos';
import { usePedido } from '../context/Pedido';

// Botón flotante del pedido (en el shop, cuando hay algo agregado)
export default function BotonPedido() {
  const { cantidad, abrir, destino, golpe } = usePedido();
  return (
    <AnimatePresence>
      {cantidad > 0 && (
        <motion.button
          ref={destino}
          data-prioridad="2"
          type="button"
          onClick={abrir}
          aria-label={`Ver tu pedido (${cantidad})`}
          className="fixed bottom-[18px] right-[18px] z-40 inline-flex min-h-[56px] items-center gap-2.5 bg-rojo px-5 font-cond text-xl font-black uppercase italic shadow-[0_10px_30px_rgba(227,19,27,.4)]"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          whileTap={{ scale: 0.95 }}
        >
          <IconoBolsa />
          Ver pedido
          <motion.b
            key={golpe}
            initial={golpe ? { scale: 1.6 } : false}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 600, damping: 14 }}
            className="inline-grid h-[26px] min-w-[26px] place-items-center bg-negro px-1.5 text-[17px] not-italic"
          >
            {cantidad}
          </motion.b>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
