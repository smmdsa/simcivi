# SimCivi · Véspera IV.1 — Vidas entrelazadas

Experiencia contemplativa en HTML, CSS, JavaScript nativo y Three.js r170. Un planeta esférico con continentes, océanos, ríos, organismos celulares y prácticas aprendidas. Intervenir es opcional.

[Observar el planeta](https://vespera-biodigital.mrtiagosan.chatgpt.site) · [Roadmap de diez ideas](docs/ROADMAP-V4.md) · [Arquitectura y límites de V4](docs/V4-PLANET.md)

## Novedades de IV.1

Culturas que se transmiten, se refuerzan y se olvidan; vínculos y cuidados con coste energético; polinización, dispersión y rasgos vegetales heredables; cámara documental autónoma con prioridad al mouse. El modo pantalla completa y monitor encendido queda integrado. [Detalles de los puntos 4–7](docs/V4-LIFEWAYS.md).

El botón **Documental** permite dejar que la cámara encuentre historias reales. Arrastrar o hacer zoom la suspende durante 30 segundos; seguir un individuo mantiene tu elección. También puede controlarse dentro del modo pantalla. Las fichas incorporan vínculos, cuidados, función ecológica y recuerdos.

## Base del planeta

- Geografía esférica: cuatro regiones continentales, océanos, canales fluviales y biomas. Movimiento sobre la superficie; continuidad de longitud y navegación en polos.
- Sol orbital: hemisferios con día y noche simultáneos. Día de 160 segundos a 1×; año de 24 días, declinación estacional de 23,4°. Luz local, latitud, altura, humedad y estación afectan temperatura, evaporación, crecimiento vegetal y actividad.
- Morfología funcional: herencia biparental de proporciones, pigmentación, aislamiento térmico, actividad nocturna y adaptación anfibia. Ventajas y costes energéticos; variantes dentro de seis familias anatómicas.
- Construcción local: recoger, transportar, colocar, reparar, retirar y reutilizar madera, piedra, fibra y arcilla. Bloques que obstaculizan y dan cobijo, aislamiento, protección del viento y retención de humedad para plantas cercanas.
- Cultura: preferencias materiales y lugares útiles aprendidos por experiencia y copia imperfecta de padres y vecinos. Los resúmenes regionales se calculan de las prácticas existentes; no son facciones programadas.
- Simulación en Web Worker, pasos fijos de 100 ms y publicación de estados a 5 Hz. Las regiones fuera de cámara siguen viviendo. El LOD cambia representación, nunca la existencia ni el reloj de los individuos.
- Detalle celular cercano, anatomía simplificada a distancia y marcadores remotos; descarte por horizonte y campo visual. Instancias y buffers reutilizados, límites y calidad adaptativa.

## Controles

Arrastrar: recorrer y girar el planeta. Rueda: zoom. Botón derecho o Mayúsculas + arrastrar: desplazamiento más fino. Pinza con dos dedos: zoom. Clic sobre criatura o marcador: ficha, nombre y seguimiento. H o botón ⛶: modo pantalla completa, con solicitud de mantener el monitor encendido. Espacio: pausa. Velocidades 1×, 3× y 8×.

Sembrar, lluvia y mutación son intervenciones opcionales. El audio comienza silenciado; cada familia mantiene su voz sintetizada. Las notificaciones aparecen abajo a la derecha, permanecen un segundo, se desvanecen una vez y admiten diez visibles con cola FIFO.

## Modo pantalla

Mover la ventana al monitor deseado y tocar ⛶ o presionar H. Solicita pantalla completa y Screen Wake Lock; oculta la interfaz y, después de cuatro segundos sin movimiento, los controles y el cursor. Mover el mouse o usar el teclado vuelve a mostrar los controles. Esc, H o Salir termina el modo y libera el bloqueo de pantalla.

El indicador confirma si la solicitud está activa. Si el navegador no permite fullscreen, queda una vista limpia en ventana. Si no admite o rechaza Wake Lock, advierte que el monitor podría apagarse. Hay reintento manual; al volver a una pestaña visible se solicita un bloqueo nuevo. No se hacen reintentos continuos después de una revocación del sistema, ni se reproducen videos falsos o se modifican ajustes del sistema operativo.

Requiere HTTPS y una pestaña visible. Ahorro de batería, políticas del navegador o suspensión del sistema pueden prevalecer. No es un fondo nativo de Windows detrás de los iconos y no mantiene funcionando una página cerrada. [Referencia: Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API).

Verificación específica: `node scripts/verify-screen-mode.mjs` cubre entrada/salida, Esc, pérdida y recuperación de visibilidad, permisos denegados, ausencia de API, revocaciones y solicitudes tardías. No simula un apagado físico del monitor.

## Biología conservada

Seis familias con locomoción cuadrúpeda, hexápoda, bípeda y acuática. IK analítica de dos huesos, pies plantados, fases de balanceo, respiración, alimentación, acecho, cortejo, apareamiento estilizado y muerte. Menos de 300 esferas por organismo cercano.

Sexos, madurez, energía, salud, edad, gestación, semillas genéticas únicas, linajes y mutaciones. Los cadáveres se descomponen; sus nutrientes y los de plantas marchitas alimentan nuevos brotes. Cinco variedades vegetales con crecimiento y senescencia.

## Guardado y rendimiento

Se conserva la clave local `vespera-world-v2`, ahora con formato 5. Los formatos 2–4 migran automáticamente; el original se respalda en `vespera-pre-planet-backup`. El jardín anterior se traslada a Auralia conservando identidades e historias; otros continentes reciben fundadores. Guardado cada 12 segundos, al salir y después de acciones relevantes. Estado local, sin sincronización y sin avance con la página cerrada.

Límites: 384 criaturas vivas, 2.400 plantas, 1.400 piezas, 420 depósitos materiales, 64 cadáveres, 180 parches de nutrientes, 500 difuntos y 100 eventos recientes. El navegador puede ralentizar o suspender una pestaña oculta. Bajo sobrecarga el reloj puede avanzar más despacio, manteniendo los mismos pasos de simulación.

Objetivo 60 FPS con contador real y calidad adaptativa. No se garantiza en todo hardware. Las pruebas del repositorio miden CPU y geometría Three.js, **no GPU, WebGL ni fluidez visual en navegador**.

## Ejecutar y verificar

Servir `dist/` por HTTP: `python -m http.server 8080 --directory dist`. Requiere navegador con WebGL y Web Workers. Three.js y su licencia MIT están incluidos; no requiere instalación ni compilación. No abrir mediante `file://`.

`npm test` ejecuta cultura perecedera, cuidados, polinización, herencia vegetal, dispersión, refugios, cámara documental, fullscreen/Wake Lock, geometría esférica, clima solar, genética, reproducción, cultura, recursos, migración, continuidad determinista, aislamiento render/datos, IK, LOD, veinte minutos simulados, ciclo de vida del worker y notificaciones. Resultado principal: `verification-v4.json`.

Los resultados `verification.json` y `verification-emergence.json` corresponden a la versión III y se conservan como antecedentes.

## Código

- `planet.js`: coordenadas, distancias, geografía, ciclo solar, clima y adaptación.
- `simulation.js`: ecosistema, recursos, reproducción, migración y persistencia.
- `simulation-worker.js`: propietario del reloj y de las mutaciones del estado.
- `genetics.js`: alelos, semillas, herencia y mutación.
- `culture.js`: aprendizaje, prácticas, materiales, refugios y agrupaciones.
- `lifeways.js`: memoria perecedera, vínculos, cuidado, polen, semillas y rasgos vegetales.
- `documentary.js`: director observador, planos, navegación esférica y control manual.
- `screen-mode.js`: fullscreen y ciclo de vida de Screen Wake Lock.
- `world.js`: anatomía celular e IK reutilizadas de V3.
- `globe.js`: planeta, navegación, iluminación, horizonte y LOD.
- `app.js`, `style.css`, `index.html`: observatorio, fichas, controles y guardado.
- `sound.js`, `notifications.js`: audio y avisos.

Es una simulación de diseño, no un modelo biológico calibrado. La inteligencia no aumenta obligatoriamente. No hay recetas de ciudades, gobiernos, lenguaje, evolución ilimitada de órganos ni guerras estratégicas. Los mecanismos y sus limitaciones están documentados.
