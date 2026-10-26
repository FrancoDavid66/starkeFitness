// Reloj de siete segmentos, como el timer de pared de cross training.

const H = (y) => `13,${y - 6} 47,${y - 6} 53,${y} 47,${y + 6} 13,${y + 6} 7,${y}`;
const V = (x, a, b) => `${x},${a} ${x + 6},${a + 6} ${x + 6},${b - 6} ${x},${b} ${x - 6},${b - 6} ${x - 6},${a + 6}`;

const SEGMENTOS = {
  a: H(7),
  b: V(53, 9, 48),
  c: V(53, 52, 91),
  d: H(93),
  e: V(7, 52, 91),
  f: V(7, 9, 48),
  g: H(50),
};

const MAPA = {
  0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg',
  5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg',
  '-': 'g', ' ': '',
};

export function Digito({ c = ' ', className = '', escalonado = false }) {
  const on = MAPA[c] ?? '';
  return (
    <svg viewBox="0 0 60 100" className={`dg ${className}`} aria-hidden="true">
      {Object.entries(SEGMENTOS).map(([k, puntos], i) => (
        <polygon
          key={k}
          points={puntos}
          className={on.includes(k) ? 'on' : ''}
          style={escalonado ? { transitionDelay: `${i * 70}ms`, transitionDuration: '.15s' } : undefined}
        />
      ))}
    </svg>
  );
}

const Dos = () => (
  <span className="grid gap-[clamp(10px,1.6vw,20px)] px-0.5" aria-hidden="true">
    <i className="led-dos" />
    <i className="led-dos" />
  </span>
);

// valor = 'HH:MM:SS'
export function Reloj({ valor, className = '' }) {
  const d = valor.replace(/:/g, '').split('');
  const num = (c) => <Digito c={c} className="aspect-[3/5] w-auto min-w-0 max-w-[74px] flex-1" />;
  return (
    <div className={`flex items-center gap-[clamp(4px,.7vw,9px)] ${className}`} role="timer" aria-label={valor}>
      {num(d[0])}{num(d[1])}
      <Dos />
      {num(d[2])}{num(d[3])}
      <Dos />
      {num(d[4])}{num(d[5])}
    </div>
  );
}
