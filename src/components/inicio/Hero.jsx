import { motion, useScroll, useTransform } from 'framer-motion';
import Tablero from '../Tablero';
import { Link } from '../../lib/router';
import { linkWhatsApp } from '../../lib/util';
import { mensajes } from '../../data/starke';

const LINEAS = ['Entrená mejor.', 'Hacete más', 'fuerte.'];
const golpe = [0.7, 0, 0.25, 1];

export default function Hero({ listo }) {
  const { scrollY } = useScroll();
  const xFondo = useTransform(scrollY, [0, 1000], [0, -250]);

  return (
    <section className="relative grid min-h-[100svh] items-start gap-11 overflow-hidden px-gutter pb-[90px] pt-[120px] lg:grid-cols-[1.25fr_.75fr] lg:items-end lg:gap-10 lg:pt-[130px]">
      {/* STARKE gigante calado de fondo */}
      <motion.div
        aria-hidden="true"
        style={{ x: xFondo }}
        className="pointer-events-none absolute -bottom-[3vw] -left-[2vw] select-none whitespace-nowrap font-cond text-[34vw] font-black italic leading-[.8] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,.07)]"
      >
        STARKE
      </motion.div>

      <div className="relative z-[2]">
        <h1 className="tit-xl">
          {LINEAS.map((l, i) => (
            <span key={l} className="block overflow-hidden pb-[.02em] pr-[.08em]">
              <motion.span
                className="block"
                initial={{ y: '105%', skewY: 6 }}
                animate={listo ? { y: '0%', skewY: 0 } : undefined}
                transition={{ duration: 0.9, delay: i * 0.08, ease: golpe }}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={listo ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.6, delay: 0.45 }}>
          <p className="bajada">
            Centro de entrenamiento integral en González Catán. Entrenamiento personalizado y clases grupales de funcional, cross training y boxeo.
          </p>
          <div className="mt-[34px] flex flex-wrap gap-3.5">
            <a className="btn btn-rojo" href={linkWhatsApp(mensajes.claseGratis)} target="_blank" rel="noopener">
              Probá tu primera clase gratis
            </a>
            <Link to="/shop" className="btn btn-borde">
              Ver suplementos
            </Link>
          </div>
        </motion.div>
      </div>

      <Tablero listo={listo} />
    </section>
  );
}
