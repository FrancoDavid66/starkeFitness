import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { irA, irArriba } from './scroll';
import { wait } from './util';

// Páginas: portada, shop, links (la de Instagram), mapa e ingreso.
// HASH ROUTER: las direcciones van con # (dominio.com.ar/#/ingreso, /#/links, /#/shop…),
// así funcionan en cualquier hosting sin que el servidor tenga que conocer cada página.
// Los links "limpios" (dominio.com.ar/ingreso, /links, /shop…) también andan: el build crea
// una carpeta con un index.html que redirige a la versión con # (ver vite.config.js), y si el
// servidor devuelve la web igual (por el .htaccess), acá se pasa sola a la versión con #.
export const RUTAS = ['/', '/shop', '/links', '/mapa', '/ingreso'];

// Otros nombres para la misma página
const ALIAS = { '/inscripcion': '/ingreso', '/inscribite': '/ingreso', '/empezar': '/ingreso' };

// Atajos que abren la portada en una sección (para los links del perfil)
const ATAJOS = {
  '/actividades': { ruta: '/', seccion: 'actividades' },
  '/horarios': { ruta: '/', seccion: 'donde' },
};

const TITULOS = {
  '/': 'Starke Fitness · Centro de entrenamiento en González Catán',
  '/shop': 'Shop de suplementos · Starke Fitness',
  '/links': 'Links · Starke Fitness',
  '/mapa': 'Cómo llegar · Starke Fitness',
  '/ingreso': 'Formulario de ingreso · Starke Fitness',
};

const limpiar = (r) => r.split('?')[0].replace(/\/+$/, '').toLowerCase() || '/';
const conocida = (r) => RUTAS.includes(r) || Boolean(ALIAS[r]) || Boolean(ATAJOS[r]);

// Si entraron por una dirección "limpia" (/ingreso), se pasa a la versión con # (/#/ingreso)
// sin recargar. Corre una sola vez, antes de que arranque la web.
const pasarAHash = () => {
  if (typeof window === 'undefined' || window.location.protocol === 'file:') return;
  if (window.location.hash.startsWith('#/')) return; // ya está con #
  const m = window.location.pathname.match(/^(.*?)(\/[^/]+)\/?$/); // /carpeta/ingreso -> ['/carpeta', '/ingreso']
  if (!m) return;
  const pagina = limpiar(m[2]);
  if (!conocida(pagina)) return;
  window.history.replaceState(null, '', `${m[1]}/${window.location.search}#${pagina}`);
};
pasarAHash();

const rutaCruda = () => limpiar(window.location.hash.replace(/^#/, '') || '/');

const leerRuta = () => {
  const r = rutaCruda();
  if (ATAJOS[r]) return ATAJOS[r].ruta;
  if (ALIAS[r]) return ALIAS[r];
  return RUTAS.includes(r) ? r : '/';
};

export const hrefDe = (to) => '#' + to;

// ¿Entraron por la portada "pelada"? (ahí sí va la intro 3, 2, 1)
export const entroPorPortada = () => rutaCruda() === '/';

const RouterCtx = createContext(null);

export function RouterProvider({ children }) {
  const [ruta, setRuta] = useState(leerRuta);
  const [cortina, setCortina] = useState(false);
  const rutaActual = useRef(ruta);
  const ocupado = useRef(false);
  const seccionPendiente = useRef(ATAJOS[rutaCruda()]?.seccion || null);
  const primera = useRef(true);
  const reducir = useReducedMotion();

  const ir = useCallback(
    async (to, { seccion = null, empujar = true } = {}) => {
      if (to === rutaActual.current) {
        if (seccion) irA(seccion);
        else if (empujar) irArriba(false);
        return;
      }
      if (ocupado.current) return;
      ocupado.current = true;
      if (!reducir) {
        setCortina(true);
        await wait(460);
      }
      if (empujar) window.history.pushState(null, '', hrefDe(to));
      seccionPendiente.current = seccion;
      rutaActual.current = to;
      setRuta(to);
      if (!reducir) {
        await wait(120);
        setCortina(false);
      }
      ocupado.current = false;
    },
    [reducir]
  );

  // Después de cambiar de página: arriba de todo, o a la sección pedida
  useLayoutEffect(() => {
    document.title = TITULOS[ruta];
    const s = seccionPendiente.current;
    seccionPendiente.current = null;
    // al entrar por un atajo (/#/actividades) se espera a que carguen tipografías y medidas
    if (s) setTimeout(() => irA(s, { inmediato: true }), primera.current ? 450 : 30);
    else irArriba(true);
    primera.current = false;
  }, [ruta]);

  // Botón atrás / adelante del navegador, o si cambian el # a mano en la barra de direcciones
  useEffect(() => {
    const alCambiar = () => {
      const r = rutaCruda();
      ir(leerRuta(), { empujar: false, seccion: ATAJOS[r]?.seccion || null });
    };
    window.addEventListener('popstate', alCambiar);
    window.addEventListener('hashchange', alCambiar);
    return () => {
      window.removeEventListener('popstate', alCambiar);
      window.removeEventListener('hashchange', alCambiar);
    };
  }, [ir]);

  return <RouterCtx.Provider value={{ ruta, ir, cortina }}>{children}</RouterCtx.Provider>;
}

export const useRouter = () => useContext(RouterCtx);

export function Link({ to, seccion, onClick, children, ...resto }) {
  const { ir } = useRouter();
  return (
    <a
      href={hrefDe(to)}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        ir(to, { seccion });
      }}
      {...resto}
    >
      {children}
    </a>
  );
}
