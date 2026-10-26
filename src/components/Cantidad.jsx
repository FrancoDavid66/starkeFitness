// Selector de cantidad (− 1 +)
export default function Cantidad({ valor, onCambiar, chico = false }) {
  const b = chico ? 'h-8 w-8 text-lg' : 'h-12 w-[42px] text-[22px]';
  return (
    <div className="inline-flex flex-none items-center border-2 border-[#3a3a3a]">
      <button type="button" className={`${b} font-bold hover:bg-[#2a2a2a]`} onClick={() => onCambiar(-1)} aria-label="Menos">
        −
      </button>
      <output className={`text-center font-cond font-extrabold ${chico ? 'min-w-[26px] text-lg' : 'min-w-[34px] text-[22px]'}`}>{valor}</output>
      <button type="button" className={`${b} font-bold hover:bg-[#2a2a2a]`} onClick={() => onCambiar(1)} aria-label="Más">
        +
      </button>
    </div>
  );
}
