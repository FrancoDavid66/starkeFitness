import { Suspense, lazy, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '../components/Logo';
import FotoProducto from '../components/FotoProducto';
import Mati from '../components/Mati';
import { Punto } from '../components/Tablero';
import { IconoBolsa, IconoFlecha, IconoInstagram, IconoMas, IconoPin, IconoReloj, IconoWeb, IconoWhatsApp } from '../components/Iconos';
import { usePedido } from '../context/Pedido';
import { actividades, cintas, horarios, mensajes, negocio } from '../data/starke';
import { MARCAS_INFO } from '../data/marcas';
import { DESTACADOS, porId, productos } from '../data/productos';
import { useReloj } from '../lib/horario';
import { Link } from '../lib/router';
import { DIAS, hora, linkWhatsApp } from '../lib/util';

const MapaStarke = lazy(() => import('../components/MapaStarke'));

// /links — la página de la bio de Instagram (reemplaza el Linktree).
// Estilo Linktree (portada, foto de perfil, botones redondeados con miniatura)
// pero con la identidad de Starke. Los estilos están en src/index.css ("LINKS").
// Textos, links, horarios y actividades salen de src/data/starke.js.
// Los suplementos que se ven son los DESTACADOS de src/data/productos.js.

const lista = { oculto: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };
const item = {
  oculto: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.7, 0, 0.25, 1] } },
};
const desplegar = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.5, ease: [0.7, 0, 0.25, 1] },
};
const ORDEN = [1, 2, 3, 4, 5, 6, 0];
const SUPLEMENTOS = DESTACADOS.map((id) => porId[id]).filter(Boolean);

const IconoCompartir = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"
    />
  </svg>
);

const IconoFicha = (props) => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      d="M9 3.5h6v3H9zM9 5H5.5v16h13V5H15M8.5 11h7M8.5 14.5h7M8.5 18h4"
    />
  </svg>
);

// Título de cada bloque, con una línea a cada lado
const Titulo = ({ children }) => (
  <motion.p variants={item} className="lt-titulo">
    {children}
  </motion.p>
);

// Texto centrado de cada botón (título + bajada chiquita)
const Texto = ({ titulo, sub }) => (
  <span className="lt-texto">
    {titulo}
    {sub && <small>{sub}</small>}
  </span>
);

// Tarjetita de suplemento: al tocarla se abre la ficha (sabores, tamaños y "Agregar a la consulta")
function Suplemento({ p }) {
  const { verProducto } = usePedido();
  return (
    <button type="button" onClick={() => verProducto(p.id)} className="lt-prod" aria-label={`Ver ${p.n}`}>
      <span className="lt-prod-foto">
        <FotoProducto p={p} chica className="h-full w-full object-contain p-[10%] mix-blend-multiply" />
      </span>
      <span className="lt-prod-txt">
        <small>{p.m}</small>
        <span>{p.n}</span>
      </span>
    </button>
  );
}

