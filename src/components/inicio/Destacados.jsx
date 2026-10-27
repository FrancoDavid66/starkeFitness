import { useRef } from 'react';
import Titulo from '../Titulo';
import TarjetaProducto from '../TarjetaProducto';
import { IconoFlecha } from '../Iconos';
import { DESTACADOS, MARCAS, porId } from '../../data/productos';
import { Link } from '../../lib/router';

export default function Destacados() {
  const riel = useRef(null);
  const mover = (dir) => riel.current?.scrollBy({ left: dir * riel.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <section className="px-gutter py-[clamp(80px,11vw,150px)]" aria-labelledby="sup-t">
      <div className="mb-[clamp(36px,5vw,64px)] flex flex-wrap items-end justify-between gap-7">
        <div>
          <Titulo id="sup-t">Suplementos, en el mismo gym</Titulo>
          <p className="bajada">
            Proteínas, creatinas y pre-entrenos de {MARCAS.slice(0, -1).join(', ')} y {MARCAS.at(-1)}. Consultás por WhatsApp y lo retirás cuando
            venís a entrenar.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={() => mover(-1)} aria-label="Ver anteriores" className="hidden h-[52px] w-[52px] place-items-center border-2 border-[#444] hover:border-white md:grid">
            <IconoFlecha izquierda />
          </button>
          <button type="button" onClick={() => mover(1)} aria-label="Ver siguientes" className="hidden h-[52px] w-[52px] place-items-center border-2 border-[#444] hover:border-white md:grid">
            <IconoFlecha />
          </button>
          <Link to="/shop" className="btn btn-borde">
            Ver el shop completo
          </Link>
        </div>
      </div>

      <div
        ref={riel}
        className="riel -mx-gutter grid snap-x snap-mandatory auto-cols-[minmax(230px,260px)] grid-flow-col gap-[18px] overflow-x-auto px-gutter pb-[18px]"
      >
        {DESTACADOS.map((id, i) => (
          <div key={id} className="flex snap-start">
            <TarjetaProducto p={porId[id]} i={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
