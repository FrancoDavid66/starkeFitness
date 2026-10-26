import { Suspense, lazy, useRef } from 'react';
import { useInView } from 'framer-motion';
import Titulo from '../Titulo';
import { horarios, negocio } from '../../data/starke';
import { DIAS, hora } from '../../lib/util';
import { Link } from '../../lib/router';

const MapaStarke = lazy(() => import('../MapaStarke'));
const ORDEN = [1, 2, 3, 4, 5, 6, 0];

export default function Donde() {
  const hoy = new Date().getDay();
  const zonaMapa = useRef(null);
  // el mapa se carga recién cuando la sección se acerca a la pantalla
  const cerca = useInView(zonaMapa, { once: true, margin: '400px 0px' });

  return (
    <section id="donde" className="px-gutter py-[clamp(80px,11vw,150px)]" aria-labelledby="donde-t">
      <div className="grid items-start gap-[clamp(30px,5vw,70px)] lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <Titulo id="donde-t">Dónde y cuándo</Titulo>
          <p className="mb-[26px] mt-[22px] font-cond text-[clamp(28px,3vw,40px)] font-extrabold uppercase italic leading-none">
            {negocio.direccion ? `${negocio.direccion}, ${negocio.zona}` : negocio.zona}
          </p>

          <ul className="border-t-2 border-linea">
            {ORDEN.map((d) => {
              const h = horarios[d];
              const esHoy = d === hoy;
              return (
                <li
                  key={d}
                  className={`flex justify-between gap-5 border-b-2 border-linea py-[13px] font-cond text-xl font-bold uppercase tracking-[.02em] md:text-[22px] ${
                    esHoy ? 'bg-white px-3.5 text-negro' : 'px-1'
                  }`}
                >
                  <span>{DIAS[d]}</span>
                  <span className={esHoy ? '' : 'font-semibold text-gris'}>{h ? `${hora(h[0])} a ${hora(h[1])}` : 'Cerrado'}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/mapa" className="btn btn-rojo">
              Ver el mapa grande
            </Link>
            <a className="btn btn-borde" href={negocio.instagram} target="_blank" rel="noopener">
              Instagram
            </a>
          </div>
        </div>

        <div ref={zonaMapa} className="lg:sticky lg:top-24">
          {cerca ? (
            <Suspense fallback={<div className="h-[min(560px,75svh)] animate-pulse bg-panel" />}>
              <MapaStarke alto="min(560px, 75svh)" zoom={15} />
            </Suspense>
          ) : (
            <div className="h-[min(560px,75svh)] bg-panel" />
          )}
        </div>
      </div>
    </section>
  );
}
