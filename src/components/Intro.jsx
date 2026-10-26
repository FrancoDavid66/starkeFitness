import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Digito } from './Led';
import { wait } from '../lib/util';

const golpe = [0.7, 0, 0.25, 1];

// Pantalla de carga: el reloj del gym hace 3, 2, 1 y la pantalla se parte en dos.
export default function Intro({ onListo, onFin }) {
  const [n, setN] = useState('3');
  const [abre, setAbre] = useState(false);
  const saltar = useRef(false);
  const reducir = useReducedMotion();

  useEffect(() => {
    let vivo = true;
    (async () => {
      if (!reducir) {
        for (const d of ['3', '2', '1']) {
          if (!vivo || saltar.current) break;
          setN(d);
          await wait(430);
        }
      }
      if (!vivo) return;
      setAbre(true);
      onListo();
      await wait(reducir ? 0 : 800);
      if (vivo) onFin();
    })();
    return () => {
      vivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => (saltar.current = true)}
      aria-hidden="true"
    >
      <motion.div
        className="absolute -left-[10%] -right-[10%] top-0 h-[51%] border-b-[3px] border-rojo bg-negro"
        animate={abre ? { y: '-102%', skewY: -4 } : { y: 0 }}
        transition={{ duration: 0.7, ease: golpe }}
      />
      <motion.div
        className="absolute -left-[10%] -right-[10%] bottom-0 h-[51%] bg-negro"
        animate={abre ? { y: '102%', skewY: -4 } : { y: 0 }}
        transition={{ duration: 0.7, ease: golpe }}
      />
      <motion.div className="relative z-[2] text-center" animate={{ opacity: abre ? 0 : 1 }} transition={{ duration: 0.2 }}>
        <motion.div
          key={n}
          className="mx-auto w-[min(28vw,170px)]"
          initial={{ scale: 1.25, opacity: 0.2 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.42, ease: 'easeOut' }}
        >
          <Digito c={n} className="h-auto w-full" />
        </motion.div>
        <p className="mt-[22px] font-cond text-xl font-extrabold uppercase italic tracking-[.3em] text-gris">Starke Fitness</p>
      </motion.div>
    </motion.div>
  );
}
