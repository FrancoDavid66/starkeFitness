// =====================================================================
//  STARKE FITNESS — todos los datos del gym se editan acá
// =====================================================================

export const negocio = {
  nombre: 'Starke Fitness',
  usuario: '@starke.fit',
  bajada: 'Centro de entrenamiento integral',
  zona: 'González Catán, La Matanza',
  direccion: '', // PENDIENTE: calle y número. Si queda vacío, se muestra solo la zona.
  // Número de la web vieja de Starke y de sus flyers. Confirmar con el dueño.
  whatsapp: '5491123709305',
  instagram: 'https://www.instagram.com/starke.fit/',
  // Ubicación del gym según Google Maps (figura como "STARKE FIT"). Confirmar el pin con el dueño.
  ubicacion: { lat: -34.7759548, lng: -58.6413077, placeId: 'ChIJ1_JsMQDFvJURzUcr3q9Liww', nombreMaps: 'STARKE FIT' },
  mapa: 'https://www.google.com/maps/search/?api=1&query=STARKE%20FIT&query_place_id=ChIJ1_JsMQDFvJURzUcr3q9Liww',
  comoLlegar: 'https://www.google.com/maps/dir/?api=1&destination=-34.7759548%2C-58.6413077&destination_place_id=ChIJ1_JsMQDFvJURzUcr3q9Liww',
  waze: 'https://waze.com/ul?ll=-34.7759548%2C-58.6413077&navigate=yes',
  dominio: 'https://TU-DOMINIO.com.ar',
  creditos: { nombre: 'Franco David', url: 'https://www.instagram.com/francodavid_66/' },
};

// Horarios: [abre, cierra] en horas (7.5 = 07:30). 0 = domingo. null = cerrado.
// EJEMPLO: lo único confirmado es que cierra a las 22:00.
export const horarios = {
  0: null,
  1: [7, 22],
  2: [7, 22],
  3: [7, 22],
  4: [7, 22],
  5: [7, 22],
  6: [9, 13],
};

export const mensajes = {
  claseGratis: 'Hola Starke! Quiero probar mi primera clase gratis.',
  hola: 'Hola Starke!',
  pedidoIntro: 'Hola Starke! Quiero hacer este pedido del shop:',
};

// Actividades: los wa.link son los del Linktree de Starke.
// Si una no tiene wa, se arma un WhatsApp al número de arriba con `msg`.
export const actividades = [
  { n: 'Funcional', d: 'Fuerza, movilidad y cardio en grupo. Para todos los niveles.', wa: 'https://wa.link/2rvrfh' },
  { n: 'Cross training', d: 'Circuitos de alta intensidad con barra, kettlebell y reloj.', wa: 'https://wa.link/pwxfsx' },
  { n: 'Boxeo', d: 'Técnica, bolsa y aerobox para descargar todo.', wa: 'https://wa.link/w5sczh' },
  { n: 'Funcional +55', d: 'Entrenamiento adaptado para adultos de más de 55 años.', wa: 'https://wa.link/1xr61v' },
  { n: 'Funcional kids', d: 'Movimiento, coordinación y juego para los más chicos.', wa: 'https://wa.link/6qpb1o' },
  { n: 'Personalizado', d: 'Un plan armado para vos, con el coach al lado en cada sesión.', wa: null, msg: 'Hola Starke! Quiero info del entrenamiento personalizado.' },
];

export const pasos = [
  { t: 'Escribinos', d: 'Mandanos un WhatsApp y contanos qué querés entrenar.' },
  { t: 'Elegí el horario', d: 'Te pasamos los turnos de la actividad y reservás tu lugar.' },
  { t: 'Vení a entrenar', d: 'Traé ropa cómoda, toalla y agua. Del resto se encarga el coach.' },
];

export const cintas = {
  blanca: ['Entrená mejor', 'Hacete más fuerte', 'Primera clase gratis', 'Starke Fitness'],
  roja: ['Funcional', 'Cross training', 'Boxeo', 'Personalizado', 'Funcional +55', 'Funcional kids'],
};

export const entregas = ['Retiro en el gym', 'Envío en Catán, a coordinar'];

// =====================================================================
//  MAPA DE STARKE — todo se cambia acá (no usa Google ni pide apps)
//  La ubicación del pin está arriba, en negocio.ubicacion.
// =====================================================================
export const mapa = {
  estilo: 'oscuro', // con cuál arranca: 'oscuro' | 'claro' | 'calles'
  elegirEstilo: true, // botones para que la gente cambie el estilo del mapa
  zoom: 15, // 13 = barrio · 15 = cuadras · 17 = calle
  color: '#e3131b', // color del pin, del círculo y de la ruta
  cartel: 'STARKE', // texto del cartelito arriba del pin
  radio: 430, // metros del círculo alrededor del gym (0 = sin círculo)
  indicacion: '', // dato extra en la tarjeta, ej: 'Portón negro, al lado de la farmacia'
  ruta: {
    activa: true, // "Cómo llegar" dibuja el camino adentro del mapa
    modos: ['auto', 'pie', 'bici'], // los que se pueden elegir (sacá los que no quieras)
    modoInicial: 'auto',
    indicaciones: true, // lista de "doblá a la derecha en…"
  },
  botones: {
    distancia: true, // "¿A cuánto estoy?" (solo se muestra si la ruta está apagada)
    waze: false, // abre Waze (si el celu lo tiene)
    googleMaps: false, // abre Google Maps (si el celu lo tiene)
  },
  // Puntos extra en el mapa (paradas, estacionamiento, plaza…). Ejemplo:
  // { nombre: 'Parada del colectivo', lat: -34.7765, lng: -58.6405, icono: '🚌' },
  referencias: [],
};
