// =====================================================================
//  FORMULARIO DE INGRESO (/ingreso) — todo el texto se edita acá.
//  Al terminar, se abre WhatsApp con la ficha completa dirigida al dueño.
// =====================================================================

export const ingreso = {
  // Número que recibe las fichas. null = el WhatsApp del gym (negocio.whatsapp en starke.js)
  whatsapp: null,

  lema: 'Tu entrenamiento, nuestro compromiso.',
  bienvenida: '¡Bienvenido/a a STARKE! ❤️🖤',
  intro:
    'Queremos conocerte, saber cuáles son tus objetivos y contar con la información necesaria para ofrecerte un entrenamiento organizado y adaptado a tus necesidades.',

  // ---------------- ETAPA 1 ----------------
  planes: [
    { id: '3', n: 'Plan 3 días por semana', precio: 44000 },
    { id: '45', n: 'Plan 4 o 5 días por semana', precio: 48000 },
  ],
  notaPlan: 'Los entrenamientos se realizan mediante turnos organizados y cupos limitados.',

  // ---------------- ETAPA 2 ----------------
  objetivos: [
    'Ganar masa muscular',
    'Perder grasa corporal',
    'Mejorar mi rendimiento físico',
    'Entrenar por salud y bienestar general',
    'Mejorar mi condición física general',
  ],

  // ---------------- ETAPA 3 ----------------
  // corto = cómo aparece en el WhatsApp · alerta = respuestas que piden el detalle (pregunta 7)
  salud: [
    { id: 'lesion', p: '¿Tenés alguna lesión actualmente o antecedentes de lesiones que debamos conocer?', corto: 'Lesiones', op: ['Sí', 'No'], alerta: ['Sí'] },
    { id: 'dolor', p: '¿Tenés dolores o molestias físicas actualmente?', corto: 'Dolores o molestias', op: ['Sí', 'No'], alerta: ['Sí'] },
    { id: 'presion', p: '¿Tenés presión arterial alta o baja?', corto: 'Presión arterial', op: ['Alta', 'Baja', 'Ambas / variable', 'No', 'No lo sé'], alerta: ['Alta', 'Baja', 'Ambas / variable'] },
    { id: 'condicion', p: '¿Tenés alguna condición de salud o indicación médica que debamos tener en cuenta al entrenar?', corto: 'Condición o indicación médica', op: ['Sí', 'No'], alerta: ['Sí'] },
    { id: 'restriccion', p: '¿Tenés alguna restricción o contraindicación médica para realizar actividad física?', corto: 'Restricción médica', op: ['Sí', 'No', 'No lo sé'], alerta: ['Sí'] },
    { id: 'autorizacion', p: '¿Contás con autorización médica cuando tu situación de salud la requiere?', corto: 'Autorización médica', op: ['Sí', 'No', 'Tengo pendiente realizar una consulta médica'], alerta: [] },
  ],
  preguntaDetalle: 'Contanos brevemente tu situación.',
  notaSalud:
    'Esta información es confidencial y nos permite conocer tus antecedentes para adaptar y supervisar el entrenamiento cuando sea necesario. No reemplaza una evaluación ni una autorización médica cuando corresponda.',

  // ---------------- ETAPA 4 ----------------
  reglamento: [
    { t: 'Puntualidad', d: 'Es importante llegar en horario para aprovechar al máximo cada entrenamiento y respetar la organización de los turnos.' },
    { t: 'Asistencia y conservación del cupo', d: 'En caso de acumular 4 clases consecutivas de inasistencia sin previo aviso ni justificación, STARKE se reserva el derecho de liberar el cupo y asignarlo a otra persona.' },
    { t: 'Compromiso y responsabilidad', d: 'Solicitamos compromiso con la asistencia, la continuidad y las indicaciones de los profesores. La constancia es fundamental para alcanzar los objetivos propuestos.' },
    { t: 'Respeto y convivencia', d: 'Pedimos mantener un trato respetuoso hacia los profesores, compañeros y las instalaciones del gimnasio.' },
    { t: 'Cuidado del equipamiento', d: 'Es responsabilidad de todos utilizar correctamente los elementos y devolverlos a su lugar después de cada entrenamiento.' },
  ],

  // ---------------- FINAL ----------------
  // Video de bienvenida del responsable de Starke: poné el archivo en public/video/ y escribí la ruta,
  // ej: '/video/bienvenida.mp4'. Vacío = se muestra la animación de bienvenida sin video.
  video: '',
  cierre: [
    '¡Gracias por elegirnos!',
    'Estamos preparados para acompañarte en este nuevo desafío.',
    'Nuestro equipo va a trabajar con vos para ayudarte a alcanzar tus objetivos, mejorar tu condición física y disfrutar del proceso.',
    '¡Nos vemos en el entrenamiento!',
  ],
  remate: 'Un nuevo comienzo. Una nueva versión de vos.',
};
