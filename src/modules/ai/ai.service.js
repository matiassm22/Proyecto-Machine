async function analyzeEmail(subject, from, body) {
  let text = `${subject} ${from} ${body}`.toLowerCase();

  //  limpiar texto
  text = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');

  const keywords = ['reunión', 'reunion', 'junta', 'tarea', 'entrega', 'deadline'];

  const isTask = keywords.some(word => text.includes(word));

  //  PRIORIDAD DINÁMICA
  let prioridad = 'media';

  if (
    text.includes('urgente') ||
    text.includes('ahora') ||
    text.includes('asap') ||
    text.includes('hoy')
  ) {
    prioridad = 'alta';
  } else if (
    text.includes('cuando puedas') ||
    text.includes('sin apuro') ||
    text.includes('no es urgente')
  ) {
    prioridad = 'baja';
  }

  let result = {
    es_tarea: isTask,
    titulo: subject,
    fecha: null,
    hora: null,
    prioridad: prioridad
  };

  //  Detectar días
  const dias = ['lunes', 'martes', 'miercoles', 'miércoles', 'jueves', 'viernes', 'sabado', 'sábado', 'domingo'];

  for (let dia of dias) {
    if (text.includes(dia)) {
      result.fecha = dia;
      break;
    }
  }

  //  Detectar "mañana"
  if (text.includes('mañana')) {
    result.fecha = 'mañana';
  }

  //  Detectar hora
  const horaRegex = /(\d{1,2})[:.](\d{2})/;
  const match = text.match(horaRegex);

  if (match) {
    result.hora = `${match[1]}:${match[2]}`;
  }

  //  PRIORIDAD INTELIGENTE SEGÚN FECHA
  if (result.fecha === 'mañana' && prioridad === 'media') {
    result.prioridad = 'alta';
  }

  //  DEBUG
  console.log('🔍 TEXTO ANALIZADO:', text);
  console.log('📅 FECHA:', result.fecha);
  console.log('🕐 HORA DETECTADA:', result.hora);
  console.log('🔥 PRIORIDAD:', result.prioridad);

  return result;
}

module.exports = { analyzeEmail };