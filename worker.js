// Guarda los mensajes del piso en Cloudflare KV. Solo índices de plantilla y palabra: no hay texto libre que moderar.
import { PLANTILLAS, PALABRAS, SEMILLAS } from './mensajes.js';

const ORIGENES = ['https://hoguera.diaczun.com', 'https://diaczun.com', 'http://localhost:8765'];
const MAX = 300;

export default {
  async fetch(req, env) {
    const origen = req.headers.get('origin');
    const cors = {
      'access-control-allow-origin': ORIGENES.includes(origen) ? origen : ORIGENES[0],
      'access-control-allow-methods': 'GET, POST',
      'access-control-allow-headers': 'content-type',
    };
    const json = (d, status = 200) => new Response(JSON.stringify(d), { status, headers: { ...cors, 'content-type': 'application/json' } });
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

    const url = new URL(req.url);
    // ponytail: todo en una sola clave; con mucho tráfico simultáneo se puede perder alguna escritura, pasar a D1 si pasa
    const lista = (await env.MSG.get('mensajes', 'json')) ?? SEMILLAS;

    if (req.method === 'GET' && url.pathname === '/mensajes') return json(lista);

    if (req.method === 'POST' && url.pathname === '/mensajes') {
      const ip = req.headers.get('cf-connecting-ip') ?? 'x';
      if (await env.MSG.get('ip:' + ip)) return json({ error: 'espera' }, 429);
      let b;
      try { b = await req.json(); } catch { return json({ error: 'json' }, 400); }
      const t = b.t, w = b.w, x = +b.x, z = +b.z;
      if (!Number.isInteger(t) || !PLANTILLAS[t] || !Number.isInteger(w) || !PALABRAS[w]
        || !Number.isFinite(x) || !Number.isFinite(z) || Math.hypot(x, z) > 20) return json({ error: 'mensaje' }, 400);
      const m = { id: crypto.randomUUID().slice(0, 8), t, w, x: Math.round(x * 100) / 100, z: Math.round(z * 100) / 100, v: 0 };
      // se conservan las semillas y los últimos MAX mensajes
      const semillas = lista.filter((n) => n.id.startsWith('s'));
      const otros = lista.filter((n) => !n.id.startsWith('s'));
      await env.MSG.put('mensajes', JSON.stringify([...semillas, ...otros, m].slice(-(MAX + semillas.length))));
      await env.MSG.put('ip:' + ip, '1', { expirationTtl: 60 });
      return json(m, 201);
    }

    const voto = url.pathname.match(/^\/mensajes\/([\w-]+)\/valorar$/);
    if (req.method === 'POST' && voto) {
      const m = lista.find((n) => n.id === voto[1]);
      if (!m) return json({ error: 'no existe' }, 404);
      m.v = (m.v || 0) + 1;
      await env.MSG.put('mensajes', JSON.stringify(lista));
      return json({ v: m.v });
    }

    return json({ error: 'no encontrado' }, 404);
  },
};
