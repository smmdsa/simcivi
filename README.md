# SimCivi · Véspera IV.6 — La vida pequeña

Experiencia contemplativa en HTML, CSS, JavaScript nativo y Three.js r170. Un planeta esférico con continentes, océanos, ríos, organismos celulares y prácticas aprendidas. Intervenir es opcional.

[Observar el planeta](https://vespera-biodigital.mrtiagosan.chatgpt.site) · [Roadmap de diez ideas](docs/ROADMAP-V4.md) · [Arquitectura y límites de V4](docs/V4-PLANET.md)

## Novedades de IV.6

Biosfera persistente de productores, fitoplancton, descomponedores, microfauna del suelo y zooplancton. Reservas finitas, dormancia, reciclaje, colonias visibles y variantes heredables con costes. El pastoreo deja raíces vivas; comer ya no elimina automáticamente la planta entera. El observatorio **La vida resiste** permite conocer y enfocar las colonias.

[Investigación, diagnóstico, reglas y límites](docs/V4-BIOSPHERE.md). Guardado v8 en IndexedDB con importación del guardado anterior. Es la base de C1: insectos individuales, aves, nuevos nichos marinos y radiación de macrofauna siguen planificados. No se resucitan animales extintos ni se reconstruyen culturas desaparecidas.

## Novedades de IV.5

Cuencas con agua superficial, nieve, infiltración, acuíferos, caudales, desbordes y sedimentos. Placas y fallas acumulan tensión hasta producir sismos locales; los reservorios de magma alimentan volcanes que dejan roca y ceniza. Los habitantes evitan peligros caminando y los daños persisten. El observatorio **Agua y roca** permite recorrer cuencas, fallas y volcanes; el documental y el diario registran los acontecimientos.

[Reglas, conservación, pruebas y límites](docs/V4-GEODYNAMICS.md). Se completan B y C con resolución ambiental de 512 celdas y geología acelerada. Las costas base se conservan; no hay deriva continental ni tsunamis. Guardado v7 compatible con mundos anteriores. Tormentas organizadas, instituciones y medios siguen pendientes.

## Novedades de IV.4

El clima se gobierna por el entorno: temperatura con memoria térmica, día/noche y estaciones, moderación del agua, vapor, condensación, lluvia local, escorrentía y viento. Se retiran los sliders de temperatura, humedad y fertilidad y la intervención de lluvia. El panel muestra condiciones del lugar observado; la vida y los materiales responden a esas condiciones.

[Modelo, migración y pruebas](docs/V4-ENVIRONMENT.md) · [Investigación y plan: riesgos naturales, comunidades y noticiero](docs/PLANET-SOCIETIES-ROADMAP.md). Se completa la entrega A de ese plan. La tectónica se incorpora en IV.5; huracanes, instituciones y medios siguen pendientes.

## Novedades de IV.3

El punto 10 integra océanos con profundidad, reflejo solar y oleaje, nubes procedurales ligadas a humedad y lluvia, atmósfera de amanecer, relieve con grano fino, estrellas y flores con brillo nocturno asociado a su néctar. El encuadre orbital deja respirar al planeta; al acercarse, las nubes se retiran de la vista.

La calidad automática usa tiempos P95/P99, límites de células, vegetación y píxeles. El LOD conserva su nivel entre umbrales para evitar saltos repetidos. El panel de rendimiento distingue CPU, fotogramas y GPU cuando el dispositivo permite medirla. El canal del worker omite genomas sin cambios y reconstruye estados completos; fuera de cámara la simulación continúa. [Presupuestos, pruebas y límites](docs/V4-SCALE.md).

## Novedades de IV.2

El punto 9 incorpora una reserva finita de semillas con genética persistente, plantas que repliegan su crecimiento, animales que buscan microrefugios y entran en letargo, y rebrotes cuando las condiciones vuelven a ser favorables. La recuperación depende de supervivientes. No reaparecen animales extintos ni plantas sin semillas o raíces vivas.

El botón **La vida resiste** permite observar reservas, dormancia y recuperación por región. La cámara documental puede seguir estos acontecimientos. La partida se adapta automáticamente sin reiniciarse. [Reglas, presupuestos y límites](docs/V4-RECOVERY.md).

Se sustituye la llegada continua de brotes por descendencia y reservas reales; el viento transporta semillas existentes y los cadáveres aportan nutrientes. Las plantas maduras de partidas anteriores pueden formar una primera reserva, una sola vez y con coste de biomasa.

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

Sembrar y mutar son intervenciones opcionales; la lluvia depende del ciclo del agua. El audio comienza silenciado; cada familia mantiene su voz sintetizada. Las notificaciones aparecen abajo a la derecha, permanecen un segundo, se desvanecen una vez y admiten diez visibles con cola FIFO.

## Modo pantalla

Mover la ventana al monitor deseado y tocar ⛶ o presionar H. Solicita pantalla completa y Screen Wake Lock; oculta la interfaz y, después de cuatro segundos sin movimiento, los controles y el cursor. Mover el mouse o usar el teclado vuelve a mostrar los controles. Esc, H o Salir termina el modo y libera el bloqueo de pantalla.

El indicador confirma si la solicitud está activa. Si el navegador no permite fullscreen, queda una vista limpia en ventana. Si no admite o rechaza Wake Lock, advierte que el monitor podría apagarse. Hay reintento manual; al volver a una pestaña visible se solicita un bloqueo nuevo. No se hacen reintentos continuos después de una revocación del sistema, ni se reproducen videos falsos o se modifican ajustes del sistema operativo.

Requiere HTTPS y una pestaña visible. Ahorro de batería, políticas del navegador o suspensión del sistema pueden prevalecer. No es un fondo nativo de Windows detrás de los iconos y no mantiene funcionando una página cerrada. [Referencia: Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API).

Verificación específica: `node scripts/verify-screen-mode.mjs` cubre entrada/salida, Esc, pérdida y recuperación de visibilidad, permisos denegados, ausencia de API, revocaciones y solicitudes tardías. No simula un apagado físico del monitor.

## Biología conservada

Seis familias con locomoción cuadrúpeda, hexápoda, bípeda y acuática. IK analítica de dos huesos, pies plantados, fases de balanceo, respiración, alimentación, acecho, cortejo, apareamiento estilizado y muerte. Menos de 300 esferas por organismo cercano.

Sexos, madurez, energía, salud, edad, gestación, semillas genéticas únicas, linajes y mutaciones. Los cadáveres se descomponen; sus nutrientes y los de plantas marchitas alimentan nuevos brotes. Cinco variedades vegetales con crecimiento y senescencia.

## Guardado y rendimiento

Se conserva el identificador `vespera-world-v2`, ahora con formato 8 en IndexedDB. Los formatos 2–7 migran automáticamente; el original de localStorage se conserva al importar. El jardín anterior se traslada a Auralia conservando identidades e historias; otros continentes reciben fundadores. Las partidas sin atmósfera reciben un clima geográfico determinista, conservando sus habitantes e historias. Guardado cada 12 segundos, al salir y después de acciones relevantes. Estado local, sin sincronización y sin avance con la página cerrada.

Límites: 384 criaturas vivas, 2.400 plantas, 1.400 piezas, 420 depósitos materiales, 64 cadáveres, 180 parches de nutrientes, 500 difuntos y 100 eventos recientes. La recuperación añade hasta 1.200 semillas y 48 microrefugios observados; la atmósfera usa 512 celdas persistentes. Los temporizadores se conservan y el clima/aptitud derivados no se duplican en el guardado. El navegador puede ralentizar o suspender una pestaña oculta. Bajo sobrecarga el reloj puede avanzar más despacio, manteniendo los mismos pasos de simulación.

Objetivo 60 FPS con contador real y calidad adaptativa. No se garantiza en todo hardware. Las pruebas principales miden CPU, transporte y geometría Three.js. La prueba opcional de shaders compila y enlaza GLSL ES 3 con Mesa; la revisión visual empleó rasterización por software. **No certifican 60 FPS ni fluidez en un navegador o GPU concreto**.

## Ejecutar y verificar

Servir `dist/` por HTTP: `python -m http.server 8080 --directory dist`. Requiere navegador con WebGL y Web Workers. Three.js y su licencia MIT están incluidos; no requiere instalación ni compilación. No abrir mediante `file://`.

`npm test` ejecuta crisis y recuperación, viabilidad, dormancia, ausencia de respawn, cultura perecedera, cuidados, polinización, herencia vegetal, dispersión, refugios, cámara documental, fullscreen/Wake Lock, geometría esférica, clima solar, genética, reproducción, cultura, recursos, migración, continuidad determinista, aislamiento render/datos, IK, LOD, veinte minutos simulados, ciclo de vida del worker y notificaciones. Informes: `verification-v4.json`, `verification-recovery.json` `verification-crisis.json`, `verification-scale.json` `verification-environment.json` y `verification-geodynamics.json`. `npm run test:shaders` requiere Python 3 y Mesa EGL/GLES en Linux.

Los resultados `verification.json` y `verification-emergence.json` corresponden a la versión III y se conservan como antecedentes.

## Código

- `biosphere.js`: red trófica microscópica, dormancia, herencia, transferencias y censos.
- `biosphere-visuals.js`: colonias y microfauna agregada con instancias acotadas.
- `world-store.js`: persistencia atómica e importación de guardados locales.
- `ecology-census.js`: métricas diarias de diagnóstico.
- `planet.js`: coordenadas, distancias, geografía, ciclo solar y adaptación.
- `hydrology.js` y `geology.js`: reservas, cuencas, sedimentos, tensión, magma y consecuencias persistentes.
- `land-process-visuals.js`: relieve, red de drenaje, agua, conos, lava y fallas con buffers acotados.
- `environment.js`: clima local autónomo, memoria térmica, agua, condensación, lluvia y viento.
- `simulation.js`: ecosistema, recursos, reproducción, migración y persistencia.
- `simulation-worker.js`: propietario del reloj y de las mutaciones del estado.
- `genetics.js`: alelos, semillas, herencia y mutación.
- `culture.js`: aprendizaje, prácticas, materiales, refugios y agrupaciones.
- `lifeways.js`: memoria perecedera, vínculos, cuidado, polen, semillas y rasgos vegetales.
- `recovery.js`: reservas, viabilidad, dormancia, microrefugios y recuperación regional.
- `documentary.js`: director observador, planos, navegación esférica y control manual.
- `screen-mode.js`: fullscreen y ciclo de vida de Screen Wake Lock.
- `world.js`: anatomía celular e IK reutilizadas de V3.
- `globe.js`: planeta, navegación, iluminación, horizonte y LOD.
- `planet-visuals.js`: océano, atmósfera, nubes, superficie, estrellas y néctar luminoso.
- `render-budget.js`: límites, histéresis, tiempos de fotogramas y consultas GPU.
- `state-channel.js`: transporte incremental y reconstrucción completa del estado.
- `app.js`, `style.css`, `index.html`: observatorio, fichas, controles y guardado.
- `sound.js`, `notifications.js`: audio y avisos.

Es una simulación de diseño, no un modelo biológico calibrado. La inteligencia no aumenta obligatoriamente. No hay recetas de ciudades, gobiernos, lenguaje, evolución ilimitada de órganos ni guerras estratégicas. Los mecanismos y sus limitaciones están documentados.
