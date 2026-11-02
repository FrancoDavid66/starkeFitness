import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '../components/Logo';
import Mati from '../components/Mati';
import { IconoFlecha, IconoPin, IconoWhatsApp } from '../components/Iconos';
import { ingreso as F } from '../data/ingreso';
import { negocio } from '../data/starke';
import { Link } from '../lib/router';
import { irArriba } from '../lib/scroll';
import { plata } from '../lib/util';

// /ingreso — Formulario de ingreso en pasos (wizard).
// Al final se abre WhatsApp con la ficha completa dirigida al dueño.

const golpe = [0.7, 0, 0.25, 1];
const CLAVE = 'starke-ingreso-v1';

const ETAPAS = ['Elección del plan', 'Objetivo y actividad', 'Salud y antecedentes', 'Reglamento interno', 'Tus datos'];

const VACIO = {
  plan: null,
  acuerdo: null, // 'si' | 'no'
  objetivos: [],
  actividad: null, // 'si' | 'no'
  actividadCual: '',
  salud: {},
  detalle: '',
  reglamento: null, // 'si' | 'no'
  nombre: '',
  nacimiento: '',
  whatsapp: '',
  turno: '',
  inicio: '',
};

// ---------- utilidades ----------
const leer = () => {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE)) || null;
  } catch {
    return null;
  }
};
const guardar = (v) => {
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(v));
  } catch {
    /* sin storage: no pasa nada */
  }
};
const hoyISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const fecha = (iso) => (iso ? iso.split('-').reverse().join('/') : '');
const edad = (iso) => {
  if (!iso) return null;
  const [a, m, d] = iso.split('-').map(Number);
  const h = new Date();
  let e = h.getFullYear() - a;
  if (h.getMonth() + 1 < m || (h.getMonth() + 1 === m && h.getDate() < d)) e--;
  return e;
};
const primerNombre = (n) => n.trim().split(/\s+/)[0] || '';
// Reemplaza {nombre} y {direccion} en los textos de ingreso.js
const conDatos = (t, r) =>
  (t || '').replace(/\{nombre\}/g, primerNombre(r.nombre) || 'campeón').replace(/\{direccion\}/g, negocio.direccion || negocio.zona);
const numeroDueno = () => F.whatsapp || negocio.whatsapp;
const linkWa = (texto) => `https://wa.me/${numeroDueno()}?text=${encodeURIComponent(texto)}`;

const hayAlerta = (r) => F.salud.some((q) => q.alerta.includes(r.salud[q.id]));

// Lista de pasos (la pregunta 7 de salud aparece solo si respondió algo que la pide)
const armarPasos = (r) => [
  { e: 0, k: 'plan' },
  { e: 0, k: 'acuerdo' },
  { e: 1, k: 'objetivos' },
  { e: 1, k: 'actividad' },
  ...F.salud.map((q, n) => ({ e: 2, k: 'salud', q, n })),
  ...(hayAlerta(r) ? [{ e: 2, k: 'detalle' }] : []),
  { e: 3, k: 'reglamento' },
  { e: 4, k: 'datos1' },
  { e: 4, k: 'datos2' },
];

// Qué falta en cada paso (null = está todo bien)
const falta = (p, r) => {
  switch (p.k) {
    case 'plan':
      return r.plan ? null : 'Elegí un plan para seguir.';
    case 'acuerdo':
      return r.acuerdo === 'si' ? null : r.acuerdo === 'no' ? 'bloqueado' : 'Elegí una opción.';
    case 'objetivos':
      return r.objetivos.length ? null : 'Elegí al menos un objetivo.';
    case 'actividad':
      if (!r.actividad) return 'Elegí una opción.';
      if (r.actividad === 'si' && r.actividadCual.trim().length < 2) return 'Contanos qué actividad estás haciendo.';
      return null;
    case 'salud':
      return r.salud[p.q.id] ? null : 'Elegí una opción.';
    case 'detalle':
      return r.detalle.trim().length >= 3 ? null : 'Contanos brevemente tu situación.';
    case 'reglamento':
      return r.reglamento === 'si' ? null : r.reglamento === 'no' ? 'bloqueado' : 'Elegí una opción.';
    case 'datos1': {
      if (r.nombre.trim().split(/\s+/).length < 2) return 'Escribí tu nombre y apellido.';
      const e = edad(r.nacimiento);
      if (e === null || e < 3 || e > 100) return 'Revisá tu fecha de nacimiento.';
      if (r.whatsapp.replace(/\D/g, '').length < 8) return 'Revisá tu número de WhatsApp.';
      return null;
    }
    case 'datos2':
      if (r.turno.trim().length < 2) return 'Contanos en qué turno querés entrenar.';
      if (!r.inicio || r.inicio < hoyISO()) return 'Elegí una fecha de inicio (de hoy en adelante).';
      return null;
    default:
      return null;
  }
};

