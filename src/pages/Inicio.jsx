import Hero from '../components/inicio/Hero';
import Cintas from '../components/inicio/Cintas';
import Actividades from '../components/inicio/Actividades';
import PrimeraClase from '../components/inicio/PrimeraClase';
import Destacados from '../components/inicio/Destacados';
import Donde from '../components/inicio/Donde';

export default function Inicio({ listo }) {
  return (
    <>
      <Hero listo={listo} />
      <Cintas />
      <Actividades />
      <PrimeraClase />
      <Destacados />
      <Donde />
    </>
  );
}
