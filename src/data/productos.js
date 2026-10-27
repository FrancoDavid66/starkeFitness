// =====================================================================
//  SHOP — catálogo de suplementos (fuente: enasport.com, 26/10/2026)
//
//  n        nombre                     c   categoría      g  objetivos
//  ena      nombre del producto en la URL de ENA (enasport.com/products/<ena>)
//  img      foto principal (ruta del CDN de ENA)
//  d        descripción corta          pills  beneficios (las pastillas)
//  uso      modo de uso
//  sabores  [nombre, color del punto]
//  tamanos  [nombre, servicios, duración]      labelTam  si no es "Tamaño"
//  datos    servicios / duración cuando no hay tamaños para elegir
//  v        variantes: [sabor, tamaño, precio, foto]  (la primera es la que aparece elegida)
//  p        precio cuando el producto no tiene variantes
//
//  PRECIOS: la web NO los muestra (lo pidió el dueño; se cambia en starke.js -> shop.mostrarPrecios).
//  Los de ENA quedan cargados por si algún día se usan. Las otras marcas no tienen precio.
//  Si Starke no tiene un sabor o tamaño, borrá esa línea de `v`.
//
//  Las otras marcas están en src/data/proveedores/ (star.js, gold.js, granger.js), mismo formato.
// =====================================================================
import { productosStar } from './proveedores/star.js';
import { productosGold } from './proveedores/gold.js';
import { productosGranger } from './proveedores/granger.js';

export const CATEGORIAS = [
  ['todo', 'Todo'],
  ['proteinas', 'Proteínas'],
  ['creatinas', 'Creatinas'],
  ['pre', 'Pre-entreno y aminoácidos'],
  ['colageno', 'Colágeno'],
  ['energia', 'Energía e hidratación'],
  ['vitaminas', 'Vitaminas y salud'],
  ['quemadores', 'Quemadores'],
  ['alimentos', 'Alimentos y snacks proteicos'],
  ['shakers', 'Shakers'],
];

export const MARCAS = ['ENA', 'Star Nutrition', 'Gold Nutrition', 'Granger'];

export const OBJETIVOS = [
  ['musculo', 'Ganar músculo'],
  ['rendimiento', 'Rendimiento'],
  ['recupero', 'Recuperación'],
  ['definicion', 'Definición'],
  ['bienestar', 'Bienestar'],
];

// colores de sabor que usa ENA
const C = {
  vainilla: '#d9ca99', vainillaClara: '#F1DDA4', chocolate: '#7c4e39', chocoOscuro: '#5B3A24',
  frutilla: '#cf4d46', cookies: '#e5b883', banana: '#e3d5ae', sinSabor: '#fbfbfa',
  neutro: '#7EC8E3', fruitPunch: '#D6455D', naranja: '#F0A04B', lemonade: '#ece01d',
  blueberry: '#245a99', pinkLemonade: '#F28CB1', blueLemon: '#4FB3E8', berries: '#A32D5B', blackberry: '#4f1170',
};

