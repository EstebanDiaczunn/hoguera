// Compartido por la página y el worker: el mismo filtro corre antes de mandar y al guardar.
export const LARGO = 100;

// raíces que bloquean cualquier palabra que empiece así; exactas solo la palabra entera
const RAICES = ['put', 'pelotud', 'forr', 'conchud', 'pijud', 'sorete', 'mogolic', 'retrasad', 'violad', 'nazi', 'hitler',
  'nigg', 'fagg', 'cunt', 'whore', 'slut', 'bitch', 'fuck', 'motherf', 'rape', 'porn'];
const PERMITIDAS = ['putre', 'putrefact']; // "putrefacto" es puro Dark Souls
const EXACTAS = new Set(['trolo', 'trola', 'pija', 'verga', 'chota', 'orto', 'culo', 'tetas', 'pete', 'petera', 'sexo',
  'dick', 'cock', 'pussy', 'fag', 'kys', 'cp']);

const normal = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e').replace(/4|@/g, 'a').replace(/5|\$/g, 's');

export const limpiar = (t) => String(t ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();

// Devuelve '' si el mensaje puede quedar en el piso, o el motivo por el que no.
export function revisar(texto) {
  const t = limpiar(texto);
  if (t.length < 2) return 'corto';
  if (t.length > LARGO) return 'largo';
  if (/https?:|www\.|\.(com|net|org|ar|io|xyz|ly|gg|me|tv)\b|@\w|\d[\d\s.-]{6,}\d/i.test(t)) return 'link';
  if (/(.)\1{5,}/.test(t)) return 'repetido';
  for (const p of normal(t).split(/[^a-zñ]+/)) {
    if (EXACTAS.has(p)) return 'insulto';
    if (RAICES.some((r) => p.startsWith(r)) && !PERMITIDAS.some((r) => p.startsWith(r))) return 'insulto';
  }
  return '';
}

// Un mensaje se oculta cuando lo marcan como malo más veces que como bueno (y al menos 3).
export const oculto = (m) => (m.m || 0) >= 3 && (m.m || 0) > (m.v || 0);

// Los primeros caminantes, para que el santuario no arranque vacío.
export const SEMILLAS = [
  { id: 's1', txt: 'Adelante, una hoguera', x: 0.6, z: 14.2 },
  { id: 's2', txt: 'Probá saltar', x: 9.3, z: 7.2 },
  { id: 's3', txt: 'Alabado sea el sol', x: -2.2, z: 4.5 },
  { id: 's4', txt: 'Si tan solo tuviera un abrazo…', x: -11, z: -6 },
  { id: 's5', txt: 'Cuidado con la oscuridad', x: 5, z: -13 },
  { id: 's6', txt: 'Me morí cuatrocientas veces con el mismo jefe. Vos podés.', x: -6.2, z: 10.4 },
  { id: 's7', txt: 'Volví después de diez años. Sigue igual.', x: 13.4, z: -2.2 },
  { id: 's8', txt: '¿Alguien más llegó acá sin saber por qué?', x: -13.2, z: 4.8 },
].map((m) => ({ ...m, v: 0, m: 0 }));
