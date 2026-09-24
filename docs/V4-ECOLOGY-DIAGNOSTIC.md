# IV.7.1 · Diagnóstico ecológico controlado

La primera prioridad es establecer qué ocurre después de retirar el cupo animal. Las cinco semillas y el paso de 0,1 segundos están fijados antes de observar resultados en [el manifiesto](verification/ecology-seeds.json). Un día equivale a 160 segundos simulados y 1.600 pasos, como en el worker. Los resultados previos de paso 0,2 quedan separados.

```sh
node scripts/run-ecology-batch.mjs /ruta/a/checkpoints-migrados
```

El comando reanuda desde los checkpoints que ya existan en el directorio indicado. Cada salida `<semilla>.json` contiene revisión de Git, hash SHA-256 de los módulos `dist/*.js`, semilla del mundo, paso, días completados, tiempo de proceso y filas diarias. El checkpoint contiene además el estado íntegro. Se escribe primero en un archivo temporal y luego se reemplaza atómicamente, ahora al final de **cada día**. Si el informe quedó más viejo por una interrupción, la reanudación toma el checkpoint; nunca vuelve a ejecutar días ya confirmados. Un cambio en el código de simulación detiene la reanudación para impedir mezclar experimentos.

El censo registra las seis familias y las cuatro regiones, hambre, energía, gestaciones, preparación para cortejo, nacimientos, muertes por causa, plantas, biomasa, semillas, nutrientes y migraciones. `accessibleFood` estima si hay plantas viables o presas/carroña dentro de la búsqueda inmediata; no garantiza una ruta transitables, ni incluye biofilm. Un cero representa ausencia de estas fuentes en el radio, no necesariamente escasez total del mundo. Los checkpoints inmediatamente anteriores y posteriores al cruce bajo 20 animales y a la extinción se guardan para reconstruir la crisis, si ocurre.

## Resultado controlado hasta el día 20

Las cinco semillas alcanzaron el día 20 con paso 0,1. Los informes diarios completos están comprimidos en `verification/ecology-v4.7.1/<semilla>.json.gz`; los checkpoints originales se entregaron por separado en `vespera-iv7.1-checkpoints-day20.zip`. La optimización posterior cambió el hash del código: el script rechaza correctamente los originales y exige una migración validada. Las cifras siguientes no son una extrapolación a 150 días.

| Semilla | Animales día 10 → 20 | Nácares día 20 | Último día con Rubrones | Tiempo acumulado |
| --- | ---: | ---: | ---: | ---: |
| 1726312000000 | 265 → 1.169 | 869 | 14 | 979 s |
| 1726312000001 | 320 → 1.546 | 930 | 18 | 1.583 s |
| 1726312000002 | 303 → 1.162 | 844 | 13 | 1.279 s |
| 1726312000003 | 265 → 1.378 | 771 | 11 | 1.330 s |
| 1726312000004 | 270 → 1.193 | 636 | 18 | 1.149 s |

Al día 20 las cinco poblaciones terrestres restantes estaban en la región 2. El Rubrón desapareció entre los días 12 y 19 en todas las semillas, con 20–21 muertes por hambre registradas por semilla. El mundo se inició con 12 Rubrones repartidos entre las regiones 0 y 1; ninguno fue fundado en la región 2, que conservó herbívoros. Esto explica la ausencia de depredadores en ese refugio, pero no basta para atribuir todas las muertes a un fallo de navegación. Hay que inspeccionar trayectorias, barreras y presas accesibles antes de alterar las reglas.

Las cinco corridas llegaron al límite existente de 2.400 plantas y mantuvieron entre 1.093 y 1.949 algas. La biomasa microscópica conservó un error numérico inferior a 4 × 10⁻⁸ en el día 20. La abundancia de algas y los nacimientos de Nácares permiten crecimiento temporal; todavía no se conoce el equilibrio o colapso posterior. Tres variedades terrestres desaparecieron en todas las semillas: solo quedaron helechos y algas. Este patrón requiere analizar requisitos de polinización, dispersión y acceso local, sin agregar alimento ni restaurar especies por temporizador.

El coste impide cerrar la matriz larga por ahora: la primera semilla acumuló 191 s hasta el día 10 y 979 s hasta el día 20; las demás consumieron entre 1.149 y 1.583 s hasta el día 20 en ejecución concurrente. Se interrumpieron después del checkpoint completo, conservando el estado. El tiempo acumulado incluye competencia por CPU entre las cinco corridas y no es una medida aislada de FPS de navegador.

