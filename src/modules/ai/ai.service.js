async function analyzeEmail(subject, from) {
  const text = `${subject} ${from}`.toLowerCase();

  const keywords = ['reunión', 'junta', 'tarea', 'entrega', 'deadline'];

  const isTask = keywords.some(word => text.includes(word));

  //  DETECCIÓN DE PRIORIDAD
  let prioridad = 'media';

  if (
    text.includes('urgente') ||
    text.includes('hoy') ||
    text.includes('ahora') ||
    text.includes('asap')
  ) {
    prioridad = 'alta';
  } else if (
    text.includes('mañana') ||
    text.includes('pronto') ||
    text.includes('esta semana')
  ) {
    prioridad = 'media';
  } else if (
    text.includes('cuando puedas') ||
    text.includes('sin apuro') ||
    text.includes('luego')
  ) {
    prioridad = 'baja';
  }

  //  DETECCIÓN DE FECHA SIMPLE
  let fecha = null;

  if (text.includes('lunes')) fecha = 'lunes';
  else if (text.includes('martes')) fecha = 'martes';
  else if (text.includes('miércoles') || text.includes('miercoles')) fecha = 'miércoles';
  else if (text.includes('jueves')) fecha = 'jueves';
  else if (text.includes('viernes')) fecha = 'viernes';
  else if (text.includes('sábado') || text.includes('sabado')) fecha = 'sábado';
  else if (text.includes('domingo')) fecha = 'domingo';

  return {
    es_tarea: isTask,
    titulo: subject,
    fecha,
    prioridad
  };
}

module.exports = { analyzeEmail };