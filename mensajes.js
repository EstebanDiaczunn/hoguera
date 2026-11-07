// Compartido por la página y el worker: un mensaje guarda solo índices, nunca texto libre.
export const PLANTILLAS = [
  'Adelante, ___',
  'Cuidado con ___',
  'Probá ___',
  'Si tan solo tuviera ___…',
  'Necesitás ___',
  'Te espera ___',
  'Alabado sea ___',
  '¿___?',
];

export const PALABRAS = [
  'una hoguera', 'un enemigo', 'un tesoro', 'un atajo', 'un abismo', 'una trampa',
  'una puerta', 'un amigo', 'valor', 'paciencia', 'esperanza', 'descanso',
  'saltar', 'rodar', 'volver', 'mirar arriba', 'seguir', 'no rendirte',
  'el sol', 'la llama', 'la oscuridad', 'la soledad', 'un abrazo', 'lágrimas',
];

// Los primeros caminantes, para que el santuario no arranque vacío.
export const SEMILLAS = [
  { id: 's1', t: 0, w: 0, x: 0.6, z: 14.2, v: 31 },
  { id: 's2', t: 2, w: 12, x: 9.3, z: 7.2, v: 58 },
  { id: 's3', t: 6, w: 18, x: -2.2, z: 4.5, v: 112 },
  { id: 's4', t: 3, w: 22, x: -11, z: -6, v: 47 },
  { id: 's5', t: 1, w: 20, x: 5, z: -13, v: 9 },
  { id: 's6', t: 4, w: 9, x: -6.2, z: 10.4, v: 14 },
  { id: 's7', t: 5, w: 3, x: 13.4, z: -2.2, v: 6 },
  { id: 's8', t: 7, w: 2, x: -13.2, z: 4.8, v: 21 },
];
