function getNextDayOfWeek(targetDay) {
  const today = new Date();
  const dias = ['domingo','lunes','martes','miercoles','miércoles','jueves','viernes','sabado','sábado'];

  const targetIndex = dias.indexOf(targetDay);
  const currentIndex = today.getDay();

  let diff = targetIndex - currentIndex;
  if (diff < 0) diff += 7; // 👈 FIX (antes <=0 causaba errores)

  const result = new Date();
  result.setDate(today.getDate() + diff);

  return result;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

async function analyzeEmail(subject, from, body) {
  let text = `${subject} ${from} ${body}`.toLowerCase();
  text = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');

  const keywords = ['reunión', 'reunion', 'junta', 'tarea', 'entrega', 'deadline', 'informe'];
  const isTask = keywords.some(word => text.includes(word));

  const today = new Date();

  let fechaTexto = null;
  let fechaReal = null;
  let hora = null;
  let ubicacion = null;
  let fechaDetectada = false;

  // =========================
  //  FECHAS
  // =========================

  const fechaNumerica = text.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{4}))?/);
  if (fechaNumerica) {
    const dia = parseInt(fechaNumerica[1]);
    const mes = parseInt(fechaNumerica[2]) - 1;
    const year = fechaNumerica[3] ? parseInt(fechaNumerica[3]) : today.getFullYear();

    fechaReal = new Date(year, mes, dia);
    fechaTexto = `${dia}/${mes + 1}/${year}`;
    fechaDetectada = true;
  }

  const fechaMatch = text.match(/(\d{1,2}) de (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/);
  if (fechaMatch) {
    const dia = parseInt(fechaMatch[1]);
    const meses = {
      enero:0,febrero:1,marzo:2,abril:3,mayo:4,junio:5,
      julio:6,agosto:7,septiembre:8,octubre:9,noviembre:10,diciembre:11
    };

    const mes = meses[fechaMatch[2]];
    fechaReal = new Date(today.getFullYear(), mes, dia);
    fechaTexto = `${dia} de ${fechaMatch[2]}`;
    fechaDetectada = true;
  }

  const diaConNumero = text.match(/(lunes|martes|miercoles|miércoles|jueves|viernes|sabado|sábado|domingo)\s*(\d{1,2})/);
  if (diaConNumero) {
    const dia = parseInt(diaConNumero[2]);
    fechaReal = new Date(today.getFullYear(), today.getMonth(), dia);
    fechaTexto = `${dia}/${today.getMonth() + 1}/${today.getFullYear()}`;
    fechaDetectada = true;
  }

  if (!fechaDetectada) {
    if (text.includes('hoy')) {
      fechaTexto = 'hoy';
      fechaReal = today;
    } else if (text.includes('mañana')) {
      const d = new Date();
      d.setDate(today.getDate() + 1);
      fechaTexto = 'mañana';
      fechaReal = d;
    }
  }

  if (!fechaDetectada) {
    const dias = ['lunes','martes','miercoles','miércoles','jueves','viernes','sabado','sábado','domingo'];

    for (let dia of dias) {
      if (text.includes(dia)) {
        const d = getNextDayOfWeek(dia);
        fechaTexto = dia;
        fechaReal = d;
        break;
      }
    }
  }

  // =========================
  //  HORA
  // =========================

  const horaMatch = text.match(/(\d{1,2})[:.](\d{2})/);
  if (horaMatch) {
    hora = `${horaMatch[1]}:${horaMatch[2]}`;
  }

  // =========================
  //  UBICACIÓN 
  // =========================

  const ubicacionMatch = text.match(/en ([a-z0-9áéíóúñ\s]+)/);

  if (ubicacionMatch) {
    ubicacion = ubicacionMatch[1].trim();

    // cortar basura después
    ubicacion = ubicacion.split(' a las')[0];
    ubicacion = ubicacion.split(' con ')[0];
    ubicacion = ubicacion.split(' el ')[0];
    ubicacion = ubicacion.split(' para ')[0];
  }

  // =========================
  //  PRIORIDAD INTELIGENTE
  // =========================

  let prioridad = 'media';

  if (
    text.includes('urgente') ||
    text.includes('asap') ||
    text.includes('inmediato') ||
    text.includes('ahora')
  ) {
    prioridad = 'alta';
  }

  if (text.includes('informe') || text.includes('entrega')) {
    prioridad = 'media-alta';
  }

  if (fechaReal) {
    let fechaCompleta = new Date(fechaReal);

    if (hora) {
      const [h, m] = hora.split(':').map(Number);
      fechaCompleta.setHours(h, m, 0);
    }

    const diff = fechaCompleta - new Date();
    const minutos = diff / (1000 * 60);

    if (minutos <= 60) prioridad = 'alta';
    else if (minutos <= 180) prioridad = 'media-alta';
    else if (minutos <= 1440) prioridad = 'media';
    else prioridad = 'baja';
  }

  if (!fechaReal) prioridad = 'baja';

  // =========================
  // TÍTULO INTELIGENTE
  // =========================

  let titulo = subject;

  if (!subject || subject.length < 5 || subject === 'tarea') {
    titulo = body.slice(0, 60);
  }

  // =========================
  //  RESULTADO FINAL
  // =========================

  const result = {
    es_tarea: isTask,
    titulo,
    fecha: fechaTexto,
    fecha_real: fechaReal ? formatDate(fechaReal) : null,
    hora,
    prioridad,
    ubicacion
  };

  console.log('📅 FINAL:', result);

  return result;
}

// =========================
//  IA SUBTAREAS
// =========================

async function generateSubtasksAI(text) {
  console.log('🤖 IA generando subtareas para:', text);

  if (text.includes('informe')) {
    return [
      'investigar tema',
      'hacer estructura',
      'crear gráficos',
      'redactar informe',
      'revisar y corregir'
    ];
  }

  return [
    'analizar tarea',
    'dividir en partes',
    'ejecutar',
    'revisar resultado'
  ];
}

module.exports = { 
  analyzeEmail,
  generateSubtasksAI 
};