import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import { IconoFlecha } from '../components/Iconos';
import { negocio } from '../data/starke';
import { Link } from '../lib/router';

const MapaStarke = lazy(() => import('../components/MapaStarke'));

// /mapa — el mapa de Starke a pantalla completa (link directo para el perfil)
export default function Mapa() {
  return (
    <section className="flex h-[100svh] flex-col bg-negro">
      <motion.header
        className="flex flex-none items-center justify-between gap-3 border-b-2 border-linea px-3 py-2.5 md:px-5"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.7, 0, 0.25, 1] }}
      >
        <Link to="/links" className="flex min-w-0 items-center gap-2.5 no-underline" aria-label="Volver a los links de Starke">
          <IconoFlecha izquierda className="flex-none text-gris" />
          <Logo className="h-10 w-10 flex-none" />
          <span className="min-w-0">
            <span className="tit block text-[22px] leading-none">Cómo llegar</span>
            <span className="block truncate text-[13px] text-gris">{negocio.nombre} · {negocio.zona}</span>
          </span>
        </Link>
        <div className="flex flex-none gap-2">
          <Link to="/" className="btn btn-borde btn-chico hidden min-h-[40px] px-3 text-base sm:inline-flex">
            Ver la web
          </Link>
          <Link to="/shop" className="btn btn-rojo btn-chico min-h-[40px] px-3 text-base">
            Productos
          </Link>
        </div>
      </motion.header>

      <motion.div
        className="relative min-h-0 flex-1"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <Suspense fallback={<div className="h-full animate-pulse bg-panel" />}>
          <MapaStarke alto="100%" zoom={16} libre className="!border-0" />
        </Suspense>
      </motion.div>
    </section>
  );
}
