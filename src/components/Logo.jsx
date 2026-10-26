// Logo redondo de Starke (versión dibujada del logo del Instagram).
// Cuando el cliente pase el logo en vector, reemplazar este SVG.
export default function Logo({ className = '', titulo = 'Starke Fitness' }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={titulo}>
      <circle cx="60" cy="60" r="58" fill="#000" stroke="#2c2c2c" strokeWidth="2" />
      <g fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif" textAnchor="middle">
        <text x="60" y="55" fontSize="43" fontWeight="800" fill="#fff" letterSpacing="1.5">STA</text>
        <text x="60" y="88" fontSize="43" fontWeight="800" fill="#fff" letterSpacing="1.5">RKE</text>
        <text x="60" y="101" fontSize="9.5" fontWeight="700" fill="#e3131b" letterSpacing="3.2">FITNESS</text>
      </g>
    </svg>
  );
}
