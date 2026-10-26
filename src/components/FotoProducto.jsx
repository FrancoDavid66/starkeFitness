import { useState } from 'react';
import { fotoEna, fotoProducto } from '../lib/fotos';

// Foto de la variante -> foto online de ENA -> foto principal -> nombre del producto
export default function FotoProducto({ p, ruta = null, className = '', eager = false, chica = false }) {
  const intentos = [fotoProducto(p, ruta), fotoEna(ruta || p.img), ruta ? fotoProducto(p) : null, ruta ? fotoEna(p.img) : null];
  const lista = [...new Set(intentos.filter(Boolean))];
  const [i, setI] = useState(0);

  if (i >= lista.length) return <span className={`ph ${chica ? '!p-1 !text-[10px]' : ''}`}>{p.n}</span>;

  return (
    <img
      src={lista[i]}
      alt={p.n}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable="false"
      className={className}
      onError={() => setI((n) => n + 1)}
    />
  );
}
