import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { cintas } from '../../data/starke';

// Dos cintas cruzadas (blanca y roja) que corren solas
// y se tuercen un poco según la velocidad del scroll.
export default function Cintas() {
  const { scrollY } = useScroll();
  const velocidad = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });
  const extra = useTransform(velocidad, [-3000, 0, 3000], [-4, 0, 4], { clamp: true });
  const giroRoja = useTransform(extra, (v) => -3 + v);
  const giroBlanca = useTransform(extra, (v) => 2.4 - v);

  return (
    <div className="relative z-[3] h-[130px] overflow-hidden md:h-[170px]" aria-hidden="true">
      <Cinta palabras={cintas.blanca} giro={giroBlanca} className="bg-white text-negro" alReves />
      <Cinta palabras={cintas.roja} giro={giroRoja} className="z-[2] bg-rojo text-white" />
    </div>
  );
}

function Cinta({ palabras, giro, className, alReves = false }) {
  const tira = [0, 1, 2, 3].flatMap((vuelta) => palabras.map((w) => ({ w, k: `${vuelta}-${w}` })));
  return (
    <motion.div
      style={{ rotate: giro, y: '-50%' }}
      className={`absolute -left-[6vw] -right-[6vw] top-1/2 flex h-[52px] items-center overflow-hidden md:h-16 ${className}`}
    >
      <div className={`pista ${alReves ? 'al-reves' : ''}`}>
        {tira.map(({ w, k }) => (
          <span key={k} className="inline-flex items-center gap-[30px] px-[22px] font-cond text-[28px] font-black uppercase italic md:gap-11 md:text-4xl">
            {w}
            <i className="h-4 w-4 rounded-full border-4 border-current" />
          </span>
        ))}
      </div>
    </motion.div>
  );
}
