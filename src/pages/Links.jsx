import { Suspense, lazy, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '../components/Logo';
import { Punto } from '../components/Tablero';
import { IconoBolsa, IconoInstagram, IconoPin, IconoReloj, IconoWeb, IconoWhatsApp } from '../components/Iconos';
import { actividades, horarios, mensajes, negocio } from '../data/starke';
import { useReloj } from '../lib/horario';
import { Link } from '../lib/router';
import { DIAS, hora, linkWhatsApp } from '../lib/util';

const MapaStarke = lazy(() => import('../components/MapaStarke'));

// /links — la página del perfil de Instagram (reemplaza el Linktree).
// Arriba las opciones principales: clase gratis, la web, productos, mapa y horarios.
const lista = { oculto: {}, visible: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } } };
const item = {
  oculto: { opacity: 0, x: -30, skewX: -6 },
  visible: { opacity: 1, x: 0, skewX: 0, transition: { duration: 0.6, ease: [0.7, 0, 0.25, 1] } },
};
const desplegar = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.5, ease: [0.7, 0, 0.25, 1] },
};
const ORDEN = [1, 2, 3, 4, 5, 6, 0];

const Sub = ({ children }) => (
  <small className="mt-1 block font-sans text-[13px] font-medium normal-case not-italic opacity-75">{children}</small>
);