const productosEna = [
  // ---------------------------------------------------------------- PROTEÍNAS
  {
    id: 'truemade-whey', ena: 'truemade-whey-protein', n: 'Truemade Whey Protein', c: 'proteinas', g: ['musculo', 'recupero'],
    img: 'files/TM_WP_2lbCh.webp?v=1789407168',
    d: 'Proteína en polvo que combina fórmula concentrada (WPC) y aislada (WPI) para máxima pureza y rápida absorción. Aporta 25 g de proteína y 5,81 g de BCAA por scoop.',
    pills: ['25 g de proteína', 'Rápida absorción', 'WPC + WPI', 'Sin gluten'],
    uso: 'Mezclar una medida en 200 ml de agua o leche descremada, agitar en un shaker y tomar. Se puede tomar antes o después del entrenamiento.',
    sabores: [['Double Rich Chocolate', C.chocolate], ['Vainilla Ice Cream', C.vainilla], ['Strawberry Milkshake', C.frutilla], ['Cookies and Cream', C.cookies], ['Banana Shake', C.banana], ['Sin sabor', C.sinSabor]],
    tamanos: [['1 lb (453 g)', '14 servicios'], ['2,05 lb (930 g)', '30 servicios'], ['5 lb (2,27 kg)', '73 servicios']],
    v: [
      ['Double Rich Chocolate', '1 lb (453 g)', 52700, 'files/TM_WP_1lbCh.webp?v=1789756579'],
      ['Double Rich Chocolate', '2,05 lb (930 g)', 108000, 'files/TM_WP_2lbCh.webp?v=1789407168'],
      ['Double Rich Chocolate', '5 lb (2,27 kg)', 261000, 'files/TM_WP_5lbCh.webp?v=1779811724'],
      ['Vainilla Ice Cream', '1 lb (453 g)', 52700, 'files/TM_WP_1lbVa.webp?v=1789756567'],
      ['Vainilla Ice Cream', '2,05 lb (930 g)', 108000, 'files/TMWP2lb-Va_2.webp?v=1789407154'],
      ['Vainilla Ice Cream', '5 lb (2,27 kg)', 261000, 'files/TMWP_5lbVa.webp?v=1779888000'],
      ['Strawberry Milkshake', '1 lb (453 g)', 52700, 'files/TM_WP_1lbFr.webp?v=1789756582'],
      ['Strawberry Milkshake', '2,05 lb (930 g)', 108000, 'files/TM_WP_2lbFr.webp?v=1789407186'],
      ['Cookies and Cream', '1 lb (453 g)', 52700, 'files/TMWP_1lbcc.webp?v=1789756551'],
      ['Cookies and Cream', '2,05 lb (930 g)', 108000, 'files/TM_WP_2lbCc.webp?v=1789407178'],
      ['Banana Shake', '1 lb (453 g)', 52700, 'files/TMWP_1lbBanana.webp?v=1789756543'],
      ['Banana Shake', '2,05 lb (930 g)', 108000, 'files/TM_WP_2lbBn.webp?v=1789407194'],
      ['Sin sabor', '1 lb (453 g)', 52700, 'files/TM_WP_1lbSs.webp?v=1789756575'],
    ],
  },
  {
    id: 'whey-100', ena: '100-whey-protein', n: '100% Whey Protein', c: 'proteinas', g: ['musculo', 'bienestar'],
    img: 'files/100_-Va.webp?v=1789557816',
    d: 'Proteína concentrada para el día a día, ideal para desayunos, meriendas o después de entrenar. Aporta 20 g de proteína y 4,5 g de BCAA por porción.',
    pills: ['20 g de proteína', '4,5 g de BCAA', 'Sin gluten'],
    uso: 'Mezclar una porción (scoop) en un shaker con 200 cm³ de agua o leche, preferentemente descremada. Agitar bien y tomar en desayunos, meriendas o en cualquier momento del día.',
    sabores: [['Vainilla', C.vainilla], ['Frutilla', C.frutilla], ['Chocolate', C.chocolate]],
    tamanos: [['1,2 lb (540 g)', '15 servicios'], ['2 lb (900 g)', '25 servicios']],
    v: [
      ['Vainilla', '2 lb (900 g)', 80100, 'files/100_-Va.webp?v=1789557816'],
      ['Vainilla', '1,2 lb (540 g)', 53100, 'files/100_-Va1_2Lb.webp?v=1782409705'],
      ['Frutilla', '1,2 lb (540 g)', 53100, 'files/100_-Fr-1Lb.webp?v=1779462346'],
      ['Frutilla', '2 lb (900 g)', 80100, 'files/100_W-FR.webp?v=1789557760'],
      ['Chocolate', '1,2 lb (540 g)', 53100, 'files/100_-Ch1_2Lb.png?v=1782409738'],
      ['Chocolate', '2 lb (900 g)', 80100, 'files/100_-Ch.webp?v=1789557816'],
    ],
  },
  {
    id: 'whey-x-pro', ena: 'whey-x-pro', n: 'Whey X Pro', c: 'proteinas', g: ['musculo', 'rendimiento'],
    img: 'files/Wxpro2lb-Ch.webp?v=1782488142',
    d: "Proteína 'todo en uno' con creatina, aminoácidos, vitaminas y minerales. Aporta 24 g de proteína y 5 g de creatina monohidrato por porción.",
    pills: ['24 g de proteína', '5 g de creatina', 'Sin gluten'],
    uso: 'Mezclar una porción (scoop) en 200 ml de agua o leche descremada, agitar en un shaker y tomar. Se puede tomar antes o después del entrenamiento.',
    sabores: [['Chocolate', C.chocolate], ['Vainilla', C.vainilla]],
    tamanos: [['1 lb (453 g)', '15 servicios'], ['2 lb (907 g)', '29 servicios']],
    v: [
      ['Chocolate', '2 lb (907 g)', 99000, 'files/Wxpro2lb-Ch.webp?v=1782488142'],
      ['Chocolate', '1 lb (453 g)', 53550, 'files/Wxpro1lb-Ch.webp?v=1782488096'],
      ['Vainilla', '1 lb (453 g)', 53550, 'files/Wxpro1lb-Va.webp?v=1782488103'],
      ['Vainilla', '2 lb (907 g)', 99000, 'files/Wxpro2lb-Va.webp?v=1782488128'],
    ],
  },
  {
    id: 'plant-protein', ena: 'plant-protein-%C2%AE', n: 'Plant Protein', c: 'proteinas', g: ['musculo', 'recupero'],
    img: 'files/Plant-Vai.webp?v=1779453362',
    d: 'Blend de proteína de arveja hidrolizada y proteína de arroz, 100% de origen vegetal. Aporta 24 g de proteína por porción, ideal para dietas veganas o vegetarianas.',
    pills: ['24 g de proteína', '100% vegetal', 'Sin gluten'],
    uso: 'Mezclar 5 scoops (31,5 g) en 200 a 300 ml de agua, agitar y tomar.',
    sabores: [['Vainilla', C.vainillaClara], ['Chocolate', C.chocolate]],
    datos: ['25 servicios'],
    v: [
      ['Vainilla', null, 54000, 'files/Plant-Vai.webp?v=1779453362'],
      ['Chocolate', null, 54000, 'files/Plant-Ch.webp?v=1779453350'],
    ],
  },
  {
    id: 'isoprot', ena: 'isoprot', n: 'Isoprot', c: 'proteinas', g: ['musculo', 'definicion'],
    img: 'files/Iso-Va.webp?v=1781703787',
    d: 'Proteína 100% aislada (isolate) de rápida absorción, con más proteína y menos carbohidratos, grasas y azúcares que una proteína común. Aporta 28 g de proteína y 6,6 g de BCAA por porción.',
    pills: ['28 g de proteína', '6,6 g de BCAA', 'Sin gluten'],
    uso: 'Mezclar un scoop colmado (32 g) en 200 cm³ de agua o leche y agitar 30 segundos. Para mejores resultados, consumir dentro de los 30 minutos posteriores al entrenamiento.',
    sabores: [['Vanilla Caramel', C.vainillaClara], ['Chocolate Mousse', C.chocoOscuro]],
    datos: ['2 lb (907 g)', '28 servicios'],
    v: [
      ['Vanilla Caramel', null, 126000, 'files/Iso-Va.webp?v=1781703787'],
      ['Chocolate Mousse', null, 126000, 'files/Iso-Ch.webp?v=1781703795'],
    ],
  },
  {
    id: 'diet-protein', ena: 'truemade-diet-protein', n: 'Truemade Diet Protein', c: 'proteinas', g: ['definicion', 'musculo'],
    img: 'files/TM_Diet_Vai.webp?v=1779891795',
    d: 'Blend de proteína de suero de leche y fibra, bajo en calorías y sin azúcares añadidos. Aporta 18 g de proteína y 5 g de fibra por porción.',
    pills: ['18 g de proteína', '5 g de fibra', 'Menos de 100 kcal'],
    uso: 'Mezclar 1 scoop al ras (29,8 g) en 200 ml de agua fría, agitar y tomar.',
    sabores: [['Vainilla', C.vainilla], ['Chocolate', C.chocolate]],
    datos: ['30 servicios'],
    v: [
      ['Vainilla', null, 94500, 'files/TM_Diet_Vai.webp?v=1779891795'],
      ['Chocolate', null, 94500, 'files/TM_Diet_Ch.webp?v=1779890583'],
    ],
  },
  {
    id: 'ultra-mass', ena: 'ultra-mass', n: 'Ultra Mass', c: 'proteinas', g: ['musculo'],
    img: 'files/Umass1lb-Ch.webp?v=1782488172',
    d: 'Ganador de peso que combina proteína de alto valor biológico con carbohidratos, vitaminas y minerales. Aporta 25 g de proteína y 70 g de carbohidratos por porción para sumar volumen y masa muscular.',
    pills: ['25 g de proteína', '70 g de carbohidratos', 'Sin gluten'],
    uso: 'Mezclar 3 medidas (100 g en total) en 300 ml de agua o leche y agitar en un shaker. Tomar a media mañana o a la tarde, alejado de las comidas principales.',
    sabores: [['Chocolate', C.chocolate], ['Vainilla', C.vainilla]],
    tamanos: [['1,5 kg', '15 servicios'], ['3 kg', '30 servicios']],
    v: [
      ['Chocolate', '1,5 kg', 62100, 'files/Umass1lb-Ch.webp?v=1782488172'],
      ['Chocolate', '3 kg', 110700, 'files/Umass3kg-Ch.webp?v=1779124829'],
      ['Vainilla', '1,5 kg', 62100, 'files/Umass1lb-Va.webp?v=1782488184'],
      ['Vainilla', '3 kg', 110700, 'files/Umass3kg-Va.webp?v=1779124829'],
    ],
  },
  {
    id: 'starter-protein', ena: 'starter-protein', n: 'Starter Protein', c: 'proteinas', g: ['musculo', 'bienestar'],
    img: 'files/StarterProtein.webp?v=1779889445', p: 44100,
    d: 'Proteína de suero de leche con extractos de café, té verde y guaraná, ideal para mejorar tus desayunos o meriendas. Aporta 10 g de proteína y 31 mg de cafeína por porción.',
    pills: ['10 g de proteína', '31 mg de cafeína', 'Café, té verde y guaraná'],
    uso: 'Disolver 1 porción (16 g) en 100 cm³ de tu bebida preferida; para extra energía, 2 porciones. Se puede tomar con leche o agua, fría o caliente.',
    datos: ['400 g', '25 servicios'],
  },
  {
    id: 'protein-bar', ena: 'protein-bar', n: 'Protein Bar', c: 'alimentos', g: ['musculo', 'rendimiento'],
    img: 'files/ENAPROTEINBARCajaCTChocolate.webp?v=1779811383',
    d: 'Barra de proteína que combina carbohidratos y proteínas (2:1) para energía sostenida y mejor recuperación post entrenamiento. Aporta 12 g de proteína por barra de 46 g.',
    pills: ['12 g de proteína', 'Carbohidratos y proteínas 2:1', 'Lista para comer'],
    uso: 'Consumir 1 barra antes o después de entrenar, o en cualquier momento del día.',
    sabores: [['Chocolate', C.chocolate], ['Banana Split', '#F3D35A'], ['Frutilla a la crema', '#E8607F'], ['Coco y dulce de leche', '#D8B48A']],
    datos: ['Caja de 16 barras'],
    v: [
      ['Chocolate', null, 33840, 'files/ENAPROTEINBARCajaCTChocolate.webp?v=1779811383'],
      ['Banana Split', null, 33840, 'files/ENAPROTEINBARCajaCTBanana.webp?v=1779892566'],
      ['Frutilla a la crema', null, 33840, 'files/ENAPROTEINBARCajaCTFrutilla.webp?v=1779814513'],
      ['Coco y dulce de leche', null, 33840, 'files/Pbar-Cddl.webp?v=1779117474'],
    ],
  },
  {
    id: 'whey-collagen', ena: 'truemade-whey-collagen', n: 'Truemade Whey Collagen', c: 'proteinas', g: ['musculo', 'recupero'],
    img: 'files/TMWC_Chwebp.webp?v=1779814600',
    d: "Blend 'todo en uno' con 10 g de proteína de suero y 10 g de colágeno hidrolizado en una sola porción, sin azúcar agregada. Protege las articulaciones y favorece la masa muscular.",
    pills: ['10 g de proteína', '10 g de colágeno', 'Cero azúcar'],
    uso: 'Disolver 1 scoop al ras (25 g) en 200 ml de agua, agitar y consumir en cualquier momento del día.',
    sabores: [['Chocolate', C.chocolate], ['Vainilla', C.vainilla]],
    datos: ['750 g', '30 servicios', '1 mes'],
    v: [
      ['Chocolate', null, 68000, null],
      ['Vainilla', null, 68000, null],
    ],
  },

  // ---------------------------------------------------------------- CREATINAS
  {
    id: 'creatina', ena: 'creatina-monohidrato', n: 'Creatina Monohidrato', c: 'creatinas', g: ['rendimiento', 'musculo'],
    img: 'files/CreaN300Mono_70b6fe3e-aaaa-443c-8b96-99609eaca224.webp?v=1779459679',
    d: 'Creatina monohidrato micronizada, el suplemento con mayor respaldo científico para mejorar la fuerza, la potencia y el rendimiento físico. Fórmula pura con 5 g de creatina por porción, fácil disolución.',
    pills: ['100% pura', '5 g por servicio', 'Sin gluten'],
    uso: '1 scoop de 5 g por día, todos los días. Disolvé en agua, jugo o tu batido y agitá. La dosis es la misma para todos los sabores.',
    sabores: [['Neutro', C.neutro], ['Fruit Punch', C.fruitPunch], ['Naranja', C.naranja]],
    labelTam: 'Formato',
    tamanos: [['150 g', '30 servicios', '1 mes'], ['300 g', '60 servicios', '2 meses'], ['1 kg', '200 servicios', '6 meses'], ['Monodosis', '15 servicios', '15 días']],
    v: [
      ['Neutro', '300 g', 30000, 'files/CreaN300Mono_70b6fe3e-aaaa-443c-8b96-99609eaca224.webp?v=1779459679'],
      ['Fruit Punch', '300 g', 30000, 'files/Crea300FpMono.webp?v=1779116810'],
      ['Naranja', '300 g', 30000, 'files/Crea300NrMono_2.webp?v=1779125435'],
      ['Neutro', '150 g', 18800, 'files/Crea150NMono_2.webp?v=1779888466'],
      ['Neutro', '1 kg', 86250, 'files/Crea-1Kg.webp?v=1779888288'],
      ['Neutro', 'Monodosis', 15300, 'files/CreaMonoPack.webp?v=1779125566'],
    ],
  },
  {
    id: 'creapure', ena: 'creatina-monohidrato-creapure', n: 'Creatina Creapure', c: 'creatinas', g: ['rendimiento', 'musculo'],
    img: 'files/CreaPure.webp?v=1779462758', p: 45900,
    d: 'Creatina monohidrato Creapure®, con pureza del 100% y tecnología alemana de fabricación. Aporta 5 g de creatina pura por porción para potenciar fuerza y rendimiento.',
    pills: ['Creapure®', '5 g por servicio', '100% pureza', 'Sin gluten'],
    uso: 'Disolver 5 g (1 cucharadita de té colmada) en 200 ml de agua o jugo. Se puede tomar antes de entrenar.',
    datos: ['200 g', '40 servicios'],
  },
  {
    id: 'crea-electro', ena: 'creatina-electrolitos', n: 'Creatina + Electrolitos', c: 'creatinas', g: ['rendimiento'],
    img: 'files/Crea_ElectPL.webp?v=1779463617',
    d: 'Creatina monohidrato micronizada con un blend de electrolitos, pensada para la fuerza y la potencia, y para acompañar la hidratación. Aporta 5 g de creatina y 335 mg de electrolitos por porción.',
    pills: ['5 g de creatina', '335 mg de electrolitos', 'Sin azúcar', 'Sin gluten'],
    uso: 'Diluir un scoop en 200 ml de agua.',
    sabores: [['Pink Lemonade', C.pinkLemonade], ['Blue Lemon', C.blueLemon]],
    datos: ['45 servicios'],
    v: [
      ['Pink Lemonade', null, 31200, 'files/Crea_ElectPL.webp?v=1779463617'],
      ['Blue Lemon', null, 31200, 'files/Crea_ElectBL.webp?v=1779462593'],
    ],
  },
  {
    id: 'crea-magnesio', ena: 'creatina-magnesio', n: 'Creatina + Magnesio', c: 'creatinas', g: ['rendimiento', 'recupero'],
    img: 'files/TERREA000000195.webp?v=1782912323', p: 28800,
    d: 'Creatina monohidrato micronizada combinada con magnesio (malato), que participa en la producción de energía muscular. Aporta 5 g de creatina y 200 mg de magnesio elemental por porción.',
    pills: ['5 g de creatina', '200 mg de magnesio', 'Sin gluten'],
    uso: 'Añadí 1 scoop (aprox. 7,5 g) en un vaso de agua a temperatura ambiente (200 ml) y revolvé hasta disolver. Consumilo en cualquier momento del día.',
    datos: ['30 servicios', '1 mes'],
  },

  // ---------------------------------------------------------------- PRE-ENTRENO Y AMINOÁCIDOS
  {
    id: 'pre-war', ena: 'pre-war', n: 'Pre War', c: 'pre', g: ['rendimiento'],
    img: 'files/Prewar_Fruit.webp?v=1779816271',
    d: 'Pre entrenamiento con 200 mg de cafeína, 3 g de creatina, 3 g de beta alanina, arginina, citrulina y electrolitos, para más energía, concentración y potencia, y retrasar la fatiga muscular.',
    pills: ['200 mg de cafeína', '3 g de creatina', '3 g de beta alanina'],
    uso: 'Mezclar una medida (20 g) con 200 cm³ de agua fría en un shaker. Agitar y consumir antes de entrenar.',
    sabores: [['Fruit Punch', C.fruitPunch], ['Lemonade', C.lemonade]],
    datos: ['400 g', '20 servicios'],
    v: [
      ['Fruit Punch', null, 35112, 'files/Prewar_Fruit.webp?v=1779816271'],
      ['Lemonade', null, 35112, 'files/Prewar_Lemonade.webp?v=1779889664'],
    ],
  },
  {
    id: 'oxido-nitrico', ena: 'oxido-nitrico', n: 'Óxido Nítrico', c: 'pre', g: ['rendimiento'],
    img: 'files/Oxido_Nitrico.webp?v=1779893111', p: 21600,
    d: 'Pre-workout vasodilatador con L-arginina, cetoglutarato y L-ornitina para mejorar el rendimiento físico y retrasar la fatiga muscular. Aporta 1,5 g de L-arginina por porción de 7 g.',
    pills: ['3 g de arginina (2 porciones)', 'Vasodilatador', 'Pre-workout'],
    uso: 'Tomar de 1 a 2 medidas en 200 cm³ de agua fría, 30 a 60 minutos antes del entrenamiento.',
    datos: ['210 g', '30 servicios'],
  },
  {
    id: 'beta-alanine', ena: 'beta-alanine', n: 'Beta Alanine', c: 'pre', g: ['rendimiento'],
    img: 'products/Beta_Alanine.jpg?v=1738842076', p: 13345,
    d: 'Aumenta la concentración de carnosina en los músculos para retrasar la fatiga y mejorar el rendimiento en ejercicios de alta intensidad. Aporta 3000 mg de beta alanina pura por porción.',
    pills: ['3000 mg de beta alanina', 'Retrasa la fatiga', 'Sin gluten'],
    uso: 'Tomar 4 tabletas, preferentemente 30 minutos antes del entrenamiento.',
    datos: ['60 tabletas', '15 servicios'],
  },
  {
    id: 'bcaa-211', ena: 'bcaa-2-1-1-90-caps', n: 'BCAA 2:1:1', c: 'pre', g: ['recupero'],
    img: 'files/Bcaa2.webp?v=1790086982', p: 17100,
    d: 'Aminoácidos ramificados (leucina, isoleucina y valina) para la recuperación muscular después de entrenar. Aporta 1800 mg de BCAA por porción.',
    pills: ['1800 mg de BCAA', '900 mg de L-leucina', 'Sin gluten'],
    uso: 'Tomar 3 cápsulas después de entrenar.',
    datos: ['90 cápsulas', '30 servicios'],
  },
  {
    id: 'amino-4500', ena: 'amino-4501', n: 'Amino 4500', c: 'pre', g: ['musculo', 'recupero'],
    img: 'products/Amino_4500_5ec7f1d2-d65e-479f-abb5-5cf4b1ce5bcf.jpg?v=1738841924', p: 28475,
    d: 'El blend más completo de aminoácidos (19 en total) con BCAA, para favorecer el crecimiento y la recuperación muscular. Aporta 11 g de proteína y 2,22 g de BCAA por porción.',
    pills: ['19 aminoácidos', '2,22 g de BCAA', '11 g de proteína'],
    datos: ['150 tabletas', '15 servicios'],
  },
  {
    id: 'glutamina', ena: 'glutamina-150-grs', n: 'Glutamina', c: 'pre', g: ['recupero'],
    img: 'files/Glutamina150.webp?v=1781181045',
    d: 'Glutamina micronizada 100% pura, el aminoácido más abundante en el músculo. Favorece la recuperación muscular y fortalece el sistema inmunológico. Aporta 5 g de L-glutamina por porción.',
    pills: ['5 g de L-glutamina', '100% pura', 'Sin gluten'],
    uso: 'Consumir 5 g (1 medida) después de entrenar, mezclada con 200 cm³ de agua o jugo.',
    tamanos: [['150 g', '30 servicios'], ['300 g doypack', '60 servicios']],
    v: [
      [null, '150 g', 20970, 'files/Glutamina150.webp?v=1781181045'],
      [null, '300 g doypack', 35550, 'files/Glutamina300grs.webp?v=1781181005'],
    ],
  },
  {
    id: 'reload', ena: 're-load', n: 'Re Load', c: 'pre', g: ['recupero'],
    img: 'files/Reload_Fruit.webp?v=1790087615',
    d: 'Post workout con 4 g de BCAA 2:1:1 (2 g de leucina) y electrolitos, para favorecer la recuperación muscular y reponer las sales perdidas durante el entrenamiento.',
    pills: ['4 g de BCAA', 'Con electrolitos', 'Sin gluten'],
    uso: 'Consumir 1 medida (2 scoops, 11 g) después de entrenar, mezclada con 350 a 400 cm³ de agua fría.',
    sabores: [['Fruit Punch', C.fruitPunch], ['Lemonade', C.lemonade]],
    datos: ['220 g', '20 servicios'],
    v: [
      ['Fruit Punch', null, 25520, 'files/Reload_Fruit.webp?v=1790087615'],
      ['Lemonade', null, 25520, 'products/Reload_Lemonade.jpg?v=1739376575'],
    ],
  },
  {
    id: 'amino-full', ena: 'truemade-amino-full', n: 'Truemade Amino Full', c: 'pre', g: ['rendimiento', 'recupero'],
    img: 'files/Truemade_Amino_Full_0c56c67e-45fd-4b6f-8bc6-c18db5ec5750.jpg?v=1685712300', p: 23400,
    d: 'BCAA en ratio 2:1:1, L-citrulina, L-glutamina y 100 mg de cafeína, para el desarrollo y la recuperación muscular. Aporta 5 g de aminoácidos y electrolitos por porción.',
    pills: ['5 g de aminoácidos', '100 mg de cafeína', 'Rendimiento y enfoque'],
    uso: 'Disolver 1 scoop colmado (7,3 g) en 300 ml de agua, agitar y consumir antes del entrenamiento.',
    datos: ['146 g', '20 servicios'],
  },

  // ---------------------------------------------------------------- COLÁGENO
  {
    id: 'colageno-sport', ena: 'colageno-sport', n: 'Colágeno Sport', c: 'colageno', g: ['recupero', 'bienestar'],
    img: 'files/CsportN.webp?v=1779818311',
    d: 'Colágeno hidrolizado en polvo con vitamina C, magnesio, cúrcuma y ácido hialurónico, pensado para acompañar las articulaciones y los músculos de quienes entrenan seguido. Aporta 10 g de colágeno por porción.',
    pills: ['10 g de colágeno', '500 mg de vitamina C', 'Sin gluten'],
    uso: 'Disolver un scoop bien colmado en un vaso de agua (200 ml) a temperatura ambiente. Consumir en cualquier momento del día.',
    sabores: [['Naranja', C.naranja], ['Fruit Punch', C.fruitPunch]],
    datos: ['30 servicios', '1 mes'],
    v: [
      ['Naranja', null, 34800, 'files/CsportN.webp?v=1779818311'],
      ['Fruit Punch', null, 34800, 'files/ColagenosSport-FP.jpg?v=1768327503'],
    ],
  },
  {
    id: 'pure-collagen', ena: 'truemade-pure-collagen', n: 'Truemade Pure Collagen', c: 'colageno', g: ['bienestar', 'recupero'],
    img: 'files/TMPC_Blueberry.webp?v=1779117039',
    d: 'Colágeno hidrolizado en polvo enriquecido con vitamina C, coenzima Q10, resveratrol y ácido hialurónico. Aporta 10 g de colágeno por porción para la elasticidad de la piel y el cuidado de las articulaciones.',
    pills: ['10 g de colágeno', '500 mg de vitamina C', 'Sin gluten', 'Sin azúcar'],
    uso: 'Disolver los scoops indicados en el envase en 200 ml de agua a temperatura ambiente y tomar en cualquier momento del día.',
    sabores: [['Blueberry', C.blueberry], ['Lemonade', C.lemonade], ['Neutro', C.neutro]],
    datos: ['30 servicios'],
    v: [
      ['Blueberry', null, 35445, 'files/TMPC_Blueberry.webp?v=1779117039'],
      ['Lemonade', null, 35445, 'files/TMPC_Lemonade.webp?v=1779117039'],
      ['Neutro', null, 35445, 'files/TMPC_Unflavored.webp?v=1779117039'],
    ],
  },

  // ---------------------------------------------------------------- ENERGÍA E HIDRATACIÓN
  {
    id: 'electrolitos', ena: 'electrolitos', n: 'Electrolitos', c: 'energia', g: ['rendimiento'],
    img: 'files/TERPRO00000042D.webp?v=1783375041',
    d: 'Electrolitos en polvo con 700 mg de sodio, potasio, cloruro y magnesio por porción, para reponer minerales durante y después del entrenamiento.',
    pills: ['700 mg de electrolitos', '78 mg de magnesio', 'Sin azúcar añadida', 'Sin gluten'],
    uso: 'Mezclar 3/4 de scoop o un sobre en 500 cm³ de agua, agitar y consumir durante o después del entrenamiento.',
    sabores: [['Berries Bomb', C.berries], ['Lemonade', C.lemonade]],
    labelTam: 'Formato',
    tamanos: [['Pote 225 g', '45 servicios'], ['15 sobres', '15 servicios']],
    v: [
      ['Berries Bomb', 'Pote 225 g', 34000, 'files/TERPRO00000042D.webp?v=1783375041'],
      ['Berries Bomb', '15 sobres', 16200, 'files/TER000000000224.webp?v=1783375041'],
      ['Lemonade', 'Pote 225 g', 34000, 'files/TERPRO00000042C.webp?v=1783375041'],
      ['Lemonade', '15 sobres', 16200, 'files/TER000000000223.webp?v=1783375041'],
    ],
  },
  {
    id: 'enargy-gel', ena: 'enargy-gel', n: 'Enargy Gel', c: 'energia', g: ['rendimiento'],
    img: 'files/TERPRO00000041A_12981255-b8ff-4bdd-9a3a-07a20913bd1a.webp?v=1783531377',
    d: 'Gel energético con 22 g de carbohidratos en ratio 2:1 (glucosa y fructosa), para energía rápida y sostenida durante el entrenamiento. Sin cafeína.',
    pills: ['22 g de carbohidratos', 'Sin cafeína', 'Sin gluten'],
    uso: 'Consumir 1 gel 5 minutos antes de empezar y luego uno cada 45 minutos durante el entrenamiento o la carrera, con agua.',
    sabores: [['Blackberry', C.blackberry], ['Fruit Punch', C.fruitPunch], ['Vainilla', C.vainilla]],
    tamanos: [['6 unidades', '6 servicios'], ['12 unidades', '12 servicios']],
    v: [
      ['Blackberry', '12 unidades', 23760, 'files/TERPRO00000041A_12981255-b8ff-4bdd-9a3a-07a20913bd1a.webp?v=1783531377'],
      ['Blackberry', '6 unidades', 13200, 'files/TERPRO00000041R_4d5f5311-885d-4bf2-a624-e3d8173fdbbe.webp?v=1783531377'],
      ['Fruit Punch', '6 unidades', 13200, 'files/TERPRO00000041Q_2_b3a47d34-f460-4356-abbd-7c1e7dc0e156.webp?v=1783531377'],
      ['Fruit Punch', '12 unidades', 23760, 'files/TERPRO00000041B_3054ff22-6250-4e81-a201-c4aafad24007.webp?v=1783531377'],
      ['Vainilla', '6 unidades', 13200, 'files/TERPRO00000041C_97248287-603b-4e94-b3b3-40811c8b2a2d.webp?v=1783531377'],
      ['Vainilla', '12 unidades', 23760, 'files/TERPRO00000041C_97248287-603b-4e94-b3b3-40811c8b2a2d.webp?v=1783531377'],
    ],
  },
  {
    id: 'carbo-energy', ena: 'carbo-energy', n: 'Carbo Energy', c: 'energia', g: ['rendimiento'],
    img: 'files/CarboE-Fp.webp?v=1786708686',
    d: 'Bebida deportiva con carbohidratos y electrolitos para rehidratar y reponer energía durante el entrenamiento. Aporta 24 g de carbohidratos y 216 mg de sodio por porción.',
    pills: ['24 g de carbohidratos', '216 mg de sodio', 'Rehidratación'],
    uso: 'Disolver un scoop (27 g) en 400 ml de agua y tomar durante o después del entrenamiento.',
    sabores: [['Fruit Punch', C.fruitPunch], ['Blueberry', C.blueberry]],
    datos: ['20 servicios'],
    v: [
      ['Fruit Punch', null, 16575, 'files/CarboE-Fp.webp?v=1786708686'],
      ['Blueberry', null, 16575, 'files/CarboE-B.webp?v=1786708686'],
    ],
  },
  {
    id: 'cafeina', ena: 'cafeina', n: 'Cafeína', c: 'energia', g: ['rendimiento'],
    img: 'files/Cafeina.webp?v=1781180949', p: 12750,
    d: 'Cafeína anhidra en cápsulas, de absorción rápida, para potenciar los entrenamientos intensos y mejorar el enfoque. Aporta 200 mg de cafeína por cápsula, sin azúcar ni calorías.',
    pills: ['200 mg de cafeína', 'Cero azúcar', 'Cero calorías', 'Sin gluten'],
    uso: 'Tomar 1 cápsula 30 minutos antes del ejercicio, con un vaso de agua. No consumir más de 1 cápsula por día.',
    datos: ['60 servicios'],
  },

  // ---------------------------------------------------------------- VITAMINAS Y MINERALES
  {
    id: 'multivitamin', ena: 'multivitaminico', n: 'Multivitamin', c: 'vitaminas', g: ['bienestar'],
    img: 'products/MultiVitamin.jpg?v=1738842964', p: 19125,
    d: 'Multivitamínico completo con 11 vitaminas y 4 minerales, más 100 mg de cafeína para la concentración y el rendimiento. Contribuye a la salud inmunológica y a combatir el cansancio.',
    pills: ['11 vitaminas + 4 minerales', '100 mg de cafeína', 'Sistema inmune'],
    uso: 'Tomar 1 comprimido a la mañana o antes de la actividad física, con abundante agua.',
    datos: ['60 servicios', '2 meses'],
  },
  {
    id: 'd3-k2', ena: 'vitamina-d3-k2', n: 'Vitamina D3 + K2', c: 'vitaminas', g: ['bienestar'],
    img: 'files/TER000000000213.webp?v=1782911890', p: 31200,
    d: 'Fórmula que favorece la absorción de calcio y acompaña la salud ósea, muscular e inmune. Aporta 100 mcg de vitamina D3 y 100 mcg de vitamina K2 por cápsula.',
    pills: ['100 mcg de vitamina D3', '100 mcg de vitamina K2 (MK-7)', 'Sin gluten'],
    uso: 'Tomar 1 cápsula al día, preferentemente con las comidas.',
    datos: ['60 servicios', '2 meses'],
  },
  {
    id: 'zma', ena: 'zma', n: 'ZMA', c: 'vitaminas', g: ['recupero'],
    img: 'files/ZMA.webp?v=1779462244', p: 13855,
    d: 'Zinc, magnesio y vitamina B6, pensado para tomar antes de dormir y favorecer la recuperación muscular nocturna. Aporta 320 mg de magnesio, 24 mg de zinc y 10,5 mg de vitamina B6 por porción.',
    pills: ['320 mg de magnesio', '24 mg de zinc', 'Sin gluten'],
    uso: 'Tomar 2 cápsulas antes de acostarse.',
    datos: ['60 cápsulas', '30 servicios'],
  },
  {
    id: 'citrato-mg', ena: 'citrato-de-magnesio', n: 'Citrato de Magnesio', c: 'vitaminas', g: ['recupero', 'bienestar'],
    img: 'files/Magnesio-CAPS.png?v=1788287922', p: 13760,
    d: 'Citrato de magnesio de alta absorción en cápsulas, que contribuye al funcionamiento normal del sistema nervioso y muscular. Con 433 mg de citrato (70 mg de magnesio elemental) por porción.',
    pills: ['433 mg de citrato', '60 cápsulas', 'Sin gluten'],
    uso: 'Tomar 2 cápsulas en cualquier momento del día, o 30 minutos antes o después de las comidas principales.',
    datos: ['30 servicios', '1 mes'],
  },
  {
    id: 'magnesio-duo', ena: 'magnesio-duo', n: 'Magnesio Duo', c: 'vitaminas', g: ['recupero', 'bienestar'],
    img: 'files/TER000000000215.webp?v=1786368341', p: 22100,
    d: 'Combina dos fuentes de magnesio, citrato y bisglicinato, en una sola cápsula para acompañar la recuperación neuromuscular. Aporta 250 mg de magnesio elemental por porción.',
    pills: ['250 mg de magnesio', 'Citrato + bisglicinato', 'Sin gluten'],
    uso: 'Tomar 2 cápsulas con la cena o antes de dormir.',
    datos: ['30 servicios', '1 mes'],
  },

  // ---------------------------------------------------------------- QUEMADORES
  {
    id: 'ripped-x', ena: 'ripped-x-60-caps', n: 'Ripped X', c: 'quemadores', g: ['definicion'],
    img: 'files/Rippedx.webp?v=1779463577', p: 12750,
    d: 'Con extracto de té verde (200 mg), pimiento (65 mg), pimienta negra (10 mg) y vitamina B3 por porción, formulado para acompañar un plan de descenso de peso junto con alimentación equilibrada y actividad física.',
    pills: ['200 mg de té verde', 'Con pimiento y pimienta negra', '30 servicios'],
    uso: 'Tomar 2 cápsulas por día con abundante agua, 30 minutos antes del almuerzo. No exceder las 4 cápsulas al día.',
    datos: ['60 cápsulas', '30 servicios'],
  },
  {
    id: 'carnitina', ena: 'carnitina-pro-burn', n: 'Carnitina 1500', c: 'quemadores', g: ['definicion'],
    img: 'files/Carnitina_3f5720eb-4cd6-41de-a67c-d9dbf64f591c.webp?v=1790085578', p: 16915,
    d: 'L-carnitina pura que favorece la conversión de ácidos grasos en energía durante entrenamientos aeróbicos de larga duración. Aporta 1500 mg de L-carnitina por porción.',
    pills: ['1500 mg de L-carnitina', 'Sin gluten'],
    datos: ['60 tabletas', '30 servicios'],
  },

  // ---------------------------------------------------------------- SHAKERS
  {
    id: 'shaker-premium', ena: 'shaker-premium-truemade', n: 'Shaker Premium Truemade', c: 'shakers', g: [],
    img: 'files/Shaker_PTM.webp?v=1779799794', p: 23760,
    d: 'Vaso mezclador premium de la línea Truemade, para preparar tus batidos sin grumos.',
  },
  {
    id: 'shaker-plus', ena: 'shaker-plus', n: 'Shaker Plus', c: 'shakers', g: [],
    img: 'products/Shaker_truemade_PLUS.jpg?v=1640024209', p: 6512,
    d: 'Vaso mezclador para llevar al gym.',
  },
];

