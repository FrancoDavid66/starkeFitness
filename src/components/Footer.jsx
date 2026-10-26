import Logo from './Logo';
import { Link } from '../lib/router';
import { negocio, mensajes } from '../data/starke';
import { linkWhatsApp } from '../lib/util';

export default function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-6 border-t-2 border-linea px-gutter pb-10 pt-[46px] text-[15px] text-gris">
      <Link to="/" aria-label="Starke Fitness, inicio">
        <Logo className="h-14 w-14" />
      </Link>
      <nav className="flex flex-wrap gap-[22px]" aria-label="Pie">
        <Link to="/" seccion="actividades" className="no-underline hover:text-white">Actividades</Link>
        <Link to="/shop" className="no-underline hover:text-white">Shop</Link>
        <Link to="/mapa" className="no-underline hover:text-white">Cómo llegar</Link>
        <Link to="/links" className="no-underline hover:text-white">Links</Link>
        <a href={negocio.instagram} target="_blank" rel="noopener" className="no-underline hover:text-white">Instagram</a>
        <a href={linkWhatsApp(mensajes.hola)} target="_blank" rel="noopener" className="no-underline hover:text-white">WhatsApp</a>
      </nav>
      <p className="m-0">
        © {new Date().getFullYear()} {negocio.nombre} · Web hecha por{' '}
        <a href={negocio.creditos.url} target="_blank" rel="noopener" className="underline-offset-2 hover:text-white">
          {negocio.creditos.nombre}
        </a>
      </p>
    </footer>
  );
}
