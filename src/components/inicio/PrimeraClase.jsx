import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Titulo from '../Titulo';
import { Digito } from '../Led';
import { mensajes, pasos } from '../../data/starke';
import { linkWhatsApp } from '../../lib/util';

export default function PrimeraClase() {
  return (
    <section className="overflow-hidden bg-rojo px-gutter py-[clamp(80px,11vw,150px)]" aria-labelledby="gratis-t">
      <Titulo id="gratis-t" className="tit-l text-negro">
        Tu primera clase es gratis
      </Titulo>
      <ol className="mb-12 mt-[clamp(40px,5vw,70px)] grid gap-[clamp(20px,3vw,48px)] md:grid-cols-3">
        {pasos.map((p, i) => (
          <Paso key={p.t} n={i + 1} {...p} i={i} />
        ))}
      </ol>
      <a className="btn btn-negro" href={linkWhatsApp(mensajes.claseGratis)} target="_blank" rel="noopener">
        Reservar mi clase gratis
      </a>
    </section>
  );
}

// Cada paso: el número se "enciende" segmento por segmento al aparecer
function Paso({ n, t, d, i }) {
  const ref = useRef(null);
  const visto = useInView(ref, { once: true, amount: 0.6 });
  return (
    <motion.li
      ref={ref}
      className="bg-negro px-[26px] pb-[30px] pt-7 [clip-path:polygon(0_0,100%_0,100%_calc(100%-22px),calc(100%-22px)_100%,0_100%)]"
      initial={{ y: 40, opacity: 0 }}
      animate={visto ? { y: 0, opacity: 1 } : undefined}
      transition={{ duration: 0.6, delay: i * 0.12, ease: [0.7, 0, 0.25, 1] }}
    >
      <Digito c={visto ? String(n) : ' '} escalonado className="mb-6 h-auto w-[54px]" />
      <h3 className="tit mb-2.5 text-[34px] leading-[.95]">{t}</h3>
      <p className="text-[#cfcfcf]">{d}</p>
    </motion.li>
  );
}
