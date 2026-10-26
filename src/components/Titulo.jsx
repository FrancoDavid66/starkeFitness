import { motion } from 'framer-motion';

const variantes = {
  oculto: { clipPath: 'inset(-20% -20% 100% -20%)', y: 30 },
  visible: { clipPath: 'inset(-20% -20% -20% -20%)', y: 0, transition: { duration: 0.9, ease: [0.7, 0, 0.25, 1] } },
};

// Título que aparece "cortado" de abajo hacia arriba cuando entra en pantalla.
// El observador va en el contenedor: si el recorte estuviera en el mismo elemento,
// el navegador lo daría por invisible y nunca lo mostraría.
export default function Titulo({ as = 'h2', className = 'tit-l', id, children }) {
  const M = motion[as];
  return (
    <motion.div initial="oculto" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
      <M id={id} className={className} variants={variantes}>
        {children}
      </M>
    </motion.div>
  );
}
