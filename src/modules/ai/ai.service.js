function getNextDayOfWeek(targetDay) {
  const today = new Date();
  const dias = ['domingo','lunes','martes','miercoles','miércoles','jueves','viernes','sabado','sábado'];

  const targetIndex = dias.indexOf(targetDay);
  const currentIndex = today.getDay();

  let diff = targetIndex - currentIndex;
  if (diff <= 0) diff += 7;

  const result = new Date();
  result.setDate(today.getDate() + diff);

  return result;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

async function analyzeEmail(subject, from, body) {
  let text = `${subject} ${from} ${body}`.toLowerCase();

  // 🧹 limpiar texto
  text = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');

  const keywords = ['reunión', 'reunion', 'junta', 'tarea', 'entrega', 'deadline'];
  const isTask = keywords.some(word => text.includes(word));

  // 🔥 PRIORIDAD DINÁMICA
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

  let fechaTexto = null;
  let fechaReal = null;

  const today = new Date();

  // 📅 HOY
  if (text.includes('hoy')) {
    fechaTexto = 'hoy';
    fechaReal = today;
  }

  // 📅 MAÑANA
  if (text.includes('mañana')) {
    const d = new Date();
    d.setDate(today.getDate() + 1);
    fechaTexto = 'mañana';
    fechaReal = d;
  }

  // 📅 PASADO MAÑANA
  if (text.includes('pasado mañana')) {
    const d = new Date();
    d.setDate(today.getDate() + 2);
    fechaTexto = 'pasado mañana';
    fechaReal = d;
  }

  // 📅 DÍAS DE LA SEMANA
  const dias = ['lunes','martes','miercoles','miércoles','jueves','viernes','sabado','sábado','domingo'];

  for (let dia of dias) {
    if (text.includes(dia)) {
      const d = getNextDayOfWeek(dia);
      fechaTexto = dia;
      fechaReal = d;
      break;
    }
  }

  // 📅 FECHA tipo "27 de marzo"
  const fechaMatch = text.match(/(\d{1,2}) de (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/);

  if (fechaMatch) {
    const dia = parseInt(fechaMatch[1]);
    const meses = {
      enero:0,febrero:1,marzo:2,abril:3,mayo:4,junio:5,
      julio:6,agosto:7,septiembre:8,octubre:9,noviembre:10,diciembre:11
    };

    const mes = meses[fechaMatch[2]];
    const year = today.getFullYear();

    fechaReal = new Date(year, mes, dia);
    fechaTexto = `${dia} de ${fechaMatch[2]}`;
  }
  // 📅 FECHA formato 27/03/2026 o 27-03-2026 o 27/03
const fechaNumerica = text.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{4}))?/);

if (fechaNumerica) {
  const dia = parseInt(fechaNumerica[1]);
  const mes = parseInt(fechaNumerica[2]) - 1; // JS meses empiezan en 0
  const year = fechaNumerica[3] ? parseInt(fechaNumerica[3]) : today.getFullYear();

  const fecha = new Date(year, mes, dia);

  fechaReal = fecha;
  fechaTexto = `${dia}/${mes + 1}/${year}`;
}

  // ⏰ Detectar hora
  const horaRegex = /(\d{1,2})[:.](\d{2})/;
  const match = text.match(horaRegex);

  let hora = null;
  if (match) {
    hora = `${match[1]}:${match[2]}`;
  }

  // 🔥 PRIORIDAD SEGÚN FECHA
  if (fechaTexto === 'hoy') prioridad = 'alta';
  if (fechaTexto === 'mañana' && prioridad === 'media') prioridad = 'alta';

  const result = {
    es_tarea: isTask,
    titulo: subject,
    fecha: fechaTexto,
    fecha_real: fechaReal ? formatDate(fechaReal) : null,
    hora: hora,
    prioridad: prioridad
  };

  // 🧪 DEBUG
  console.log('🔍 TEXTO ANALIZADO:', text);
  console.log('📅 FECHA TEXTO:', result.fecha);
  console.log('📆 FECHA REAL:', result.fecha_real);
  console.log('🕐 HORA:', result.hora);
  console.log('🔥 PRIORIDAD:', result.prioridad);

  return result;
}

module.exports = { analyzeEmail };