// Lo que dice Mati en cada paso (textos en ingreso.js -> mati)
const fraseMati = (p, r) => {
  const M = F.mati;
  if (p.k === 'salud') return M.salud[p.n] || '';
  if ((p.k === 'acuerdo' && r.acuerdo === 'no') || (p.k === 'reglamento' && r.reglamento === 'no')) return M.bloqueo;
  if (p.k === 'actividad' && r.actividad === 'si') return M.actividadSi;
  return M[p.k] || '';
};
// Con qué cara lo dice: serio en salud y reglamento, se ríe con el "¡Bien ahí!"
const caraMati = (p, r) => {
  if (p.k === 'reglamento' && r.reglamento === 'no') return 'normal';
  if (['salud', 'detalle', 'reglamento'].includes(p.k)) return 'serio';
  if (p.k === 'actividad' && r.actividad === 'si') return 'risa';
  return 'normal';
};

// Mensaje que le llega al dueño
const armarMensaje = (r) => {
  const plan = F.planes.find((p) => p.id === r.plan);
  const alerta = hayAlerta(r);
  const e = edad(r.nacimiento);
  return [
    '📝 *FICHA DE INGRESO · STARKE*',
    '',
    `👤 *Nombre:* ${r.nombre.trim()}`,
    `🎂 *Nacimiento:* ${fecha(r.nacimiento)}${e !== null ? ` (${e} años)` : ''}`,
    `📱 *WhatsApp:* ${r.whatsapp.trim()}`,
    `🕒 *Turno:* ${r.turno.trim()}`,
    `📅 *Inicio:* ${fecha(r.inicio)}`,
    '',
    `💪 *Plan:* ${plan ? `${plan.n} — ${plata(plan.precio)} mensuales` : '-'}`,
    '✅ De acuerdo con el plan y su valor',
    '',
    '🎯 *Objetivos:*',
    ...r.objetivos.map((o) => `• ${o}`),
    '',
    `🏃 *Actividad actual:* ${r.actividad === 'si' ? `Sí — ${r.actividadCual.trim()}` : 'No'}`,
    '',
    `🩺 *Salud:*${alerta ? ' ⚠️ REVISAR' : ' sin antecedentes marcados'}`,
    ...F.salud.map((q) => `• ${q.corto}: ${r.salud[q.id] || '-'}`),
    ...(alerta && r.detalle.trim() ? [`📌 *Detalle:* ${r.detalle.trim()}`] : []),
    '',
    '📋 *Reglamento:* leído y aceptado ✅',
    '',
    `_Enviado desde la web de Starke · ${fecha(hoyISO())}_`,
  ].join('\n');
};

