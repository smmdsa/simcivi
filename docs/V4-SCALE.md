# V4.3 · Escala y detalle — punto 10

La simulación sigue siendo propiedad del worker: todas las regiones avanzan con pasos de 100 ms. La cámara decide qué representar y con cuánto detalle. No decide quién come, envejece, aprende o se reproduce.

## Presentación

- Océano con profundidad geográfica, transición costera, ondulación de normales y reflejo del sol orbital.
- Nubes procedurales cuya cobertura responde a humedad y lluvia; sombras suaves sobre tierra. Son una representación del clima, no una simulación de fluidos. Se desvanecen al acercarse y cerca del borde del planeta para preservar la lectura del relieve.
- Atmósfera fina con tonos de crepúsculo, corona solar y estrellas con tamaño y pigmentación variables.
- Grano de superficie y nieve polar visual. La nieve no añade una segunda regla climática.
- Flores activas con néctar emiten un brillo nocturno discreto. Es un recurso artístico ligado a un estado real; no introduce una mutación bioluminiscente.
- Sin cadena de posprocesado, bloom a pantalla completa ni sombras dinámicas de alta resolución. Materiales e instancias reutilizados.

## Presupuestos del render

| Nivel | Células | Piezas vegetales | Píxeles máximos | DPR máximo | Actualización ambiental |
|---|---:|---:|---:|---:|---:|
| Cinemática | 23.000 | 12.000 | 3,2 millones | 1,50 | 0,18 s |
| Equilibrada | 15.000 | 8.000 | 2,1 millones | 1,15 | 0,24 s |
| Fluida | 9.500 | 4.500 | 1,3 millones | 0,85 | 0,32 s |

El DPR efectivo también respeta el dispositivo y el tamaño de ventana. En Fluida desaparecen las nubes y los cálculos finos de superficie. Los organismos que exceden el presupuesto pasan a marcadores seleccionables. Se cuenta el coste completo del siguiente organismo antes de emitir células; cadáveres y seres vivos comparten el límite.

Se descarta por horizonte y frustum antes de ordenar por distancia. El individuo seleccionado tiene prioridad. El detalle alto entra a 46 píxeles y se conserva hasta 36; el intermedio entra a 15 y permanece hasta 11. Es histéresis entre representaciones discretas, no morphing continuo. Posiciones de terreno derivadas se preparan al recibir cada estado; los buffers ambientales y culturales se actualizan en fotogramas alternos.

El controlador analiza hasta 180 fotogramas cada dos segundos. Baja un nivel si P95 supera 21 ms o FPS cae de 53, con seis segundos entre cambios. Sube después de 35 segundos de margen, con P95 inferior a 17,4 ms y más de 58,5 FPS. El usuario puede fijar un nivel manualmente.

## Reloj, transporte y medición

Los estados visuales llegan a 5 Hz. El canal conserva genomas que no cambiaron y omite repetir el archivo de difuntos mientras no cambie; el receptor reconstruye el estado completo antes de guardarlo o mostrar fichas. Inicio, reinicio, renombrado e intervenciones envían estados completos. Si falta una referencia, la vista solicita resincronización. Los cachés se acotan a las identidades conservadas.

Con la pestaña oculta se publican estados a 1 Hz y se omite el render; el reloj mantiene las mismas reglas y límites. Esto no evita las restricciones del navegador. El worker limita el trabajo por turno y acumula hasta cuatro segundos: bajo sobrecarga, el tiempo biológico puede ralentizarse.

El panel muestra FPS, P95/P99 de fotogramas, preparación y envío CPU, último paso biológico, retraso acumulado, geometría y presupuesto. La consulta GPU usa hasta cuatro mediciones pendientes, sin esperar activamente; descarta resultados disjuntos. Si la extensión no existe, muestra «No disponible». El coste de transferir un estado corresponde a la publicación anterior e incluye preparación y `postMessage`, no el tiempo de recepción.

Referencia de la medición GPU: [Khronos — EXT_disjoint_timer_query_webgl2](https://registry.khronos.org/webgl/extensions/EXT_disjoint_timer_query_webgl2/).

## Verificación

`npm test` incluye `verify-scale.mjs`: reconstrucción exacta tras pasos, mutación, muerte, renombrado y reinicio; presupuesto con 384 habitantes; ausencia de mutación biológica durante el render; histéresis; adaptación y consultas GPU con un controlador simulado. `verification-scale.json` registra el resultado. La comparación de tamaño es de JSON serializado: un indicador reproducible del volumen de datos, no una medición del formato interno de structured clone.

`npm run test:shaders` compila y enlaza los siete programas de materiales con un contexto GLSL ES 3 de Mesa en Linux. Incluye el código estándar de Three.js modificado para terreno y vegetación. También exporta geometría y uniformes de las capas orbitales a `/tmp` para inspección técnica. Durante esta entrega se revisó una captura de esas capas mediante rasterización por software; no es una captura del navegador ni de toda la interfaz.

Las pruebas de veinte minutos y crisis verifican que el punto 9 sigue operativo con el canal nuevo. La caché ambiental utiliza coordenadas canónicas: una recarga no cambia la respuesta del refugio por el orden en que llegan los habitantes.

El objetivo sigue siendo 60 FPS. Los límites reducen el coste y permiten medirlo; no certifican esa frecuencia en todos los equipos. No se han aumentado las capacidades máximas del ecosistema ni implementado el punto 8 de memoria histórica.