export default function Links() {
  const r = useReloj();
  const [abierto, setAbierto] = useState(null); // 'mapa' | 'horarios' | null
  const alternar = (k) => setAbierto((a) => (a === k ? null : k));
  const estado = r.abierto ? `Abierto hasta las ${hora(r.cierra)}` : `Abrimos ${r.cuando} ${hora(r.abre)}`;
  const hoy = new Date().getDay();

  return (
    <section
      className="grid min-h-[100svh] justify-items-center px-4 pb-[60px] pt-[52px]"
      style={{ background: 'radial-gradient(120% 60% at 50% 0%, rgba(227,19,27,.28), transparent 60%)' }}
    >
      <motion.div className="flex w-full max-w-[460px] flex-col text-center" variants={lista} initial="oculto" animate="visible">
        <motion.div variants={item}>
          <Logo className="mx-auto mb-[18px] h-[118px] w-[118px]" />
        </motion.div>
        <motion.h1 variants={item} className="tit text-[44px] leading-[.95]">
          {negocio.nombre}
        </motion.h1>
        <motion.p variants={item} className="mt-0.5 text-[15px] text-gris">
          {negocio.usuario}
        </motion.p>
        <motion.p variants={item} className="mx-auto mt-3.5 max-w-[34ch] text-[#dadada]">
          {negocio.bajada} en González Catán. Personalizado y clases grupales.
        </motion.p>
        <motion.p
          variants={item}
          className="mb-[26px] mt-4 inline-flex items-center gap-[9px] self-center border-2 border-[#333] px-3.5 py-[7px] font-cond text-[17px] font-bold uppercase tracking-[.04em]"
        >
          <Punto abierto={r.abierto} />
          {estado}
        </motion.p>

        {/* 1. Clase gratis */}
        <motion.div variants={item}>
          <a className="lk-btn min-h-[74px] border-rojo bg-rojo text-[26px]" href={linkWhatsApp(mensajes.claseGratis)} target="_blank" rel="noopener">
            <span>
              Probá tu primera clase gratis
              <Sub>Escribinos por WhatsApp</Sub>
            </span>
            <IconoWhatsApp className="flex-none" />
          </a>
        </motion.div>

        {/* 2. La web */}
        <motion.div variants={item}>
          <Link to="/" className="lk-btn">
            <span>
              Ver la página web
              <Sub>Clases, horarios y todo sobre Starke</Sub>
            </span>
            <IconoWeb className="flex-none" />
          </Link>
        </motion.div>

        {/* 3. Productos */}
        <motion.div variants={item}>
          <Link to="/shop" className="lk-btn">
            <span>
              Productos y suplementos
              <Sub>ENA, Star, Gold y Granger · consultá por WhatsApp</Sub>
            </span>
            <IconoBolsa className="flex-none" />
          </Link>
        </motion.div>

        {/* 4. Mapa */}
        <motion.div variants={item}>
          <button type="button" className={`lk-btn w-full ${abierto === 'mapa' ? 'border-rojo' : ''}`} aria-expanded={abierto === 'mapa'} onClick={() => alternar('mapa')}>
            <span>
              Cómo llegar
              <Sub>{abierto === 'mapa' ? 'Tocá de nuevo para cerrar el mapa' : 'Ver el mapa de Starke'}</Sub>
            </span>
            <motion.span
              animate={{ y: abierto === 'mapa' ? [0, -6, 0] : 0, scale: abierto === 'mapa' ? 1.15 : 1 }}
              transition={{ duration: 0.45 }}
              className={`flex-none ${abierto === 'mapa' ? 'text-rojo' : ''}`}
            >
              <IconoPin />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {abierto === 'mapa' && (
              <motion.div {...desplegar} className="-mt-1 mb-3 overflow-hidden text-left">
                <Suspense fallback={<div className="h-[500px] animate-pulse bg-panel" />}>
                  <MapaStarke alto={500} compacto />
                </Suspense>
                <Link to="/mapa" className="mt-2 block text-center text-[14px] text-gris underline-offset-2 hover:text-white hover:underline">
                  Abrir el mapa en pantalla completa
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 5. Horarios */}
        <motion.div variants={item}>
          <button
            type="button"
            className={`lk-btn w-full ${abierto === 'horarios' ? 'border-rojo' : ''}`}
            aria-expanded={abierto === 'horarios'}
            onClick={() => alternar('horarios')}
          >
            <span>
              Horarios
              <Sub>{estado}</Sub>
            </span>
            <IconoReloj className={`flex-none ${abierto === 'horarios' ? 'text-rojo' : ''}`} />
          </button>
          <AnimatePresence initial={false}>
            {abierto === 'horarios' && (
              <motion.ul {...desplegar} className="-mt-1 mb-3 overflow-hidden border-2 border-t-0 border-[#333] text-left">
                {ORDEN.map((d) => {
                  const h = horarios[d];
                  return (
                    <li
                      key={d}
                      className={`flex justify-between px-4 py-2.5 font-cond text-lg font-bold uppercase ${d === hoy ? 'bg-white text-negro' : 'border-t border-[#222]'}`}
                    >
                      <span>{DIAS[d]}</span>
                      <span className={d === hoy ? '' : 'text-gris'}>{h ? `${hora(h[0])} a ${hora(h[1])}` : 'Cerrado'}</span>
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Actividades */}
        <motion.p variants={item} className="mb-3 mt-[22px] text-[15px] text-gris">
          Reservá tu actividad
        </motion.p>
        <motion.div variants={item} className="mb-3 grid grid-cols-2 gap-2.5">
          {actividades.map((a) => (
            <a key={a.n} className="lk-btn mb-0 min-h-[56px] px-4 text-xl" href={a.wa || linkWhatsApp(a.msg)} target="_blank" rel="noopener">
              {a.n}
            </a>
          ))}
        </motion.div>

        <motion.div variants={item}>
          <a className="lk-btn" href={negocio.instagram} target="_blank" rel="noopener">
            <span>Instagram</span>
            <IconoInstagram className="flex-none" />
          </a>
        </motion.div>

        <motion.p variants={item} className="mt-6 text-[13px] text-[#666]">
          Web hecha por{' '}
          <a href={negocio.creditos.url} target="_blank" rel="noopener" className="hover:text-white">
            {negocio.creditos.nombre}
          </a>
        </motion.p>
      </motion.div>
    </section>
  );
}
