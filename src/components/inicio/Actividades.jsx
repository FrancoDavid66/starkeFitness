import { motion } from 'framer-motion';
import Titulo from '../Titulo';
import { actividades } from '../../data/starke';
import { linkWhatsApp } from '../../lib/util';

export default function Actividades() {
  return (
    <section id="actividades" className="px-gutter py-[clamp(80px,11vw,150px)]" aria-labelledby="actividades-t">
      <Titulo id="actividades-t">Elegí cómo entrenar</Titulo>
      <p className="bajada">Cada actividad se reserva por WhatsApp. Tocá la que te interesa y escribinos.</p>

      <div className="mt-[clamp(36px,5vw,64px)] border-t-2 border-linea">
        {actividades.map((a, i) => (
          <motion.div
            key={a.n}
            className="act group relative isolate grid items-center gap-x-[18px] gap-y-2.5 border-b-2 border-linea py-[22px] md:grid-cols-[1fr_auto] md:py-[26px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] lg:gap-7"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.7, 0, 0.25, 1] }}
          >
            <h3 className="tit text-[clamp(40px,6vw,88px)] leading-[.9] transition-transform duration-500 ease-golpe group-hover:translate-x-3.5">{a.n}</h3>
            <p className="max-w-[42ch] text-[#d0d0d0] group-hover:text-white md:col-start-1 md:row-start-2 lg:col-auto lg:row-auto">{a.d}</p>
            <a
              className="btn btn-borde btn-chico justify-self-start group-hover:border-negro group-hover:bg-negro group-hover:text-white md:col-start-2 md:row-span-2 md:row-start-1 lg:col-auto lg:row-auto"
              href={a.wa || linkWhatsApp(a.msg)}
              target="_blank"
              rel="noopener"
            >
              Reservar
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
