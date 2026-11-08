# Hoguera

Un santuario en ruinas con una hoguera. Otros pasaron antes que vos y dejaron mensajes en el piso.
Homenaje a Dark Souls. Vive en https://hoguera.diaczun.com.

- `index.html`: la escena (Three.js desde CDN), controles, sonido y mensajes.
- `mensajes.js`: filtro de mensajes (links, teléfonos, insultos) compartido por página y worker; la gente borra el resto con «Mal mensaje».
- `worker.js`: Cloudflare Worker + Durable Object que guarda los mensajes (sin desplegar todavía). Prueba: `node --import ./prueba-cf.mjs prueba-worker.mjs`.
- Estado, decisiones y pendientes: `ESTADO.md`.
- Probar local: `python3 -m http.server 8765` y abrir `localhost:8765` (`?en=x,z` para aparecer en otro lugar).

## Recursos de terceros (todos CC0)

- Modelos y texturas: Poly Haven — `stone_fire_pit`, `antique_estoc`, `gothic_statue`, `dead_quiver_trunk`, `rock_07`, `marble_bust_01`, `cobblestone_floor_03`, `castle_wall_slates`.
- Sonidos: OpenGameArt — fogata (*Fireplace sound loop*), viento (*Mild wind background noise*), pasos de GboxMikeFozzy (*Footsteps*), encendido de LEGIT Audio (*Fire staff sound effects*).
