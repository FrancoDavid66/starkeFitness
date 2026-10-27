// =====================================================================
//  MARCAS del shop: logo, tamaño del logo y foto de cada tarjeta.
//  Los logos están en src/assets/marcas/ (sacados de las webs oficiales,
//  pasados a blanco para que peguen con el negro de Starke).
// =====================================================================
import logoEna from '../assets/marcas/ena-blanco.svg';
import logoStar from '../assets/marcas/star-blanco.png';
import logoGold from '../assets/marcas/gold-blanco.png';
import logoGoldColor from '../assets/marcas/gold-color.png';
import logoGranger from '../assets/marcas/granger-blanco.png';
import { productos } from './productos';

// esc  = tamaño del logo (los logos anchos van más bajitos para que todos pesen igual)
// foto = id del producto que aparece en la tarjeta y en el banner
const BASE = [
  { k: 'ENA', logo: logoEna, logoTarjeta: logoEna, esc: 1.25, foto: 'creatina' },
  { k: 'Star Nutrition', logo: logoStar, logoTarjeta: logoStar, esc: 1, foto: 'star-platinum-whey-protein-chocolate-x-2-lbs' },
  { k: 'Gold Nutrition', logo: logoGold, logoTarjeta: logoGoldColor, esc: 1.1, foto: 'gold-100-whey-protein-2lb' },
  { k: 'Granger', logo: logoGranger, logoTarjeta: logoGranger, esc: 0.62, foto: 'granger-pancakes-proteicos-sabor-vainilla' },
];

// nombre corto de cada categoría para la frase del banner
const CORTO = {
  proteinas: 'proteínas',
  creatinas: 'creatinas',
  pre: 'pre-entrenos',
  colageno: 'colágeno',
  energia: 'energía e hidratación',
  vitaminas: 'vitaminas',
  quemadores: 'quemadores',
  alimentos: 'snacks proteicos',
  shakers: 'shakers',
};

const lista = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs.at(-1)}` : xs[0] || '');

export const MARCAS_INFO = BASE.map((m) => {
  const suyos = productos.filter((p) => p.m === m.k);
  const porCat = {};
  suyos.forEach((p) => (porCat[p.c] = (porCat[p.c] || 0) + 1));
  const top = Object.entries(porCat)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([c]) => CORTO[c] || c);
  return { ...m, cantidad: suyos.length, rubros: lista(top) };
});

export const infoMarca = Object.fromEntries(MARCAS_INFO.map((m) => [m.k, m]));
