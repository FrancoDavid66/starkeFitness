import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
import { entroPorPortada, useRouter } from './lib/router';
import { registrarLenis } from './lib/scroll';

import Intro from './components/Intro';
import Cortina from './components/Cortina';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VistaRapida from './components/VistaRapida';
import PedidoPanel from './components/PedidoPanel';
import BotonPedido from './components/BotonPedido';

import Inicio from './pages/Inicio';
import Shop from './pages/Shop';
import Links from './pages/Links';
import Mapa from './pages/Mapa';
import Ingreso from './pages/Ingreso';

const App = () => {
  const { ruta, cortina } = useRouter();
  // La intro (3, 2, 1) sale solo al entrar por la portada.
  // Si entran por un link del perfil (/shop, /links, /mapa, /actividades) va directo.
  const [intro, setIntro] = useState(entroPorPortada);
  const [listo, setListo] = useState(() => !entroPorPortada());

  // Scroll suave
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    registrarLenis(lenis);
    let id;
    const loop = (t) => {
      lenis.raf(t);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      registrarLenis(null);
    };
  }, []);

  // /links, /mapa e /ingreso son páginas sueltas, sin menú ni pie
  const conMarco = !['/links', '/mapa', '/ingreso'].includes(ruta);

  return (
    <>
      <AnimatePresence>{intro && <Intro onListo={() => setListo(true)} onFin={() => setIntro(false)} />}</AnimatePresence>
      <Cortina visible={cortina} />

      {conMarco && (
        <header>
          <Navbar />
        </header>
      )}

      <main>
        {ruta === '/' && <Inicio listo={listo} />}
        {ruta === '/shop' && <Shop />}
        {ruta === '/links' && <Links />}
        {ruta === '/mapa' && <Mapa />}
        {ruta === '/ingreso' && <Ingreso />}
      </main>

      {conMarco && <Footer />}

      {ruta === '/shop' && <BotonPedido />}
      <VistaRapida />
      <PedidoPanel />
    </>
  );
};

export default App;