// ---------- página ----------
export default function Ingreso() {
  const guardado = useMemo(leer, []);
  const [fase, setFase] = useState(guardado?.fase || 'inicio'); // inicio | wizard | fin
  const [r, setR] = useState({ ...VACIO, ...(guardado?.r || {}) });
  const [i, setI] = useState(guardado?.i || 0);
  const [dir, setDir] = useState(1);
  const [aviso, setAviso] = useState(null);
  const [intentos, setIntentos] = useState(0); // cada vez que falta algo, Mati lo vuelve a decir
  const [enviado, setEnviado] = useState(guardado?.enviado || false); // ya tocó "Enviar datos" en la bienvenida
  const avanzarAuto = useRef(null);

  const pasos = useMemo(() => armarPasos(r), [r]);
  const paso = pasos[Math.min(i, pasos.length - 1)];
  const ultimo = i >= pasos.length - 1;

  useEffect(() => guardar({ fase, r, i, enviado }), [fase, r, i, enviado]);
  useEffect(() => () => clearTimeout(avanzarAuto.current), []);

  const poner = (cambios) => {
    setAviso(null);
    setR((x) => ({ ...x, ...cambios }));
  };

  const ir = (n) => {
    clearTimeout(avanzarAuto.current);
    setAviso(null);
    setDir(n > i ? 1 : -1);
    setI(Math.max(0, Math.min(n, pasos.length - 1)));
    irArriba(true);
  };

  const siguiente = (rActual = r) => {
    const f = falta(paso, rActual);
    if (f) {
      if (f !== 'bloqueado') {
        setAviso(f);
        setIntentos((n) => n + 1);
      }
      return;
    }
    if (ultimo) {
      // primero la bienvenida (con Mati transformándose) y desde ahí se manda todo por WhatsApp
      setEnviado(false);
      setFase('fin');
      irArriba(true);
      return;
    }
    ir(i + 1);
  };

  // Opción única: se marca y pasa sola al siguiente paso
  const elegirYSeguir = (cambios, bloquea = false) => {
    poner(cambios);
    if (bloquea) return;
    clearTimeout(avanzarAuto.current);
    avanzarAuto.current = setTimeout(() => {
      setDir(1);
      setI((x) => x + 1);
      irArriba(true);
    }, 320);
  };

  const enviar = () => {
    window.open(linkWa(armarMensaje(r)), '_blank', 'noopener');
    setEnviado(true);
  };

  const reiniciar = () => {
    setR(VACIO);
    setI(0);
    setEnviado(false);
    setFase('inicio');
  };

  return (
    <section
      className="relative min-h-[100svh] pb-[120px]"
      style={{ background: 'radial-gradient(110% 55% at 50% 0%, rgba(227,19,27,.22), transparent 62%)' }}
    >
      {/* barra de arriba */}
      <div className="mx-auto flex max-w-[720px] items-center justify-between gap-3 px-4 pt-4 md:pt-6">
        <Link to="/" className="flex items-center gap-3 no-underline" aria-label="Volver a la web de Starke">
          <Logo className="h-11 w-11" />
          <span className="font-cond text-[15px] font-bold uppercase leading-tight tracking-[.06em] text-gris">
            Formulario
            <br />
            de ingreso
          </span>
        </Link>
        <Link to="/" className="grid h-11 w-11 place-items-center border-2 border-[#3a3a3a] text-lg no-underline hover:border-white" aria-label="Salir del formulario">
          ✕
        </Link>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {fase === 'inicio' && <Inicio key="inicio" onEmpezar={() => { setFase('wizard'); irArriba(true); }} enCurso={i > 0} />}

        {fase === 'wizard' && (
          <motion.div key="wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-[720px] px-4">
            <Progreso pasos={pasos} i={i} />

            {/* Mati acompaña cada paso: pulgar arriba al empezar cada etapa nueva, sorprendido si falta algo */}
            <Mati
              className="mt-6"
              frase={aviso ? F.mati.aviso + aviso : fraseMati(paso, r)}
              cara={aviso ? 'sorpresa' : caraMati(paso, r)}
              gesto={!aviso && paso.e > 0 && pasos.findIndex((p) => p.e === paso.e) === i ? 'pulgar' : null}
              vez={aviso ? intentos : 0}
            />

            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={`${paso.k}-${paso.q?.id || ''}`}
                custom={dir}
                variants={{
                  entra: (d) => ({ opacity: 0, x: d * 60 }),
                  quieto: { opacity: 1, x: 0 },
                  sale: (d) => ({ opacity: 0, x: d * -60 }),
                }}
                initial="entra"
                animate="quieto"
                exit="sale"
                transition={{ duration: 0.32, ease: golpe }}
                className="pt-6"
              >
                <Paso paso={paso} r={r} poner={poner} elegirYSeguir={elegirYSeguir} siguiente={siguiente} />
              </motion.div>
            </AnimatePresence>

            {aviso && (
              <p role="alert" className="mt-4 border-l-4 border-rojo bg-rojo/10 px-3.5 py-2.5 text-[15px] text-white">
                {aviso}
              </p>
            )}

            {/* botones: fijos abajo en el celu */}
            <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-linea bg-black/95 px-4 py-3 backdrop-blur md:static md:mt-8 md:border-0 md:bg-transparent md:p-0">
              <div className="mx-auto flex max-w-[720px] gap-3">
                <button
                  type="button"
                  onClick={() => (i === 0 ? setFase('inicio') : ir(i - 1))}
                  className="grid min-h-[54px] w-[64px] flex-none place-items-center border-2 border-[#3a3a3a] hover:border-white md:w-auto md:px-5"
                  aria-label="Paso anterior"
                >
                  <span className="flex items-center gap-2 font-cond text-lg font-extrabold uppercase italic">
                    <IconoFlecha izquierda />
                    <span className="hidden md:inline">Atrás</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => siguiente()}
                  disabled={falta(paso, r) === 'bloqueado'}
                  className="btn btn-rojo flex-1 hover:border-rojo hover:bg-rojo hover:text-white disabled:pointer-events-none disabled:opacity-35 md:hover:border-white md:hover:bg-white md:hover:text-negro"
                >
                  {ultimo ? (
                    <>
                      Terminar inscripción
                      <IconoFlecha />
                    </>
                  ) : (
                    <>
                      Siguiente
                      <IconoFlecha />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {fase === 'fin' && (
          <Fin
            key="fin"
            r={r}
            enviado={enviado}
            onEnviar={enviar}
            onRevisar={() => {
              setFase('wizard');
              irArriba(true);
            }}
            onOtra={reiniciar}
          />
        )}
      </AnimatePresence>

    </section>
  );
}

// ---------- portada del formulario ----------
function Inicio({ onEmpezar, enCurso }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45, ease: golpe }}
      className="mx-auto max-w-[720px] px-4 pt-[clamp(28px,6vh,70px)]"
    >
      <Mati className="mb-9" frase={F.mati.inicio} gesto="guino" />
      <p className="font-cond text-lg font-bold uppercase tracking-[.1em] text-rojo">{F.lema}</p>
      <h1 className="tit mt-2 text-[clamp(52px,12vw,96px)] leading-[.86]">
        Empezá a<br />
        entrenar
      </h1>
      <p className="mt-6 font-cond text-[26px] font-extrabold uppercase italic">{F.bienvenida}</p>
      <p className="mt-3 max-w-[52ch] text-[17px] leading-relaxed text-[#d6d6d6]">{F.intro}</p>

      <ol className="mt-8 grid gap-2 sm:grid-cols-5">
        {ETAPAS.map((e, n) => (
          <motion.li
            key={e}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + n * 0.06, ease: golpe }}
            className="flex items-center gap-3 border-l-4 border-rojo bg-panel px-3 py-2.5 sm:flex-col sm:items-start sm:gap-1"
          >
            <span className="font-cond text-2xl font-black italic leading-none text-rojo">{n + 1}</span>
            <span className="font-cond text-[15px] font-bold uppercase leading-tight tracking-[.03em]">{e}</span>
          </motion.li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-gris">Son 5 etapas cortas, te lleva unos 3 minutos. Al final se envía todo por WhatsApp.</p>

      <button type="button" onClick={onEmpezar} className="btn btn-rojo mt-8 w-full sm:w-auto">
        {enCurso ? 'Seguir donde quedé' : 'Empezar'}
        <IconoFlecha />
      </button>
    </motion.div>
  );
}

// ---------- línea de carga ----------
function Progreso({ pasos, i }) {
  const actual = pasos[i].e;
  const delEtapa = (e) => pasos.filter((p) => p.e === e);
  const llenado = (e) => {
    if (e < actual) return 1;
    if (e > actual) return 0;
    const lista = delEtapa(e);
    const pos = lista.indexOf(pasos[i]);
    return (pos + 0.5) / lista.length;
  };
  const total = Math.round(((i + 0.5) / pasos.length) * 100);

  return (
    <div className="pt-6" aria-label={`Etapa ${actual + 1} de 5: ${ETAPAS[actual]}`}>
      <div className="mb-2.5 flex items-end justify-between gap-3">
        <p className="font-cond text-[15px] font-bold uppercase tracking-[.08em] text-gris">
          Etapa {actual + 1} de {ETAPAS.length}
          <span className="block text-[22px] italic leading-tight tracking-normal text-white">{ETAPAS[actual]}</span>
        </p>
        <span className="font-cond text-[34px] font-black italic leading-none text-rojo" aria-hidden="true">
          {total}%
        </span>
      </div>
      <div className="grid grid-cols-5 gap-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={total}>
        {ETAPAS.map((e, n) => (
          <div key={e} className="h-2 overflow-hidden bg-[#262626] [clip-path:polygon(4px_0,100%_0,calc(100%-4px)_100%,0_100%)]">
            <motion.div className="h-full bg-rojo" initial={false} animate={{ width: `${llenado(n) * 100}%` }} transition={{ duration: 0.5, ease: golpe }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- piezas ----------
const Pregunta = ({ children, sub }) => (
  <>
    <h2 className="tit text-[clamp(30px,6vw,46px)] leading-[.95]">{children}</h2>
    {sub && <p className="mt-2.5 text-[15px] text-gris">{sub}</p>}
  </>
);

function Opcion({ activa, onClick, children, multiple = false, detalle }) {
  return (
    <button
      type="button"
      role={multiple ? 'checkbox' : 'radio'}
      aria-checked={activa}
      onClick={onClick}
      className={`flex min-h-[60px] w-full items-center gap-3.5 border-2 px-4 py-3 text-left transition-colors ${
        activa ? 'border-rojo bg-rojo text-white' : 'border-[#3a3a3a] bg-panel hover:border-white'
      }`}
    >
      <span
        className={`grid h-6 w-6 flex-none place-items-center border-2 ${multiple ? '' : 'rounded-full'} ${activa ? 'border-white bg-white' : 'border-[#666]'}`}
        aria-hidden="true"
      >
        {activa && <motion.i initial={{ scale: 0 }} animate={{ scale: 1 }} className={`block h-2.5 w-2.5 bg-rojo ${multiple ? '' : 'rounded-full'}`} />}
      </span>
      <span className="flex-1">
        <span className="block text-[17px] font-semibold leading-snug">{children}</span>
        {detalle && <span className={`mt-0.5 block text-sm ${activa ? 'text-white/85' : 'text-gris'}`}>{detalle}</span>}
      </span>
    </button>
  );
}

function Bloqueo({ texto, mensaje }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 border-2 border-[#3a3a3a] bg-panel p-4">
      <p className="text-[16px] text-[#e6e6e6]">{texto}</p>
      <a className="btn btn-borde btn-chico mt-4" href={linkWa(mensaje)} target="_blank" rel="noopener">
        <IconoWhatsApp width={20} height={20} />
        Consultar por WhatsApp
      </a>
    </motion.div>
  );
}

function Campo({ etiqueta, children, ayuda }) {
  return (
    <label className="grid gap-2">
      <span className="font-cond text-[17px] font-bold uppercase tracking-[.05em]">{etiqueta}</span>
      {children}
      {ayuda && <span className="text-sm text-gris">{ayuda}</span>}
    </label>
  );
}

const claseInput =
  'min-h-[56px] w-full border-2 border-[#3a3a3a] bg-[#0b0b0b] px-4 text-[17px] text-white outline-none [color-scheme:dark] placeholder:text-[#777] focus:border-white';

// ---------- cada paso ----------
function Paso({ paso, r, poner, elegirYSeguir, siguiente }) {
  const enter = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      siguiente();
    }
  };

  switch (paso.k) {
    case 'plan':
      return (
        <>
          <Pregunta sub={F.notaPlan}>¿Qué plan de entrenamiento querés elegir?</Pregunta>
          <div className="mt-6 grid gap-3 sm:grid-cols-2" role="radiogroup">
            {F.planes.map((p) => {
              const activa = r.plan === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={activa}
                  onClick={() => elegirYSeguir({ plan: p.id })}
                  className={`relative overflow-hidden border-2 p-5 text-left transition-colors ${activa ? 'border-rojo bg-rojo' : 'border-[#3a3a3a] bg-panel hover:border-white'}`}
                >
                  <span className="block font-cond text-[22px] font-extrabold uppercase italic leading-none">{p.n}</span>
                  <span className="mt-4 block font-cond text-[46px] font-black italic leading-none">{plata(p.precio)}</span>
                  <span className={`text-sm ${activa ? 'text-white/85' : 'text-gris'}`}>mensuales</span>
                </button>
              );
            })}
          </div>
        </>
      );

    case 'acuerdo': {
      const plan = F.planes.find((p) => p.id === r.plan);
      return (
        <>
          <Pregunta sub={plan ? `${plan.n} — ${plata(plan.precio)} mensuales.` : null}>¿Estás de acuerdo con el plan y su valor?</Pregunta>
          <div className="mt-6 grid gap-3" role="radiogroup">
            <Opcion activa={r.acuerdo === 'si'} onClick={() => elegirYSeguir({ acuerdo: 'si' })}>
              Sí, estoy de acuerdo y quiero continuar.
            </Opcion>
            <Opcion activa={r.acuerdo === 'no'} onClick={() => elegirYSeguir({ acuerdo: 'no' }, true)}>
              No, quiero consultar antes de continuar.
            </Opcion>
          </div>
          {r.acuerdo === 'no' && (
            <Bloqueo
              texto="¡Sin problema! Escribinos y te contamos todo lo que necesites. Cuando quieras, volvés y seguís desde acá."
              mensaje={`Hola Starke! Estaba completando el formulario de ingreso y quiero consultar por el ${plan ? plan.n : 'plan'} antes de continuar.`}
            />
          )}
        </>
      );
    }

    case 'objetivos': {
      const alternar = (o) => poner({ objetivos: r.objetivos.includes(o) ? r.objetivos.filter((x) => x !== o) : [...r.objetivos, o] });
      return (
        <>
          <Pregunta sub="Podés seleccionar más de una opción si tenés varios objetivos.">¿Cuál es tu principal objetivo al comenzar a entrenar?</Pregunta>
          <div className="mt-6 grid gap-3" role="group">
            {F.objetivos.map((o) => (
              <Opcion key={o} multiple activa={r.objetivos.includes(o)} onClick={() => alternar(o)}>
                {o}
              </Opcion>
            ))}
          </div>
        </>
      );
    }

    case 'actividad':
      return (
        <>
          <Pregunta sub={F.actividad.sub}>{F.actividad.pregunta}</Pregunta>
          <div className="mt-6 grid gap-3" role="radiogroup">
            <Opcion activa={r.actividad === 'si'} onClick={() => poner({ actividad: 'si' })}>
              Sí
            </Opcion>
            <Opcion activa={r.actividad === 'no'} onClick={() => elegirYSeguir({ actividad: 'no' })}>
              No
            </Opcion>
          </div>
          {r.actividad === 'si' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: golpe }} className="mt-5" onKeyDown={enter}>
              <Campo etiqueta={F.actividad.cual}>
                <input
                  autoFocus
                  className={claseInput}
                  value={r.actividadCual}
                  onChange={(e) => poner({ actividadCual: e.target.value })}
                  maxLength={120}
                  placeholder={F.actividad.ejemplo}
                />
              </Campo>
            </motion.div>
          )}
        </>
      );

    case 'salud':
      return (
        <>
          <p className="mb-3 font-cond text-[15px] font-bold uppercase tracking-[.08em] text-rojo">
            Pregunta {paso.n + 1} de {F.salud.length}
          </p>
          <Pregunta sub={paso.n === 0 ? 'Para poder adaptar los entrenamientos a tus necesidades, necesitamos conocer algunos aspectos importantes sobre tu salud.' : null}>
            {paso.q.p}
          </Pregunta>
          <div className="mt-6 grid gap-3" role="radiogroup">
            {paso.q.op.map((o) => (
              <Opcion key={o} activa={r.salud[paso.q.id] === o} onClick={() => elegirYSeguir({ salud: { ...r.salud, [paso.q.id]: o } })}>
                {o}
              </Opcion>
            ))}
          </div>
          {paso.n === 0 && <NotaConfidencial />}
        </>
      );

    case 'detalle':
      return (
        <>
          <Pregunta sub="Respondiste que sí a alguna de las preguntas anteriores.">{F.preguntaDetalle}</Pregunta>
          <textarea
            autoFocus
            value={r.detalle}
            onChange={(e) => poner({ detalle: e.target.value })}
            rows={5}
            maxLength={600}
            placeholder="Ej: tengo una lesión en la rodilla derecha de hace 2 años, a veces me molesta al correr."
            className={`${claseInput} mt-6 min-h-[150px] resize-y py-3`}
          />
          <NotaConfidencial />
        </>
      );

    case 'reglamento':
      return (
        <>
          <Pregunta sub="Para garantizar una buena organización, una atención personalizada y el correcto funcionamiento del gimnasio, solicitamos leer y aceptar las siguientes normas:">
            Reglamento interno Starke
          </Pregunta>
          <ol className="mt-6 grid gap-2.5">
            {F.reglamento.map((n, k) => (
              <motion.li
                key={n.t}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: k * 0.06, ease: golpe }}
                className="grid grid-cols-[34px_1fr] gap-3 bg-panel p-4"
              >
                <span className="font-cond text-[30px] font-black italic leading-none text-rojo">{k + 1}</span>
                <span>
                  <span className="block font-cond text-[19px] font-extrabold uppercase leading-tight">{n.t}</span>
                  <span className="mt-1 block text-[15px] text-[#cfcfcf]">{n.d}</span>
                </span>
              </motion.li>
            ))}
          </ol>
          <p className="mb-3 mt-7 font-cond text-[19px] font-extrabold uppercase">Aceptación del reglamento</p>
          <div className="grid gap-3" role="radiogroup">
            <Opcion activa={r.reglamento === 'si'} onClick={() => elegirYSeguir({ reglamento: 'si' })}>
              Sí, leí y acepto las normas de funcionamiento de STARKE.
            </Opcion>
            <Opcion activa={r.reglamento === 'no'} onClick={() => elegirYSeguir({ reglamento: 'no' }, true)}>
              No acepto las condiciones.
            </Opcion>
          </div>
          {r.reglamento === 'no' && (
            <Bloqueo
              texto="Para entrenar en Starke necesitamos que aceptes el reglamento. Si tenés alguna duda sobre las normas, escribinos y lo charlamos."
              mensaje="Hola Starke! Estaba completando el formulario de ingreso y tengo una consulta sobre el reglamento."
            />
          )}
        </>
      );

    case 'datos1':
      return (
        <>
          <Pregunta sub="Para completar tu inscripción necesitamos los siguientes datos.">Tus datos personales</Pregunta>
          <div className="mt-6 grid gap-5" onKeyDown={enter}>
            <Campo etiqueta="Nombre y apellido">
              <input className={claseInput} value={r.nombre} onChange={(e) => poner({ nombre: e.target.value })} autoComplete="name" placeholder="Ej: Juan Pérez" />
            </Campo>
            <Campo etiqueta="Fecha de nacimiento">
              <input type="date" className={claseInput} value={r.nacimiento} max={hoyISO()} onChange={(e) => poner({ nacimiento: e.target.value })} autoComplete="bday" />
            </Campo>
            <Campo etiqueta="Número de WhatsApp">
              <input
                type="tel"
                inputMode="tel"
                className={claseInput}
                value={r.whatsapp}
                onChange={(e) => poner({ whatsapp: e.target.value })}
                autoComplete="tel"
                placeholder="Ej: 11 2345-6789"
              />
            </Campo>
          </div>
        </>
      );

    case 'datos2':
      return (
        <>
          <Pregunta sub="Último paso: tocá Terminar, vas a ver tu bienvenida y desde ahí mandás tu ficha por WhatsApp.">¿Cuándo arrancás?</Pregunta>
          <div className="mt-6 grid gap-5" onKeyDown={enter}>
            <Campo etiqueta="Turno en el que querés entrenar" ayuda="Días y horario que te quedan cómodos.">
              <input className={claseInput} value={r.turno} onChange={(e) => poner({ turno: e.target.value })} placeholder="Ej: lunes, miércoles y viernes a las 19 hs" />
            </Campo>
            <Campo etiqueta="Fecha de inicio">
              <input type="date" className={claseInput} value={r.inicio} min={hoyISO()} onChange={(e) => poner({ inicio: e.target.value })} />
            </Campo>
          </div>
        </>
      );

    default:
      return null;
  }
}

