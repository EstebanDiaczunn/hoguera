// node prueba-worker.mjs — prueba el filtro y el worker con un KV de mentira
import assert from 'node:assert';
import w from './worker.js';
import { revisar } from './mensajes.js';

for (const ok of ['Probá saltar', 'Alabado sea el sol', 'Cuidado con el dragón putrefacto', 'Si tan solo tuviera un abrazo…'])
  assert.equal(revisar(ok), '', ok);
for (const [mal, motivo] of [['p', 'corto'], ['x'.repeat(101), 'largo'], ['entrá a www.algo.com', 'link'], ['llamame 11 4444 5555', 'link'],
  ['sos un pelotudo', 'insulto'], ['PUT0 el que lee', 'insulto'], ['jajajajaaaaaaaa', 'repetido']])
  assert.equal(revisar(mal), motivo, mal);

const kv = new Map();
const env = { MSG: { get: async (k, t) => (kv.has(k) ? (t === 'json' ? JSON.parse(kv.get(k)) : kv.get(k)) : null), put: async (k, v) => kv.set(k, v) } };
const pedir = (path, body, ip = '1.1.1.1') => w.fetch(new Request('https://x' + path, { method: body ? 'POST' : 'GET', headers: { 'cf-connecting-ip': ip, 'content-type': 'application/json' }, body: body && JSON.stringify(body) }), env);

assert.equal((await (await pedir('/mensajes')).json()).length, 8);
const r = await pedir('/mensajes', { txt: '  Vos  podés ', x: 1, z: 2 });
assert.equal(r.status, 201);
const m = await r.json();
assert.equal(m.txt, 'Vos podés');
assert.equal((await pedir('/mensajes', { txt: 'otro', x: 1, z: 2 })).status, 429);
assert.equal((await pedir('/mensajes', { txt: 'sos un forro', x: 1, z: 2 }, '2.2.2.2')).status, 422);
assert.equal((await pedir('/mensajes', { txt: 'hola', x: 900, z: 2 }, '3.3.3.3')).status, 400);
// tres personas lo marcan como malo: desaparece; la misma persona no vota dos veces
for (const ip of ['a', 'b', 'c']) await pedir(`/mensajes/${m.id}/malo`, {}, ip);
assert.equal((await (await pedir(`/mensajes/${m.id}/malo`, {}, 'a')).json()).m, 3);
assert.equal((await (await pedir('/mensajes')).json()).length, 8);
console.log('ok');