// Todas las marcas juntas (el orden es el del shop)
const todos = [
  ...productosEna.map((p) => ({ m: 'ENA', ...p })),
  ...productosStar,
  ...productosGold,
  ...productosGranger,
];

// Orden del shop: por categoría (como en CATEGORIAS) y, adentro de cada una,
// intercalando las marcas (ENA, Star, Gold, Granger, ENA, Star…) para que se vean todas.
const ordenCat = Object.fromEntries(CATEGORIAS.map(([k], i) => [k, i]));
const turno = new Map();
const orden = new Map();
for (const p of todos) {
  const clave = `${p.c}|${p.m}`;
  turno.set(clave, (turno.get(clave) ?? -1) + 1);
  orden.set(p, [ordenCat[p.c] ?? 99, turno.get(clave), MARCAS.indexOf(p.m)]);
}
export const productos = [...todos].sort((a, b) => {
  const [x, y] = [orden.get(a), orden.get(b)];
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
});

// Los que aparecen en la portada (en este orden)
export const DESTACADOS = [
  'creatina',
  'gold-100-whey-protein-2lb',
  'star-platinum-whey-protein-chocolate-x-2-lbs',
  'pre-war',
  'gold-creatine-monohydrate-300g',
  'star-pump-v8-285-gr',
  'granger-pancakes-proteicos-sabor-vainilla',
  'colageno-sport',
];