export default function Links() {
  const r = useReloj();
  const [abierto, setAbierto] = useState(null); // 'mapa' | 'horarios' | null
  const [aviso, setAviso] = useState('');
  const alternar = (k) => setAbierto((a) => (a === k ? null : k));
  const estado = r.abierto ? `Abierto hasta las ${hora(r.cierra)}` : `Abrimos ${r.cuando} ${hora(r.abre)}`;
  const estadoCorto = r.abierto ? `Abierto · cierra ${hora(r.cierra)}` : `Cerrado · abre ${r.cuando} ${hora(r.abre)}`;
  const hoy = new Date().getDay();
  const frase = [...cintas.blanca, ...cintas.blanca]; // doble, para que la cinta corra sin cortes
  const masProductos = productos.length - SUPLEMENTOS.length;

  useEffect(() => {
    if (!aviso) return undefined;
    const id = setTimeout(() => setAviso(''), 2200);
    return () => clearTimeout(id);
  }, [aviso]);

  // Compartir: en el celu abre el menú de compartir; en la compu copia el link
  const compartir = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: negocio.nombre, text: `${negocio.nombre} · ${negocio.bajada}`, url });
      } catch {
        /* lo cerró sin compartir */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setAviso('¡Link copiado!');
    } catch {
      setAviso('No se pudo copiar el link');
    }
  };

  return (
    <section className="lt-fondo min-h-[100svh] pb-14">
      <motion.div className="mx-auto w-full max-w-[480px] px-4" variants={lista} initial="oculto" animate="visible">
        {/* Portada: STARKE calado y la cinta blanca que corre */}
        <motion.div variants={item} className="lt-portada">
          <span className="lt-portada-texto" aria-hidden="true">
            Starke
          </span>
          <div className="lt-cinta" aria-hidden="true">
            <div>
              {frase.map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>
          </div>
          <button type="button" onClick={compartir} className="lt-compartir" aria-label="Compartir esta página">
            <IconoCompartir />
          </button>
        </motion.div>

        {/* Perfil */}
        <motion.div variants={item} className="relative z-[1] -mt-[54px] flex flex-col items-center text-center">
          <div className="lt-avatar">
            <Logo className="h-full w-full" />
          </div>

          <h1 className="tit mt-2.5 text-[36px] leading-[.95]">{negocio.nombre}</h1>
          <p className="mt-1 text-[14.5px] text-gris">
            {negocio.usuario} · {negocio.bajada}
          </p>
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5">
            <p className="inline-flex h-10 items-center gap-2 rounded-full border border-[#333] bg-[#0d0d0d] px-3 font-cond text-[14.5px] font-bold uppercase tracking-[.04em]">
              <Punto abierto={r.abierto} />
              {estadoCorto}
            </p>
            <a className="lt-red" href={negocio.instagram} target="_blank" rel="noopener" aria-label="Instagram de Starke">
              <IconoInstagram width={20} height={20} />
            </a>
            <a className="lt-red" href={linkWhatsApp(mensajes.hola)} target="_blank" rel="noopener" aria-label="WhatsApp de Starke">
              <IconoWhatsApp width={20} height={20} />
            </a>
            <Link className="lt-red" to="/mapa" aria-label="Mapa de Starke">
              <IconoPin width={20} height={20} />
            </Link>
          </div>
        </motion.div>

        {/* Destacada: primera clase gratis (Mati asoma abajo a la derecha y "lo dice") */}
        <motion.div variants={item} className="mt-5">
          <a className="lt-destacada" href={linkWhatsApp(mensajes.claseGratis)} target="_blank" rel="noopener">
            <span className="lt-destacada-fondo" aria-hidden="true">
              Gratis
            </span>
            <span className="flex flex-col items-start pr-[96px]">
              <span className="rounded-full bg-black px-2.5 py-[3px] font-cond text-[13px] font-bold uppercase tracking-[.1em]">Sin compromiso</span>
              <span className="mt-2 font-cond text-[clamp(26px,7.6vw,31px)] font-black uppercase italic leading-[.86]">
                Probá tu primera
                <br />
                clase gratis
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13.5px] font-semibold leading-none text-negro">
                <IconoWhatsApp width={16} height={16} className="text-[#1fb855]" />
                Reservá por WhatsApp
              </span>
            </span>
            <Mati modo="vivo" poder className="lt-destacada-mati" />
          </a>
        </motion.div>

        {/* Inscripción (destacado: luz que gira por el borde, brillo, latido y flecha) */}
        <motion.div variants={item} className="mt-2.5">
          <Link to="/ingreso" className="lt-btn lt-btn-rojo destacado">
            <span className="destacado-brillo" aria-hidden="true" />
            <span className="lt-mini bg-rojo">
              <IconoFicha />
            </span>
            <Texto titulo="Inscribite a Starke" sub="Tu ficha de ingreso en 3 minutos" />
            <IconoFlecha className="destacado-flecha justify-self-center" />
          </Link>
        </motion.div>

        {/* Suplementos: las fotos se deslizan de costado; al tocar una se abre su ficha */}
        <Titulo>Suplementos</Titulo>
        <motion.div variants={item} className="-mx-4 mb-2.5">
          <div className="lt-riel">
            {SUPLEMENTOS.map((p) => (
              <Suplemento key={p.id} p={p} />
            ))}
            <Link to="/shop" className="lt-prod lt-prod-mas" aria-label="Ver todos los productos">
              <b>+{masProductos}</b>
              <span>productos más</span>
              <IconoFlecha />
            </Link>
          </div>
        </motion.div>
        <motion.div variants={item}>
          <Link to="/shop" className="lt-btn">
            <span className="lt-mini bg-white text-negro">
              <IconoBolsa />
            </span>
            <Texto titulo="Ver todos los productos" sub="Consultá precio y stock por WhatsApp" />
            <IconoFlecha className="lt-ir" />
            <span className="lt-marcas">
              {MARCAS_INFO.map((m) => (
                <img key={m.k} src={m.logo} alt={m.k} style={{ height: `${17 * m.esc}px` }} loading="lazy" />
              ))}
            </span>
          </Link>
        </motion.div>

        {/* Mapa y horarios (se despliegan acá mismo) y la web */}
        <Titulo>Más de Starke</Titulo>
        <motion.div variants={item}>
          <button
            type="button"
            className={`lt-btn ${abierto === 'mapa' ? 'lt-abierto' : ''}`}
            aria-expanded={abierto === 'mapa'}
            onClick={() => alternar('mapa')}
          >
            <span className="lt-mini bg-rojo">
              <IconoPin />
            </span>
            <Texto titulo="Cómo llegar" sub={abierto === 'mapa' ? 'Tocá de nuevo para cerrar el mapa' : `${negocio.direccion} · González Catán`} />
            <IconoMas abierto={abierto === 'mapa'} className="lt-mas" />
          </button>
          <AnimatePresence initial={false}>
            {abierto === 'mapa' && (
              <motion.div {...desplegar} className="overflow-hidden">
                <div className="lt-panel">
                  <Suspense fallback={<div className="h-[500px] animate-pulse bg-panel" />}>
                    <MapaStarke alto={500} compacto />
                  </Suspense>
                </div>
                <Link to="/mapa" className="mb-3 block text-center text-[14px] text-gris underline-offset-2 hover:text-white hover:underline">
                  Abrir el mapa en pantalla completa
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div variants={item}>
          <button
            type="button"
            className={`lt-btn ${abierto === 'horarios' ? 'lt-abierto' : ''}`}
            aria-expanded={abierto === 'horarios'}
            onClick={() => alternar('horarios')}
          >
            <span className="lt-mini bg-panel-2">
              <IconoReloj />
            </span>
            <Texto titulo="Horarios" sub={estado} />
            <IconoMas abierto={abierto === 'horarios'} className="lt-mas" />
          </button>
          <AnimatePresence initial={false}>
            {abierto === 'horarios' && (
              <motion.div {...desplegar} className="overflow-hidden">
                <ul className="lt-panel">
                  {ORDEN.map((d) => {
                    const h = horarios[d];
                    return (
                      <li
                        key={d}
                        className={`flex justify-between px-4 py-2.5 font-cond text-lg font-bold uppercase ${
                          d === hoy ? 'bg-white text-negro' : 'border-t border-[#1f1f1f] first:border-t-0'
                        }`}
                      >
                        <span>{DIAS[d]}</span>
                        <span className={d === hoy ? '' : 'text-gris'}>{h ? `${hora(h[0])} a ${hora(h[1])}` : 'Cerrado'}</span>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div variants={item}>
          <Link to="/" className="lt-btn">
            <span className="lt-mini bg-panel-2">
              <IconoWeb />
            </span>
            <Texto titulo="Ver la página web" sub="Clases, horarios y todo sobre Starke" />
            <IconoFlecha className="lt-ir" />
          </Link>
        </motion.div>

        {/* Actividades: cada una abre su WhatsApp */}
        <Titulo>Reservá tu actividad</Titulo>
        <motion.div variants={item} className="grid grid-cols-2 gap-2.5">
          {actividades.map((a) => (
            <a key={a.n} className="lt-act" href={a.wa || linkWhatsApp(a.msg)} target="_blank" rel="noopener">
              <span>{a.n}</span>
              <small>
                <IconoWhatsApp width={13} height={13} />
                Reservar
              </small>
            </a>
          ))}
        </motion.div>

        {/* Pie */}
        <motion.div variants={item} className="mt-9 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={compartir}
            className="inline-flex items-center gap-2 rounded-full border border-[#333] px-4 py-2 text-[14px] font-semibold transition-colors hover:border-white"
          >
            <IconoCompartir width={16} height={16} />
            Compartir Starke
          </button>
          <p className="text-[13px] text-[#666]">
            Web hecha por{' '}
            <a href={negocio.creditos.url} target="_blank" rel="noopener" className="hover:text-white">
              {negocio.creditos.nombre}
            </a>
          </p>
        </motion.div>
      </motion.div>

      {/* Aviso de "link copiado" (en la compu) */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
        <AnimatePresence>
          {aviso && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="rounded-full bg-white px-4 py-2 text-[15px] font-semibold text-negro shadow-lg"
              role="status"
            >
              {aviso}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
