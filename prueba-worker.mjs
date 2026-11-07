// node prueba-worker.mjs — prueba el worker con un KV de mentira
import assert from 'node:assert';
import w from './worker.js';
const kv = new Map();
const env = { MSG: { get: async (k, t) => (kv.has(k) ? (t === 'json' ? JSON.parse(kv.get(k)) : kv.get(k)) : null), put: async (k, v) => kv.set(k, v) } };
const pedir = (path, body, ip = '1.1.1.1') => w.fetch(new Request('https://x' + path, { method: body ? 'POST' : 'GET', headers: { 'cf-connecting-ip': ip, 'content-type': 'application/json' }, body: body && JSON.stringify(body) }), env);

assert.equal((await (await pedir('/mensajes')).json()).length, 8);
const r = await pedir('/mensajes', { t: 2, w: 12, x: 1, z: 2 });
assert.equal(r.status, 201);
const m = await r.json();
assert.equal((await pedir('/mensajes', { t: 2, w: 12, x: 1, z: 2 })).status, 429);
assert.equal((await pedir('/mensajes', { t: 99, w: 0, x: 1, z: 2 }, '2.2.2.2')).status, 400);
assert.equal((await pedir('/mensajes', { t: '<b>', w: 0, x: 1, z: 2 }, '3.3.3.3')).status, 400);
assert.equal((await pedir('/mensajes', { t: 0, w: 0, x: 900, z: 2 }, '4.4.4.4')).status, 400);
assert.equal((await (await pedir(`/mensajes/${m.id}/valorar`, {})).json()).v, 1);
assert.equal((await (await pedir('/mensajes')).json()).length, 9);
console.log('ok');