// =====================================================================
//  helpers (no hace falta tocarlos)
// =====================================================================
export const porId = Object.fromEntries(productos.map((p) => [p.id, p]));
export const nombreCategoria = Object.fromEntries(CATEGORIAS);
export const nombreObjetivo = Object.fromEntries(OBJETIVOS);

const cacheVariantes = new Map();
export const variantes = (p) => {
  if (!cacheVariantes.has(p.id)) {
    cacheVariantes.set(
      p.id,
      p.v ? p.v.map(([s, t, precio, img]) => ({ s, t, precio: precio ?? null, img })) : [{ s: null, t: null, precio: p.p ?? null, img: null }]
    );
  }
  return cacheVariantes.get(p.id);
};
export const varianteDe = (p, s, t) => variantes(p).find((v) => v.s === s && v.t === t) || null;
export const variantePorDefecto = (p) => variantes(p)[0];
export const tienePrecio = (p) => variantes(p).some((v) => v.precio != null);
export const precioDesde = (p) => (tienePrecio(p) ? Math.min(...variantes(p).filter((v) => v.precio != null).map((v) => v.precio)) : null);
export const variosPrecios = (p) => new Set(variantes(p).map((v) => v.precio)).size > 1;
export const tieneOpciones = (p) => variantes(p).length > 1;
export const colorSabor = (p, s) => p.sabores?.find(([n]) => n === s)?.[1] || null;
// servicios y duración: los del tamaño elegido, o los del producto
export const datosDe = (p, t) => {
  const fila = p.tamanos?.find(([n]) => n === t);
  return fila ? fila.slice(1).filter(Boolean) : p.datos || [];
};
// todas las fotos que usa la web (para npm run fotos)
export const rutasDeFotos = (p) => [...new Set([p.img, ...variantes(p).map((v) => v.img)].filter(Boolean))];
