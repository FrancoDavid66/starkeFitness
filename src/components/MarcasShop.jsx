import { AnimatePresence, motion } from 'framer-motion';
import FotoProducto from './FotoProducto';
import { IconoFlecha } from './Iconos';
import { MARCAS_INFO, infoMarca } from '../data/marcas';
import { porId } from '../data/productos';

const golpe = [0.7, 0, 0.25, 1];
const suave = [0.2, 0.8, 0.2, 1];

// Arriba del shop: sin marca elegida -> 4 tarjetas (carrusel en el celu).
// Con marca elegida -> banner rojo con el logo grande, cantidad y para cambiar de marca.
export default function MarcasShop({ marca, onElegir }) {
  const m = marca ? infoMarca[marca] : null;

  return (
    <section className="px-gutter pb-8" aria-label="Marcas">
      <AnimatePresence mode="wait" initial={false}>
        {m ? (
          <Banner key={`banner-${m.k}`} m={m} onElegir={onElegir} />
        ) : (
          <motion.div key="tarjetas" exit={{ opacity: 0, y: -14, transition: { duration: 0.25 } }}>
            <h2 className="mb-3.5 font-cond text-lg font-extrabold uppercase tracking-[.08em] text-gris">Elegí por marca</h2>
            <div className="sin-barra -mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-3 overflow-x-auto px-gutter pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4 lg:gap-4">
              {MARCAS_INFO.map((x, i) => (
                <Tarjeta key={x.k} m={x} i={i} onElegir={onElegir} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Tarjeta({ m, i, onElegir }) {
  const p = porId[m.foto];
  return (
    <motion.button
      type="button"
      onClick={() => onElegir(m.k)}
      aria-label={`Ver los ${m.cantidad} productos de ${m.k}`}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: i * 0.06, ease: golpe }}
      className="group relative h-[164px] w-[252px] flex-none snap-start overflow-hidden border-2 border-linea bg-panel text-left transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-white focus-visible:border-white sm:h-[200px] sm:w-auto lg:h-[224px]"
      style={{ '--e': m.esc }}
    >
      {/* foto del producto estrella */}
      <span className="absolute inset-y-0 right-0 w-[46%] overflow-hidden bg-tiza">
        {p && (
          <FotoProducto
            p={p}
            chica
            className="h-full w-full object-contain px-2 py-3 mix-blend-multiply transition-transform duration-700 ease-golpe group-hover:-rotate-3 group-hover:scale-110"
          />
        )}
      </span>
      {/* corte en diagonal */}
      <span aria-hidden="true" className="absolute -inset-y-3 left-[calc(54%-24px)] w-12 -skew-x-[10deg] bg-panel" />

      <span className="absolute inset-y-0 left-0 flex w-[52%] flex-col items-start justify-between p-4 sm:p-5">
        <img
          src={m.logoTarjeta}
          alt={m.k}
          draggable="false"
          className="h-[calc(24px*var(--e))] w-auto max-w-full object-contain transition-[filter] duration-300 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,.45)] sm:h-[calc(30px*var(--e))] lg:h-[calc(34px*var(--e))]"
        />
        <span className="block">
          <span className="block font-cond text-[44px] font-black italic leading-[.85] sm:text-[52px] lg:text-[58px]">{m.cantidad}</span>
          <span className="block text-[13px] text-gris sm:text-sm">productos</span>
        </span>
        <span className="flex items-center gap-2 font-cond text-[15px] font-extrabold uppercase italic sm:text-[17px]">
          Ver<span className="hidden sm:inline"> productos</span>
          <IconoFlecha width={16} height={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </span>
    </motion.button>
  );
}

function Banner({ m, onElegir }) {
  const p = porId[m.foto];
  const otras = MARCAS_INFO.filter((x) => x.k !== m.k);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.22 } }}
      transition={{ duration: 0.4, ease: golpe }}
      className="grid grid-cols-[64%_36%] overflow-hidden border-2 border-linea bg-panel lg:min-h-[250px] lg:grid-cols-[40%_1fr_24%]"
      style={{ '--e': m.esc }}
      role="region"
      aria-label={`Productos de ${m.k}`}
    >
      {/* bloque rojo con el logo */}
      <div className="relative col-start-1 row-start-1 h-[132px] overflow-hidden md:h-[160px] lg:h-auto">
        <motion.div
          className="absolute inset-0 bg-rojo [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]"
          initial={{ x: '-102%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.55, ease: golpe }}
        />
        <div className="relative grid h-full place-items-center pr-[10%]">
          <motion.img
            src={m.logo}
            alt={m.k}
            draggable="false"
            className="h-[calc(40px*var(--e))] w-auto max-w-[78%] object-contain md:h-[calc(58px*var(--e))] lg:h-[calc(70px*var(--e))]"
            initial={{ opacity: 0, x: -60, skewX: -12 }}
            animate={{ opacity: 1, x: 0, skewX: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: suave }}
          />
        </div>
      </div>

      {/* foto */}
      <div className="relative col-start-2 row-start-1 h-[132px] overflow-hidden bg-tiza md:h-[160px] lg:col-start-3 lg:h-auto">
        {p && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, x: 50, rotate: 8 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: suave }}
          >
            <FotoProducto p={p} eager className="h-full w-full object-contain p-3 mix-blend-multiply md:p-4" />
          </motion.div>
        )}
      </div>

      {/* texto y botones */}
      <div className="col-span-2 row-start-2 flex flex-col justify-center gap-2.5 p-[18px] md:px-7 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:py-6">
        <motion.p
          className="font-cond text-[48px] font-black uppercase italic leading-[.85] md:text-[58px] lg:text-[72px]"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: suave }}
        >
          {m.cantidad} productos
        </motion.p>
        <p className="text-[15px] text-[#d6d6d6] md:text-[17px]">
          de {m.k} · {m.rubros}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <button type="button" className="btn btn-borde btn-chico" onClick={() => onElegir(null)}>
            Ver todas las marcas
          </button>
          <div className="flex items-center gap-4" role="group" aria-label="Cambiar de marca">
            {otras.map((x) => (
              <button
                key={x.k}
                type="button"
                onClick={() => onElegir(x.k)}
                aria-label={`Ver ${x.k}`}
                className="grid min-h-[44px] place-items-center opacity-60 transition-[opacity,transform] hover:-translate-y-0.5 hover:opacity-100"
                style={{ '--e': x.esc }}
              >
                <img src={x.logo} alt="" draggable="false" className="h-[calc(17px*var(--e))] w-auto" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
