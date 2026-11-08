// Guarda los mensajes del piso en Cloudflare KV. El filtro es el mismo que corre en la página.
import { revisar, limpiar, oculto, SEMILLAS } from './mensajes.js';

const ORIGENES = ['https://hoguera.diaczun.com', 'https://diaczun.com', 'http://localhost:8765'];
const MAX = 400;

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
    const ip = req.headers.get('cf-connecting-ip') ?? 'x';
    // ponytail: todo en una sola clave; con mucho tráfico simultáneo se puede perder alguna escritura, pasar a D1 si pasa
    const lista = (await env.MSG.get('mensajes', 'json')) ?? SEMILLAS;

    if (req.method === 'GET' && url.pathname === '/mensajes') return json(lista.filter((m) => !oculto(m)));

    if (req.method === 'POST' && url.pathname === '/mensajes') {
      if (await env.MSG.get('ip:' + ip)) return json({ error: 'espera' }, 429);
      let b;
      try { b = await req.json(); } catch { return json({ error: 'json' }, 400); }
      const txt = limpiar(b.txt), x = +b.x, z = +b.z;
      const motivo = revisar(txt);
      if (motivo) return json({ error: motivo }, 422);
      if (!Number.isFinite(x) || !Number.isFinite(z) || Math.hypot(x, z) > 20) return json({ error: 'lugar' }, 400);
      const m = { id: crypto.randomUUID().slice(0, 8), txt, x: Math.round(x * 100) / 100, z: Math.round(z * 100) / 100, v: 0, m: 0 };
      await env.MSG.put('mensajes', JSON.stringify([...lista, m].slice(-MAX)));
      await env.MSG.put('ip:' + ip, '1', { expirationTtl: 60 });
      return json(m, 201);
    }

    const voto = url.pathname.match(/^\/mensajes\/([\w-]+)\/(bueno|malo)$/);
    if (req.method === 'POST' && voto) {
      const m = lista.find((n) => n.id === voto[1]);
      if (!m) return json({ error: 'no existe' }, 404);
      // un voto por persona y mensaje durante un mes
      const clave = `voto:${ip}:${m.id}`;
      if (await env.MSG.get(clave)) return json({ v: m.v, m: m.m });
      if (voto[2] === 'bueno') m.v = (m.v || 0) + 1; else m.m = (m.m || 0) + 1;
      await env.MSG.put('mensajes', JSON.stringify(lista));
      await env.MSG.put(clave, '1', { expirationTtl: 60 * 60 * 24 * 30 });
      return json({ v: m.v, m: m.m });
    }

    return json({ error: 'no encontrado' }, 404);
  },
};
