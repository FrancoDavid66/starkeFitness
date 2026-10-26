import { negocio } from '../data/starke';

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const plata = (n) => '$' + Math.round(n).toLocaleString('es-AR');

// minúsculas y sin tildes, para buscar
export const normalizar = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export const linkWhatsApp = (texto) =>
  negocio.whatsapp
    ? `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(texto)}`
    : `https://wa.me/?text=${encodeURIComponent(texto)}`;

export const hora = (h) =>
  String(Math.floor(h)).padStart(2, '0') + ':' + String(Math.round((h % 1) * 60)).padStart(2, '0');

export const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

export const leerLocal = (clave, porDefecto) => {
  try {
    const v = localStorage.getItem(clave);
    return v ? JSON.parse(v) : porDefecto;
  } catch {
    return porDefecto;
  }
};

export const guardarLocal = (clave, valor) => {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* modo privado o storage bloqueado: no pasa nada */
  }
};
