import { useEffect, useState } from 'react';
import { horarios } from '../data/starke';
import { DIAS } from './util';

const fechaA = (base, sumarDias, h) => {
  const d = new Date(base);
  d.setDate(d.getDate() + sumarDias);
  d.setHours(Math.floor(h), Math.round((h % 1) * 60), 0, 0);
  return d;
};

// ¿Está abierto? ¿Hasta cuándo? ¿Cuándo abre?
export function estado(ahora = new Date()) {
  const t = ahora.getHours() + ahora.getMinutes() / 60;
  const hoy = ahora.getDay();
  const h = horarios[hoy];
  if (h && t >= h[0] && t < h[1]) {
    return { abierto: true, objetivo: fechaA(ahora, 0, h[1]), cierra: h[1] };
  }
  for (let i = 0; i < 8; i++) {
    const dia = (hoy + i) % 7;
    const hd = horarios[dia];
    if (!hd || (i === 0 && t >= hd[0])) continue;
    return {
      abierto: false,
      objetivo: fechaA(ahora, i, hd[0]),
      abre: hd[0],
      cuando: i === 0 ? 'hoy' : i === 1 ? 'mañana' : 'el ' + DIAS[dia],
    };
  }
  return { abierto: false, objetivo: ahora, abre: 0, cuando: '' };
}

export function cuentaRegresiva(objetivo, ahora = new Date()) {
  let s = Math.max(0, Math.floor((objetivo - ahora) / 1000));
  const h = Math.min(99, Math.floor(s / 3600));
  s %= 3600;
  return [h, Math.floor(s / 60), s % 60].map((n) => String(n).padStart(2, '0')).join(':');
}

// Se actualiza cada segundo
export function useReloj() {
  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const st = estado(ahora);
  return { ...st, cuenta: cuentaRegresiva(st.objetivo, ahora) };
}
