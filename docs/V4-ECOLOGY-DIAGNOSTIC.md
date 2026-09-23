# IV.7.1 · Diagnóstico ecológico controlado

La primera prioridad es establecer qué ocurre después de retirar el cupo animal. Las cinco semillas y el paso de 0,1 segundos están fijados antes de observar resultados en [el manifiesto](verification/ecology-seeds.json). Un día equivale a 160 segundos simulados y 1.600 pasos, como en el worker. Los resultados previos de paso 0,2 quedan separados.

```sh
node scripts/run-ecology-batch.mjs
node scripts/run-ecology-batch.mjs
```

El segundo comando reanuda desde los checkpoints que ya existan. Cada salida `docs/verification/ecology-v4.7.1/<semilla>.json` contiene revisión de Git, hash SHA-256 de los módulos `dist/*.js`, semilla del mundo, paso, días completados, tiempo de proceso y filas diarias. El checkpoint contiene además el estado íntegro. Se escribe primero en un archivo temporal y luego se reemplaza atómicamente. Si el informe quedó más viejo por una interrupción, la reanudación toma el checkpoint; nunca vuelve a ejecutar días ya confirmados. Un cambio en el código de simulación detiene la reanudación para impedir mezclar experimentos.

El censo registra las seis familias y las cuatro regiones, hambre, energía, gestaciones, preparación para cortejo, nacimientos, muertes por causa, plantas, biomasa, semillas, nutrientes y migraciones. `accessibleFood` estima si hay plantas viables o presas/carroña dentro de la búsqueda inmediata; no garantiza una ruta transitables, ni incluye biofilm. Un cero representa ausencia de estas fuentes en el radio, no necesariamente escasez total del mundo. Los checkpoints inmediatamente anteriores y posteriores al cruce bajo 20 animales y a la extinción se guardan para reconstruir la crisis, si ocurre.

**Cierre pendiente:** analizar las cinco corridas completas de 150 días y dos extensiones a 600 días; separar fallos de reglas de extinciones ecológicas posibles. La instrumentación y una corrida breve verifican el formato, pero no prueban estabilidad prolongada. No se inicia IV.8 por el mero hecho de disponer del instrumento.
