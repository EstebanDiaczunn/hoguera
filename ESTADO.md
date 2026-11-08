# Hoguera — estado

*Pausado el 08/11/2026 por decisión de Esteban («hasta acá lo dejamos»). Publicado y funcionando, salvo los mensajes compartidos.*

https://hoguera.diaczun.com · repo público `EstebanDiaczunn/hoguera` (GitHub Pages, rama `main`, raíz).

## Qué es

Un santuario en ruinas de noche, con una hoguera en el centro, que se camina en primera persona. Homenaje a Dark Souls.
Los visitantes leen mensajes que otros dejaron en el piso, descansan en la hoguera (la primera vez se enciende:
«HOGUERA ENCENDIDA») y dejan el suyo para el que viene. **El porqué:** nadie cruza la oscuridad solo; dejar una marca
para un desconocido, como los mensajes de Dark Souls.

## Cómo nació (para no repetir la discusión)

- Esteban vio https://jorgeluisborges.org (caminar en 3D entre frases de Borges, con sonido espacial) y quiso algo así.
- Lo que le atrapó fue **caminar en 3D y el sonido espacial**, no el texto.
- Rechazado: cualquier cosa con textos suyos («son muy malos»), autores de dominio público (Macedonio, Quiroga, Storni, Arlt),
  ideas solo sonoras («muy pobre»), Sísifo (abandonado). Camus y Michael Jackson descartados por derechos.
- Eligió Dark Souls porque lo ama. Las plantillas de mensajes estilo Dark Souls le parecieron pobres → texto libre.
- No quiere hacer trabajo él: todo lo técnico lo hace el agente; pedirle solo lo inevitable (credenciales).

## Cómo está hecho

| Pieza | Dónde | Notas |
|---|---|---|
| Escena, controles, sonido, mensajes | `index.html` | Three.js 0.160 desde jsdelivr (importmap) + GLTFLoader. Un solo archivo. |
| Filtro y semillas | `mensajes.js` | Compartido por página y worker: `revisar()`, `oculto()`, 8 mensajes iniciales. |
| Servidor de mensajes | `worker.js` + `wrangler.toml` | Cloudflare Worker + Durable Object `Sala` (SQLite). **Sin desplegar.** |
| Pruebas | `node --import ./prueba-cf.mjs prueba-worker.mjs` | Filtro, límite por IP, votos, ocultar por «mal mensaje». |
| Modelos y texturas | `recursos/<modelo>/`, `recursos/texturas/` | Poly Haven, CC0, 1k. |
| Sonidos | `recursos/audio/` | OpenGameArt, CC0, mp3 (para que ande en Safari). |
| Dominio | Cloudflare DNS `CNAME hoguera → estebandiaczunn.github.io` (DNS only) + archivo `CNAME` | HTTPS forzado en Pages. |

**Probar local:** `python3 -m http.server 8765` en esta carpeta y abrir `http://localhost:8765`.
`?en=x,z` hace aparecer al jugador en otro lugar (el fuego está en 0,0; la entrada en 0,15.2).

### Controles
Compu: WASD/flechas, mouse para mirar (pointer lock), Shift corre, E descansar, R buen mensaje, X mal mensaje, M escribir, Esc pausa.
Celular: pulgar izquierdo camina (palanca), derecho mira; botones en pantalla.

### Mensajes
- Texto libre hasta 100 caracteres. El filtro (`revisar`) frena links, mails, teléfonos, letras repetidas e insultos
  es/en (raíces + exactas, tolera leetspeak, deja pasar «putrefacto»). No entiende contexto: eso lo cubren los votos.
- Un mensaje se oculta si tiene ≥3 «mal mensaje» y más malos que buenos. Un voto por IP y mensaje (30 días).
- Un mensaje por minuto por IP. Máximo 400 guardados (además de las semillas).
- Mientras `const API = ''` en `index.html`: cada visitante ve las 8 semillas + lo suyo (localStorage).

### Rendimiento (lo que hizo falta)
Esteban dijo dos veces que andaba lento. Se sacaron las sombras (eran lo más caro: cubemap de la luz puntual),
la resolución es dinámica (`ajustarResolucion`: baja hasta 0,5 si un cuadro tarda más de 1/40 s, sube si sobra),
menos clones de rocas/árboles, partículas con tamaño máximo, sin grano CSS con blend, y el cartel de «Descansar»
ya no reescribe el DOM en cada cuadro. Medido en Chromium sin GPU: 0,6 → 4,2 fps. **No se probó en una GPU real.**
Si sigue lento: preguntar máquina y navegador; siguientes candidatos: MeshLambert en vez de Standard, menos
polígonos (estatua 28k, árbol 34k ×3, roca 28k ×4), sacar normal maps de lejos.

### Sonido
Fogata 29 s y viento 45 s en bucle con fundido cruzado; 4 pasos al azar con variación de tono; golpe de fuego +
acorde grave al encender. El fuego es posicional (HRTF). Los volúmenes se nivelan al cargar (`nivelar`).
**Nadie lo escuchó todavía con auriculares** salvo Esteban, que se quejó de la versión anterior (sintetizada = ruido blanco).

## Pendiente

1. **Desplegar el servidor de mensajes.** El `CF_API_TOKEN` de clara-vps solo tiene DNS y *lectura* de Workers
   (subir el script da «No access»; KV da error 10000). Hace falta un token nuevo con plantilla «Edit Cloudflare Workers»
   (cuenta de Esteban + zona diaczun.com). Con el token:
   - subir `worker.js` y `mensajes.js` como módulos con binding `SALA` → clase `Sala` y migración `new_sqlite_classes`
     (`wrangler deploy` o la API multipart, ver historial de esta sesión),
   - habilitar workers.dev o una ruta `hoguera-api.diaczun.com`,
   - poner la URL en `const API` de `index.html`, publicar y probar con dos navegadores a la vez.
   Alternativa descartada: montarlo en clara-vps (toca el nginx de Clara en producción).
2. Escuchar el sonido y ajustar volúmenes/elección de grabaciones.
3. Confirmar fluidez en la máquina de Esteban.
4. Peso: ~19 MB (`recursos/`). Si el celular tarda, bajar texturas de los modelos a 512 px.
5. Cuando los mensajes sean compartidos: posteo en r/darksouls, r/fromsoftware y r/argentina (lo sube Esteban).
6. Idea guardada, no hecha: que los mensajes se apaguen con el tiempo y los valorados duren más.

## Créditos (CC0)
Poly Haven: `stone_fire_pit`, `antique_estoc`, `gothic_statue`, `dead_quiver_trunk`, `rock_07`, `marble_bust_01`,
`cobblestone_floor_03`, `castle_wall_slates`. OpenGameArt: *Fireplace sound loop*, *Mild wind background noise*,
*Footsteps* (GboxMikeFozzy), *Fire staff sound effects* (LEGIT Audio).
