# Hoguera

Un santuario en ruinas con una hoguera. Otros pasaron antes que vos y dejaron mensajes en el piso.
Homenaje a Dark Souls. Vive en https://diaczun.com/hoguera/.

- `index.html`: la escena (Three.js desde CDN, sonido con Web Audio, sin archivos externos).
- `mensajes.js`: plantillas y palabras; los mensajes guardan solo índices.
- `worker.js`: Cloudflare Worker + KV que guarda los mensajes. Prueba: `node prueba-worker.mjs`.
- Probar local: `python3 -m http.server 8765` y abrir `localhost:8765` (`?en=x,z` para aparecer en otro lugar).
