import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import hoja from '../assets/mati/mati.png';
import hojaPoder from '../assets/mati/mati-poder.png';

// Mati (el coach de Starke) en pixel art, con globito de diálogo.
// La hoja src/assets/mati/mati.png tiene 18 cuadros de 99×99:
//  0 quieto · 1 boca abierta · 2 cejas arriba · 3 cejas y boca · 4-8 brillo en los lentes
//  9 sorprendido · 10 sorprendido (boca chica) · 11 carcajada · 12 carcajada (rebote)
//  13 guiño · 14 pulgar arriba · 15 pulgar (rebote) · 16 serio · 17 serio hablando
// Y src/assets/mati/mati-poder.png (la transformación, "modo Starke"), 4 cuadros:
//  100 cargando · 101 cargando (temblor) · 102 transformado · 103 transformado (el aura se mueve)
//
// Props:
//  frase  → lo que dice (aparece letra por letra mientras habla). Sin frase = sin globito.
//  cara   → con qué cara habla: 'normal' | 'serio' | 'sorpresa' | 'risa'
//  gesto  → algo que hace antes de hablar: 'pulgar' | 'guino'
//  modo   → 'quieto' (solo le brillan los lentes) · 'vivo' (habla solo y guiña, para /links)
//           · 'festeja' (se ríe y hace pulgar arriba)
//           · 'transforma' (carga energía, destello y queda transformado: para el final del formulario)
//  poder  → en modo 'vivo', cada tanto se transforma un ratito
//  onTransforma → se llama en el momento del destello (para que la página haga su flash)
//  escala → 1 = 99 px, 2 = 198 px (siempre enteros para que el pixel art no se deforme)
//  globo  → 'derecha' (globito al lado) o 'abajo' (globito debajo, centrado)
//  vez    → si cambia, repite la frase aunque sea la misma (ej: otro aviso igual)
// se precarga la hoja de la transformación para que no parpadee la primera vez
if (typeof window !== 'undefined') new Image().src = hojaPoder;

const LADO = 99;
const CUADROS = 18;
const C = {
  quieto: 0, boca: 1, cejas: 2, cejasBoca: 3, brillo: [4, 5, 6, 7, 8],
  sorpresa: 9, sorpresaChica: 10, risa: 11, risaRebote: 12, guino: 13, pulgar: 14, pulgarRebote: 15, serio: 16, serioHabla: 17,
};
// cómo mueve la boca con cada cara, en qué cara queda y cuánto tarda en volver a la normal
const CARAS = {
  normal: { habla: [C.boca, C.quieto], queda: C.quieto },
  serio: { habla: [C.serioHabla, C.serio], queda: C.serio },
  sorpresa: { habla: [C.sorpresa, C.sorpresaChica], queda: C.sorpresa, vuelve: 700 },
  risa: { habla: [C.risa, C.risaRebote], queda: C.risa, vuelve: 900 },
};
const GESTOS = {
  pulgar: [[C.pulgar, 170], [C.pulgarRebote, 170], [C.pulgar, 170], [C.pulgarRebote, 170], [C.pulgar, 520]],
  guino: [[C.guino, 950]],
};
const RISA = [[C.risa, 140], [C.risaRebote, 140], [C.risa, 140], [C.risaRebote, 140], [C.risa, 140], [C.risaRebote, 140], [C.risa, 600]];
const CARGA = Array.from({ length: 12 }, (_, k) => [100 + (k % 2), 80]);
const PODER = (veces) => Array.from({ length: veces * 2 }, (_, k) => [102 + (k % 2), 120]);
const POR_LETRA = 28; // ms por letra al escribir
const PASO_BOCA = 130; // ms entre abrir y cerrar la boca

