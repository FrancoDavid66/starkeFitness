import { motion } from 'framer-motion';
import { Reloj } from './Led';
import { useReloj } from '../lib/horario';
import { hora } from '../lib/util';

export const Punto = ({ abierto }) => (
  <span className={`h-[11px] w-[11px] flex-none rounded-full ${abierto ? 'punto-abierto bg-verde' : 'bg-rojo'}`} aria-hidden="true" />
);

const Tornillo = ({ className }) => (
  <span className={`absolute h-[9px] w-[9px] rounded-full bg-[#3a3a3a] shadow-[0_0_0_2px_#222] ${className}`} aria-hidden="true" />
);

// Tablero de pared con el reloj LED: cuenta cuánto falta para cerrar (o para abrir)
export default function Tablero({ listo = true }) {
  const r = useReloj();
  return (
    <motion.div
      className="relative z-[2] max-w-[520px] border-2 border-[#2a2a2a] bg-[#0a0a0a] px-[26px] pb-[22px] pt-[26px] shadow-[inset_0_0_0_6px_#121212,0_30px_80px_rgba(0,0,0,.6)] lg:max-w-none"
      initial={{ opacity: 0, y: 30, rotate: 1.5 }}
      animate={listo ? { opacity: 1, y: 0, rotate: -1.2 } : undefined}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.7, 0, 0.25, 1] }}
    >
      <Tornillo className="left-2.5 top-2.5" />
      <Tornillo className="right-2.5 top-2.5" />
      <p className="flex items-center gap-2.5 font-cond text-[19px] font-bold uppercase tracking-[.06em]">
        <Punto abierto={r.abierto} />
        {r.abierto ? 'Abierto ahora' : 'Cerrado ahora'}
      </p>
      <Reloj valor={r.cuenta} className="mb-4 mt-5" />
      <p className="max-w-[34ch] text-[15px] leading-[1.45] text-gris">
        {r.abierto
          ? `Cerramos a las ${hora(r.cierra)}. Es lo que te queda para entrenar hoy.`
          : `Abrimos ${r.cuando} a las ${hora(r.abre)}. Falta esto para la próxima clase.`}
      </p>
    </motion.div>
  );
}
