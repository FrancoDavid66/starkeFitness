// Scroll suave con Lenis. App.jsx crea la instancia y la registra acá,
// así el router, el carrito y la vista rápida pueden frenarlo o moverlo.
let lenis = null;

export const registrarLenis = (instancia) => {
  lenis = instancia;
};

export const irArriba = (inmediato = true) => {
  if (lenis) lenis.scrollTo(0, { immediate: inmediato });
  else window.scrollTo({ top: 0, behavior: inmediato ? 'auto' : 'smooth' });
};

export const irA = (destino, { offset = -80, inmediato = false } = {}) => {
  const el = typeof destino === 'string' ? document.getElementById(destino) : destino;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, immediate: inmediato, duration: 1.1 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: inmediato ? 'auto' : 'smooth' });
};

export const moverPor = (px) => {
  if (lenis) lenis.scrollTo(window.scrollY + px, { duration: 0.6 });
  else window.scrollBy({ top: px, behavior: 'smooth' });
};

let bloqueos = 0;
export const bloquearScroll = (si) => {
  bloqueos = Math.max(0, bloqueos + (si ? 1 : -1));
  const activo = bloqueos > 0;
  if (lenis) (activo ? lenis.stop() : lenis.start());
  document.documentElement.style.overflow = activo ? 'hidden' : '';
};
