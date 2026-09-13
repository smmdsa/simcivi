# SimCivi · Véspera III — Huellas

Ecosistema contemplativo en HTML, CSS, JavaScript nativo y Three.js r170. `dist/` es el sitio completo, servido por HTTP, sin backend ni compilación. Three.js y su licencia MIT están incluidos; las fuentes de Google son opcionales.

## Versión III

Notificaciones estables en el extremo inferior derecho: 1 segundo de permanencia, desvanecimiento único y hasta diez visibles con cola FIFO.

La nueva capa experimental añade materiales, manipulación local, aprendizaje contextual, transmisión cultural, costes cognitivos, cobijo, intercambio, disputas y descubrimiento autónomo del terreno. No tiene planos de casas ni acciones de ciudad o guerra. **No garantiza civilizaciones ni evolución hacia mayor inteligencia.** Consultar [fundamentos, mecanismos y límites](docs/EMERGENCE.md).

[Experiencia jugable](https://vespera-biodigital.mrtiagosan.chatgpt.site) · [Código](https://github.com/smmdsa/simcivi)

Los archivos se sirven desde `dist/`. El código no depende del servicio de alojamiento original.

## Base de la versión II

Seis familias: Folívoro y Áureo cuadrúpedos, Brumín hexápodo, Rubrón carnívoro, Zancaluz bípedo y Nácar acuático. Los acuáticos habitan lagunas y comen algas; los terrestres no atraviesan agua. El terreno admite tres expansiones de radio 24 a 39, pasando de 84 a 126 habitantes posibles. Una expansión libera espacio, sin añadir automáticamente animales.

Los ejemplares tienen sexo, edad, energía, salud, distancia recorrida, descendientes, alimentos consumidos y un genoma diploide de 12 rasgos. Cada cría hereda un alelo de su madre y otro de su padre. Las mutaciones espontáneas e inducidas quedan registradas. La semilla individual controla el detalle de su pigmentación; las proporciones del cuerpo, anchura, cuello, cola, extremidades, agilidad, metabolismo, fertilidad y longevidad responden a los genes. Son variaciones dentro de una familia; no evolución libre de nuevas topologías o especies.

Un macho y una hembra adultos, alimentados y disponibles se buscan, cortejan, realizan una animación estilizada de apareamiento y comienzan gestación o puesta acuática. El nacimiento crea un linaje con ambos progenitores. La ficha muestra sus nombres, estadísticas, semilla, alelos y mutaciones. La reproducción espera si no hay capacidad y se interrumpe si un miembro de la pareja muere antes de la gestación. Un padre que fallece durante la gestación conserva su contribución genética.

La muerte tiene caída y descomposición celular. El cadáver persiste, pierde biomasa y genera abono local. Los nuevos brotes consumen nutrientes cercanos. Cinco variedades vegetales crecen y completan su ciclo: trébol, flor solar, helecho, hongo perla y alga. Las plantas muertas también devuelven su biomasa. Es un modelo ecológico simplificado: no una simulación científicamente calibrada de conservación global de masa o energía.

Los nacimientos, muertes, gestaciones, mutaciones y abono tienen avisos diferenciados. El diario mantiene 100 acontecimientos recientes con filtros. Cada familia tiene una voz sintetizada; semilla, sexo y edad modifican su tono. Audio opcional, inicialmente silenciado.

## Animación y render

- IK analítica de dos huesos, con pie plantado y fase de balanceo; trípodes alternos en hexápodos, apoyo alterno en bípedos, cola ondulante y aletas en acuáticos.
- Interpolación entre pasos discretos de simulación. Respiración, descanso, alimentación, acecho, carrera, cortejo y muerte tienen poses y movimientos propios.
- 145–203 esferas por ejemplar en detalle alto, siempre bajo 300. El detalle distante reduce esferas del cuerpo y extremidades manteniendo la silueta aproximada. No son células biológicas independientes ni tejidos deformables físicos.
- Matrices y colores instanciados escritos directamente en buffers reutilizados; subidas a GPU limitadas al rango activo. Geometría esférica y materiales simplificados. Colores genéticos almacenados por individuo.
- Vegetación y sombras se actualizan a frecuencia reducida; la anatomía y la cámara se dibujan con objetivo de 60 FPS.
- Calidad automática con histéresis: reduce resolución, detalle y finalmente sombras si la tasa medida cae. También hay elección manual.
- El contador mide cuadros dibujados por tiempo real en la pestaña visible. La ficha de rendimiento separa envío CPU y simulación CPU; no presenta esas medidas como tiempo GPU.
- El trabajo de simulación por cuadro tiene presupuesto temporal. En sobrecarga se prioriza la respuesta gráfica y puede ralentizarse el tiempo simulado.

No se garantiza 60 FPS universales. Depende de GPU, CPU, resolución, navegador, pantalla y carga externa. Las pruebas automatizadas de este entorno miden CPU sin WebGL; no certifican el rendimiento visual en un dispositivo. El contador y la calidad adaptativa funcionan en el navegador del usuario.

## Persistencia y límites

Mantiene la clave local original `vespera-world-v2`; el formato del estado es ahora 4, con migración desde 2 y 3. El primer guardado antiguo se respalda en `vespera-v1-backup`, y se migran nombres, historias y mundo. Se agregan fundadores bípedos y acuáticos durante la migración. No se borra el mundo existente. Los antiguos individuos reciben genomas fundadores porque el modelo anterior no almacenaba alelos biparentales.

Guardado local cada 12 segundos y tras intervenciones. Sin sincronización ni avance con la página cerrada. Una pestaña oculta avanza con menor frecuencia, sujeta a suspensión del navegador. Límites: 126 vivos, 64 cadáveres en el modelo (32 cuerpos detallados visibles), 420 plantas, 180 depósitos de nutrientes y 500 registros recientes de difuntos. El exceso de restos se convierte en nutrientes sin descartarlos. El modo detalle bajo y los límites evitan crecimiento de recursos sin control.

## Archivos

- `simulation.js`: conductas, sexos, reproducción, clima, hábitats, expansión y nutrientes.
- `genetics.js`: semillas, alelos, expresión, herencia y mutación.
- `world.js`: terreno, cámaras, anatomía, IK, poses, instancias y calidad.
- `culture.js`: materiales, aprendizaje, memoria social, agrupaciones observadas y expansión autónoma.
- `notifications.js`: cola FIFO con nodos estables y temporización independiente.
- `sound.js`: voces y eventos sonoros sintetizados con Web Audio.
- `app.js`: interfaz, fichas, diario, rendimiento, planificación y guardado.

## Verificación

`node scripts/verify-emergence.mjs`: cola de notificaciones, materiales, obstáculos/cobijo, aprendizaje, migración y 20 minutos de actividad autónoma. Resultados en `verification-emergence.json`.


`node scripts/verify.mjs` comprueba herencia, mutaciones, cortejo, gestación, linajes, nutrientes, crecimiento vegetal, migración desde un estado real de v1, persistencia, expansiones, confinamiento acuático/terrestre, semillas únicas, transformaciones finitas y presupuesto celular. Ejecuta una hora simulada y mide preparación CPU para 126 criaturas. El resultado está en `verification.json`; excluye GPU, WebGL y layout del navegador.

Servir localmente: `python -m http.server 8080 --directory dist`. El sitio requiere HTTP y WebGL; no abrir con `file://`.