const NotaConfidencial = () => (
  <p className="mt-6 flex gap-3 border-l-4 border-[#3a3a3a] pl-3.5 text-sm text-gris">
    <span>
      <b className="font-semibold text-[#cfcfcf]">Importante:</b> {F.notaSalud}
    </span>
  </p>
);

// ---------- final: bienvenida ----------
function Fin({ r, enviado, onEnviar, onRevisar, onOtra }) {
  const nombre = primerNombre(r.nombre).toUpperCase() || 'CAMPEÓN';
  const letras = nombre.split('');
  const video = useRef(null);
  const [flash, setFlash] = useState(0); // destello de toda la pantalla cuando Mati se transforma
  const D = 1.3; // las letras caen después de la transformación

  useEffect(() => {
    // intenta reproducir con sonido; si el navegador no deja, arranca en silencio
    const v = video.current;
    if (!v) return;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-[720px] px-4 pt-[clamp(30px,6vh,70px)] text-center">
      {flash > 0 && <div key={flash} className="flash-pantalla" aria-hidden="true" />}
      {/* Mati carga energía (tiembla), destello y queda transformado en "modo Starke" */}
      <motion.div
        className="flex justify-center"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, x: [0, -5, 5, -6, 6, -4, 4, -6, 6, -3, 3, 0] }}
        transition={{ scale: { type: 'spring', stiffness: 220, damping: 14 }, opacity: { duration: 0.2 }, x: { duration: 1.1, delay: 0.25 } }}
      >
        <Mati escala={2} modo="transforma" onTransforma={() => setFlash((f) => f + 1)} />
      </motion.div>

      <motion.p
        className="tit mt-7 text-[clamp(34px,8vw,58px)] leading-[.9]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: D + 0.1, ease: golpe }}
      >
        ¡Bienvenido/a,
      </motion.p>
      <h1 className="tit mt-1 break-words text-[clamp(56px,16vw,128px)] leading-[.85] text-rojo" aria-label={`Bienvenido/a, ${nombre}`}>
        {letras.map((c, k) => (
          <motion.span
            key={k}
            aria-hidden="true"
            className="inline-block"
            initial={{ y: 80, opacity: 0, rotate: -10 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 16, delay: D + 0.3 + k * 0.05 }}
          >
            {c}
          </motion.span>
        ))}
        <motion.span aria-hidden="true" className="inline-block" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: D + 0.35 + letras.length * 0.05 }}>
          !
        </motion.span>
      </h1>
      <motion.p className="mt-3 text-[26px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: D + 0.8 }}>
        STARKE ❤️🖤
      </motion.p>

      {/* último paso: "Nos vemos en Patagonia 585" y el botón que manda la ficha por WhatsApp */}
      <motion.div
        className="mx-auto mt-9 max-w-[520px] border-2 border-rojo bg-panel px-5 pb-6 pt-6 text-center shadow-[8px_8px_0_#e3131b] sm:px-8"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: D + 0.9, type: 'spring', stiffness: 240, damping: 20 }}
      >
        {!enviado ? (
          <>
            <p className="font-cond text-lg font-bold uppercase tracking-[.1em] text-rojo">{conDatos(F.previo.antetitulo, r)}</p>
            <h2 className="tit mt-1 text-[clamp(34px,8.5vw,52px)] leading-[.88]">{conDatos(F.previo.titulo, r)}</h2>
            <p className="mt-2 font-cond text-[17px] font-bold uppercase tracking-[.08em] text-gris">{negocio.zona}</p>
            <p className="mx-auto mt-4 max-w-[40ch] text-[16px] leading-relaxed text-[#dcdcdc]">{conDatos(F.previo.texto, r)}</p>
            <button type="button" className="btn btn-rojo destacado mt-6 w-full" onClick={onEnviar}>
              <span className="destacado-brillo" aria-hidden="true" />
              <IconoWhatsApp />
              {F.previo.boton}
            </button>
            <button type="button" className="mt-4 text-sm text-gris underline underline-offset-4 hover:text-white" onClick={onRevisar}>
              {F.previo.volver}
            </button>
          </>
        ) : (
          <div className="text-left">
            <p className="font-cond text-lg font-bold uppercase tracking-[.1em] text-rojo">¡Datos enviados!</p>
            <p className="mt-2 text-[15px] text-[#cfcfcf]">
              Se abrió WhatsApp con tu ficha. <b className="text-white">Si todavía no la mandaste, tocá Enviar ahí</b> para confirmar tu inscripción.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" className="btn btn-rojo btn-chico" onClick={onEnviar}>
                <IconoWhatsApp width={20} height={20} />
                Abrir WhatsApp de nuevo
              </button>
              <Link to="/mapa" className="btn btn-borde btn-chico">
                <IconoPin width={18} height={18} />
                Cómo llegar
              </Link>
              <Link to="/" className="btn btn-borde btn-chico">
                Ir a la web
              </Link>
              <button type="button" className="text-sm text-gris underline hover:text-white" onClick={onOtra}>
                Inscribir a otra persona
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {F.video && (
        <motion.div
          className="mx-auto mt-8 aspect-[9/16] max-h-[70svh] w-auto overflow-hidden border-2 border-rojo bg-panel"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: D + 1.1, ease: golpe }}
        >
          <video ref={video} src={F.video} className="h-full w-full object-cover" playsInline controls preload="auto" />
        </motion.div>
      )}

      <motion.div className="mx-auto mt-9 max-w-[46ch] space-y-2 text-[17px] text-[#dcdcdc]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: D + 1 }}>
        {F.cierre.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </motion.div>
      <motion.p className="tit mt-8 text-[clamp(26px,5vw,38px)] leading-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: D + 1.3 }}>
        {F.remate}
      </motion.p>
      <p className="mt-2 font-cond text-[15px] font-bold uppercase tracking-[.1em] text-gris">
        Starke · {F.lema}
      </p>

    </motion.div>
  );
}
