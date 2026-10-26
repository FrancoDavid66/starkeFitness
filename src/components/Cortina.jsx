import { AnimatePresence, motion } from 'framer-motion';

// Barrido rojo con "STARKE" al pasar de una página a otra
export default function Cortina({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cortina"
          aria-hidden="true"
          className="pointer-events-none fixed inset-y-0 -left-[20%] -right-[20%] z-[90] grid place-items-center bg-rojo"
          initial={{ x: '-130%', skewX: -12 }}
          animate={{ x: '0%', skewX: -12 }}
          exit={{ x: '130%', skewX: -12 }}
          transition={{ duration: 0.42, ease: [0.7, 0, 0.25, 1] }}
        >
          <span className="tit leading-none text-negro" style={{ fontSize: 'clamp(80px,18vw,260px)', transform: 'skewX(12deg)' }}>
            STARKE
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