export default function Mati({
  frase = '',
  cara = 'normal',
  gesto = null,
  modo = 'quieto',
  poder = false,
  onTransforma,
  escala = 1,
  globo = 'derecha',
  vez = 0,
  className = '',
}) {
  const reducir = useReducedMotion();
  const C0 = CARAS[cara] || CARAS.normal;
  const reposo = modo === 'transforma' ? 102 : modo === 'festeja' ? C.risa : C0.queda;
  const [cuadro, setCuadro] = useState(reducir ? reposo : modo === 'transforma' ? 100 : C.quieto);
  const [destello, setDestello] = useState(0);
  const avisar = useRef(onTransforma);
  avisar.current = onTransforma;
  const [escrito, setEscrito] = useState(frase.length);
  const timers = useRef([]);
  const intervalo = useRef(null);
  const ocupado = useRef(false); // haciendo algo: el brillo de los lentes espera
  const enReposo = useRef(C.quieto); // cara en la que queda quieto
  const tam = LADO * escala;

  const limpiar = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    ocupado.current = false;
  };
  const despues = (ms, fn) => timers.current.push(setTimeout(fn, ms));

  // pasa una lista de [cuadro, ms] y devuelve cuánto dura
  const reproducir = (lista, desde = 0) => {
    let t = desde;
    lista.forEach(([c, ms]) => {
      despues(t, () => setCuadro(c));
      t += ms;
    });
    return t;
  };

  const terminar = (t, quedaEn = C.quieto) => {
    despues(t, () => {
      setCuadro(quedaEn);
      enReposo.current = quedaEn;
      ocupado.current = false;
    });
  };

  // cada frase nueva: gesto (si hay) y después la escribe letra por letra mientras habla
  useEffect(() => {
    limpiar();
    if (reducir) {
      setEscrito(frase.length);
      setCuadro(reposo);
      return undefined;
    }
    if (!frase && !gesto) {
      setEscrito(0);
      return limpiar;
    }
    ocupado.current = true;
    let t = gesto && GESTOS[gesto] ? reproducir(GESTOS[gesto]) : 0;
    if (!frase) {
      terminar(t);
      return limpiar;
    }
    setEscrito(0);
    t += 150;
    for (let n = 1; n <= frase.length; n++) despues(t + n * POR_LETRA, () => setEscrito(n));
    const golpes = Math.max(2, Math.round((frase.length * POR_LETRA) / PASO_BOCA));
    for (let k = 0; k < golpes; k++) despues(t + k * PASO_BOCA, () => setCuadro(C0.habla[k % 2]));
    t += golpes * PASO_BOCA;
    despues(t, () => setCuadro(C0.queda));
    if (C0.vuelve) terminar(t + C0.vuelve, C.quieto);
    else terminar(t + 10, C0.queda);
    return limpiar;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frase, vez, cara, gesto, reducir]);

  // mientras está quieto: brillo en los lentes; en /links además habla solo y guiña; al final festeja
  useEffect(() => {
    if (reducir) return undefined;
    let vuelta = 0;
    const id = setInterval(() => {
      if (ocupado.current) return;
      vuelta += 1;
      ocupado.current = true;
      if (modo === 'vivo' && poder && vuelta % 4 === 3) {
        const t = reproducir(CARGA);
        despues(t, () => setDestello((d) => d + 1));
        return terminar(reproducir(PODER(7), t));
      }
      if (modo === 'vivo' && vuelta % 3 === 1) {
        const golpes = 9;
        for (let k = 0; k < golpes; k++) despues(k * PASO_BOCA, () => setCuadro(k % 2 ? C.quieto : C.boca));
        return terminar(golpes * PASO_BOCA);
      }
      if (modo === 'vivo' && vuelta % 3 === 2) return terminar(reproducir(GESTOS.guino));
      if (modo === 'transforma') {
        ocupado.current = false;
        return undefined;
      }
      if (modo === 'festeja' && vuelta % 2 === 1) return terminar(reproducir(vuelta % 4 === 1 ? RISA : GESTOS.pulgar));
      if (enReposo.current !== C.quieto) {
        ocupado.current = false; // con cara seria no hay brillo (está hecho sobre la cara normal)
        return undefined;
      }
      return terminar(reproducir(C.brillo.map((c) => [c, 70])));
    }, modo === 'quieto' ? 3000 : 2600);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducir, modo]);

  // al aparecer: en /links arranca hablando y al final arranca riéndose
  useEffect(() => {
    if (reducir || frase || gesto) return undefined;
    if (modo === 'vivo') {
      ocupado.current = true;
      const golpes = 11;
      for (let k = 0; k < golpes; k++) despues(k * PASO_BOCA, () => setCuadro(k % 2 ? C.quieto : C.boca));
      terminar(golpes * PASO_BOCA);
    }
    if (modo === 'festeja') {
      ocupado.current = true;
      terminar(reproducir([...RISA, ...GESTOS.pulgar]));
    }
    if (modo === 'transforma') {
      // carga energía temblando, destello y queda transformado con el aura moviéndose para siempre
      ocupado.current = true;
      const t = reproducir(CARGA, 250);
      despues(t, () => {
        setDestello((d) => d + 1);
        avisar.current?.();
      });
      let k = 0;
      despues(t, () => {
        const id = setInterval(() => setCuadro(102 + (k++ % 2)), 120);
        intervalo.current = id;
      });
    }
    return () => {
      limpiar();
      clearInterval(intervalo.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => limpiar, []);

  const esPoder = cuadro >= 100;
  const cara_ = (
    <span className="relative block flex-none" style={{ width: tam, height: tam }}>
      <span
        role="img"
        aria-label={esPoder ? 'Mati transformado en modo Starke' : 'Mati, el coach de Starke'}
        className="mati"
        style={{
          width: tam,
          height: tam,
          backgroundImage: `url(${esPoder ? hojaPoder : hoja})`,
          backgroundSize: `${tam * (esPoder ? 4 : CUADROS)}px ${tam}px`,
          backgroundPosition: `-${(esPoder ? cuadro - 100 : cuadro) * tam}px 0`,
        }}
      />
      {destello > 0 && <span key={destello} className="mati-destello" aria-hidden="true" />}
    </span>
  );

  if (!frase) return <span className={`inline-block ${className}`}>{cara_}</span>;

  return (
    <div className={`mati-fila ${globo === 'abajo' ? 'mati-fila-abajo' : ''} ${className}`}>
      {cara_}
      <div className={`mati-globo ${globo === 'abajo' ? 'mati-globo-abajo' : ''}`}>
        {/* lo que se ve (se va escribiendo); el resto queda invisible para que el globito no cambie de tamaño */}
        <p aria-hidden="true">
          {frase.slice(0, escrito)}
          <span className="invisible">{frase.slice(escrito)}</span>
        </p>
        <p className="sr-only" aria-live="polite">
          {frase}
        </p>
      </div>
    </div>
  );
}
