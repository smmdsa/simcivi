# IV.7.2 · Primera pasada de rendimiento

La vida sigue en las cinco semillas observadas hasta el día 20. Rubrón es la única familia animal extinguida de forma consistente; todavía faltan 130 días del diagnóstico. Esta entrega acelera el trabajo y regula el transporte visual sin cambiar la regla de supervivencia.

## Cambios

- Las consultas vecinales conservan el orden y la prueba final de distancia geodésica, pero descartan candidatos lejanos con una distancia de cuerda precalculada en el índice. Esto no cambia qué animales o plantas entran en el resultado.
- El worker de simulación espera la confirmación del estado anterior antes de publicar otra actualización ordinaria. Si la vista se retrasa, salta imágenes intermedias, no pasos de simulación ni eventos. Guardados, reinicio e intervenciones todavía solicitan estados completos inmediatamente.
- La vista reconstruye solo el índice de identidades que realmente consulta; la autoridad del worker sigue construyendo los índices ecológicos para cada paso. La plantilla visual de cada genoma memoriza sus variaciones de patrón para evitar hashes por célula en cada fotograma. Se mantienen el LOD, el descarte y los límites de instancias existentes.

## Evidencia y límites

Con la semilla 1726312000000, 800 pasos de 0,1 s dieron el mismo SHA-256 de `JSON.stringify(sim.snapshot())` antes y después: `54acd86fbee3d278e1067229c76b8c1d9ab0eda6d7441b39782cc3a173e399be`. En ejecuciones individuales de Node en este entorno, el tiempo del tramo bajó de 4,72 a 4,43 s, aproximadamente 6 %. Terminó con 119 animales y 2.400 plantas. La prueba integrada comprueba independencia de render y transporte, persistencia y evolución; no establece FPS real ni una aceleración igual en mundos densos. La entrega preserva el paso y el orden biológico.

No se divide una misma jornada biológica entre varios workers: depredación, nacimiento, alimento, geología y memoria comparten un estado mutable y un orden determinista. Partirlo exige un protocolo de fases, barreras y mensajes, más coste de copia y pruebas de equivalencia. Los workers adicionales sí sirven ya para corridas independientes de diagnóstico, con límite de CPU y memoria por proceso.

## WebGPU y geometría

El proyecto incluye Three.js r170, un `WebGLRenderer`, shaders `ShaderMaterial` y modificaciones `onBeforeCompile`. La [guía oficial de Three.js](https://threejs.org/manual/pages/webgpurenderer) aclara que esos dos mecanismos de shaders no funcionan con `WebGPURenderer`: primero hay que portar materiales a TSL y migrar la medición de GPU y el ciclo de render. Activar WebGPU solo por detección del navegador ocultaría partes del planeta. Se conserva WebGL y se mejora la geometría instanciada existente. Próxima etapa: portar un material aislado a TSL, comprobar aspecto y tiempos GPU/P95 en ambos backends y después migrar el resto por partes.

Quedan por medir con un navegador real 400, 1.000 y 4.000 animales, con CPU de simulación, tiempo de preparación visual, tamaño del transporte, P95 del fotograma y tiempos de guardado. Un paso demasiado caro aún puede atrasar el reloj simulado; no se promete 60 FPS ni que el tiempo biológico siempre alcance el tiempo de pared.
