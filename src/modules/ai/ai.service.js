async function analyzeEmail(subject, from, body) {
  let text = `${subject} ${from} ${body}`.toLowerCase();

  // limpiar texto
  text = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');

  const keywords = ['reunión', 'reunion', 'junta', 'tarea', 'entrega', 'deadline'];

  const isTask = keywords.some(word => text.includes(word));

  let result = {
    es_tarea: isTask,
    titulo: subject,
    fecha: null,
    hora: null,
    prioridad: 'media'
  };

  // Detectar días
  const dias = ['lunes', 'martes', 'miercoles', 'miércoles', 'jueves', 'viernes', 'sabado', 'sábado', 'domingo'];

  for (let dia of dias) {
    if (text.includes(dia)) {
      result.fecha = dia;
      break;
    }
  }

  // Detectar "mañana"
  if (text.includes('mañana')) {
    result.fecha = 'mañana';
  }

  // Detectar hora 
  const horaRegex = /(\d{1,2})[:.](\d{2})/;
  const match = text.match(horaRegex);

  if (match) {
    result.hora = `${match[1]}:${match[2]}`;
  }

  // DEBUG 
  console.log('🔍 TEXTO ANALIZADO:', text);
  console.log('🕐 HORA DETECTADA:', result.hora);

  return result;
}

module.exports = { analyzeEmail };