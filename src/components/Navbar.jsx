import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Logo from './Logo';
import { IconoBolsa } from './Iconos';
import { Link, useRouter } from '../lib/router';
import { usePedido } from '../context/Pedido';
import { bloquearScroll } from '../lib/scroll';
import { linkWhatsApp } from '../lib/util';
import { mensajes } from '../data/starke';

const ITEMS = [
  { l: 'Inicio', to: '/' },
  { l: 'Actividades', to: '/', seccion: 'actividades' },
  { l: 'Shop', to: '/shop' },
  { l: 'Links', to: '/links' },
];

export default function Navbar() {
  const { ruta } = useRouter();
  const { cantidad, abrir, destino, golpe } = usePedido();
  const [oculto, setOculto] = useState(false);
  const [menu, setMenu] = useState(false);
  const { scrollY } = useScroll();

  // Se esconde al bajar y vuelve al subir
  useMotionValueEvent(scrollY, 'change', (y) => {
    const antes = scrollY.getPrevious() ?? 0;
    if (Math.abs(y - antes) < 4) return;
    setOculto(y > antes && y > 160);
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--nav-h', oculto && !menu ? '0px' : '76px');
  }, [oculto, menu]);

  useEffect(() => {
    if (!menu) return;
    bloquearScroll(true);
    const tecla = (e) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', tecla);
    return () => {
      bloquearScroll(false);
      window.removeEventListener('keydown', tecla);
    };
  }, [menu]);

  const activo = (it) => !it.seccion && it.to === ruta;

  return (
    <>
      <motion.div
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-gutter py-3.5 ${menu ? '' : 'bg-gradient-to-b from-black via-black/85 to-transparent'}`}
        animate={{ y: oculto && !menu ? '-110%' : '0%' }}
        transition={{ duration: 0.3, ease: [0.7, 0, 0.25, 1] }}
      >
        <Link to="/" className="flex items-center gap-3 no-underline" aria-label="Starke Fitness, inicio" onClick={() => setMenu(false)}>
          <Logo className="h-12 w-12" />
          <span className="hidden font-cond text-2xl font-black uppercase italic tracking-[.02em] md:inline">Starke</span>
        </Link>

        <nav className="hidden gap-[30px] md:flex" aria-label="Principal">
          {ITEMS.map((it) => (
            <Link
              key={it.l}
              to={it.to}
              seccion={it.seccion}
              aria-current={activo(it) ? 'page' : undefined}
              className={`border-b-[3px] py-1.5 font-cond text-[19px] font-bold uppercase tracking-[.06em] no-underline transition-colors hover:border-rojo hover:text-white ${
                activo(it) ? 'border-rojo text-white' : 'border-transparent text-[#cfcfcf]'
              }`}
            >
              {it.l}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            ref={destino}
            data-prioridad="1"
            onClick={abrir}
            aria-label={`Ver tu pedido (${cantidad})`}
            className="inline-flex min-h-[42px] items-center gap-2 border-2 border-[#444] px-3.5 font-cond text-lg font-bold uppercase tracking-[.04em] hover:border-white"
          >
            <IconoBolsa width={20} height={20} className="md:hidden" />
            <span className="hidden md:inline">Pedido</span>
            <motion.b
              key={golpe}
              initial={golpe ? { scale: 1.6 } : false}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 600, damping: 14 }}
              className="inline-grid h-6 min-w-[24px] place-items-center bg-rojo px-1.5 font-cond text-base"
            >
              {cantidad}
            </motion.b>
          </button>
          <a className="btn btn-rojo btn-chico hidden md:inline-flex" href={linkWhatsApp(mensajes.claseGratis)} target="_blank" rel="noopener">
            Clase gratis
          </a>
          <button
            className="relative h-[46px] w-[46px] border-2 border-[#444] md:hidden"
            aria-label={menu ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
          >
            <motion.i className="absolute left-[11px] right-[11px] top-[14px] h-[3px] bg-white" animate={menu ? { y: 6.5, rotate: 45 } : { y: 0, rotate: 0 }} />
            <motion.i className="absolute left-[11px] right-[11px] top-[20.5px] h-[3px] bg-white" animate={{ opacity: menu ? 0 : 1 }} />
            <motion.i className="absolute left-[11px] right-[11px] top-[27px] h-[3px] bg-white" animate={menu ? { y: -6.5, rotate: -45 } : { y: 0, rotate: 0 }} />
          </button>
        </div>
      </motion.div>

      {/* Menú del celu: telón rojo */}
      <AnimatePresence>
        {menu && (
          <motion.nav
            aria-label="Menú"
            className="fixed inset-0 z-[45] flex flex-col justify-center gap-1 bg-rojo px-gutter pb-10 pt-[90px]"
            initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
            animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            exit={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' }}
            transition={{ duration: 0.5, ease: [0.7, 0, 0.25, 1] }}
          >
            {ITEMS.map((it, i) => (
              <motion.div key={it.l} initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06 }}>
                <Link
                  to={it.to}
                  seccion={it.seccion}
                  onClick={() => setMenu(false)}
                  className="tit block text-[clamp(54px,15vw,96px)] leading-[.95] text-negro no-underline hover:text-white"
                >
                  {it.l}
                </Link>
              </motion.div>
            ))}
            <motion.a
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="btn btn-negro mt-7 self-start"
              href={linkWhatsApp(mensajes.claseGratis)}
              target="_blank"
              rel="noopener"
            >
              Probá tu primera clase gratis
            </motion.a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