## Perfil y primera optimización · 23 de septiembre

Se cargó el checkpoint del día 20 de la semilla 1726312000000 (1.169 animales, 2.400 plantas). El perfil de CPU de 100 pasos de 0,1 encontró costes dominantes en distancia geográfica, búsqueda de vecinos y vínculos sociales. La búsqueda espacial ahora conserva las coordenadas cartesianas en sus buckets y descarta por cuerda los candidatos lejanos antes de calcular la distancia esférica exacta. Mantiene el mismo recorrido y el mismo criterio final de inclusión. La prueba de radios y tamaños de bucket compara también el orden de resultados alrededor de la costura longitudinal.

En esta máquina, 100 pasos tomaron 6,3 s antes y 5,7 s después, medidos por separado sin carga comparable garantizada: una mejora indicativa cercana al 10 %, no una medición de FPS. El JSON completo del snapshot tras esos pasos coincidió byte a byte (SHA-256 `adfa4b2a3a6a49887c22c6ae0dd68928032fcc4fdcbbc3e38cc532bae47dcd33`). El cambio no altera las reglas de alimentación, reproducción ni energía.

## Migración controlada y continuación · 24 de septiembre

Se recuperó la distribución JavaScript exacta que produjo los checkpoints originales: SHA-256 de los módulos `dist/*.js` `3e67508fcd976cc4b02395a59840f883ce6ddc9814540e81cfa383b5d5bcdab4`. La revisión Git escrita en esos checkpoints (`0677503a9f4add37ceaf27652490de66ec263916`) no reconstruye por sí sola estos archivos; por eso el hash de los módulos y su copia íntegra acompañan a la evidencia. El código actual tiene hash `c63d426f38d775943f05199782056c2ae45952a3443d4ea02a493b0c1586ff83`.

`scripts/migrate-ecology-checkpoints.mjs` comprueba el hash original, conserva los archivos originales y carga el mismo snapshot en ambas versiones. Ejecuta **1.600 pasos de 0,1 por semilla**, equivalentes a un día, y exige igualdad exacta del JSON completo resultante. Las cinco comparaciones coincidieron. Cada checkpoint migrado conserva las filas y el estado del día 20, registra el hash y la revisión de origen y añade la huella SHA-256 del estado comparado. La prueba automatizada rechaza un hash de origen incorrecto y un motor con evolución divergente; verifica también la conservación de la procedencia tras reanudar.

Para reproducir la migración desde los originales, extraer `baseline/dist`, `original/<semilla>.json.checkpoint.json` y ejecutar desde la raíz del repositorio:

```sh
node scripts/migrate-ecology-checkpoints.mjs /ruta/baseline/dist /ruta/original /ruta/migrados
node scripts/run-ecology-batch.mjs /ruta/migrados
```

Las cinco semillas alcanzaron el día 21 desde los checkpoints migrados, sin recalcular los veinte días anteriores:

| Semilla | Animales día 20 → 21 | Familias presentes | Rubrones |
| --- | ---: | ---: | ---: |
| 1726312000000 | 1.169 → 1.382 | 5 | 0 |
| 1726312000001 | 1.546 → 1.754 | 5 | 0 |
| 1726312000002 | 1.162 → 1.322 | 5 | 0 |
| 1726312000003 | 1.378 → 1.548 | 5 | 0 |
| 1726312000004 | 1.193 → 1.359 | 5 | 0 |

El archivo `vespera-iv7.1-checkpoints-day21.zip` contiene los cinco checkpoints originales, los cinco nuevos informes y checkpoints, los comprobantes de migración y el código original exacto. Los checkpoints nuevos guardan el día 21 y se pueden reanudar directamente con el comando anterior, después de extraer el directorio `migrated`.

**Pendiente para ECO-01:** continuar las cinco series hasta 150 días y perfilar cargas de 1.000–4.000 animales; extender dos semillas hasta 600 días en ECO-06. Después ECO-02 investiga causas ecológicas con esos checkpoints y ECO-03 corrige solo fallos demostrados antes de IV.8. Las otras cinco familias animales sobreviven al día 21 de las cinco semillas; Rubrón es la única familia animal perdida hasta ese punto.
