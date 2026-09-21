# Véspera · Estado y tareas

Actualizado: 21 de septiembre de 2026. Fuente de estado: PR #3 mergeado en `main` (`1c121932f956a6ef3ea50250db75790efb39a530`) y publicación de [Véspera en Sites](https://vespera-biodigital.mrtiagosan.chatgpt.site) confirmada. Este tablero distingue implementación, publicación y validación.

## Completado

- [x] IV.4: clima autónomo, estaciones, ciclo de agua y respuesta ambiental local.
- [x] IV.5: cuencas, infiltración, erosión, placas, fallas, sismos y volcanes.
- [x] IV.6: productores/fitoplancton, descomponedores y microconsumidores agregados en 512 celdas; reservas finitas y dormancia.
- [x] Reciclaje, dispersión, variantes heredables con costes y selección ambiental; sin regeneración desde un mundo totalmente estéril.
- [x] Pastoreo parcial que conserva raíces y entrega energía según el alimento consumido.
- [x] Colonias visibles y observatorio de biomasa, reservas, variantes y linajes.
- [x] Guardado v8, migración 2–7, IndexedDB atómico y manejo de errores de permisos, corrupción y redondeo.
- [x] Suite completa, revisión independiente y recarga de un diagnóstico de un día tras la corrección final.
- [x] Merge y publicación. Se corrigió una primera publicación con archivos antiguos; el nuevo paquete coincide con los 29 archivos estáticos de main.

## Evidencia y límites

Las dos corridas de referencia anteriores duraron 150 días; la fauna se extinguió en los días 25/35. Las corridas nuevas preliminares llegaron a 70 días, con 384 animales, cinco familias y dos tipos vegetales en ambas. Se perdieron los depredadores. Esos resultados preceden a la última corrección de precisión y no certifican el comportamiento prolongado de la versión final.

Las pruebas reducidas abarcan cuatro crisis y recuperaciones durante 228 días sobre cuatro celdas. No equivalen a mundos completos. La revisión geométrica usa Three.js sin navegador/GPU. Las mutaciones tienen un máximo de tres variantes por gremio/celda: todavía no hay evolución abierta ilimitada.

## P0 · Siguiente tarea: validar y calibrar IV.6

- [ ] Ejecutar las semillas `1726312000000` y `1726312000001` durante 150 días cada una, con la corrección final, informes diarios y checkpoints.
- [ ] Verificar continuidad desde guardados intermedios; registrar biomasa, balance, diversidad, nacimientos y mortalidad por causa.
- [ ] Investigar pérdida de depredadores, desaparición de tres tipos vegetales y efecto del límite compartido de 384 animales. Las correcciones deben responder a mecanismos medidos, sin respawn ni supervivencia garantizada.
- [ ] Revisar en navegador el observatorio, enfoque de colonias, migración/recarga y rendimiento real de CPU/GPU.

**Cierre:** informes completos de ambos mundos, recargas verificadas, resultados de navegador y causas documentadas de las pérdidas observadas. Cerrar una prueba no significa garantizar que todas las especies sobrevivan.

## Funcionalidades siguientes, en orden

| Prioridad | Entrega pendiente | Condición de cierre |
|---|---|---|
| P1 | Insecto detritívoro y polinizador individuales | Huevos, larvas, adultos, diapausa y linajes; alimento y reproducción con costes; polen trasladado sin creación gratuita de semillas; persistencia de todas las etapas. |
| P2 | Red marina ampliada | Oxígeno disuelto, consumidores bentónicos/pelágicos y recursos locales; medir efectos sobre supervivencia y cadena alimentaria. |
| P3 | Aves | Vuelo, dieta, reproducción y migración ligados a recursos y presas existentes; costes y herencia observables. |
| P4 | Radiación macroscópica | Nuevas formas procedentes de linajes supervivientes; procedencia y costes registrados, sin temporizador de aparición obligatoria. |
| P5 | Memoria histórica y sociedades | Mapas/timelapses del punto 8; comunidades persistentes, instituciones y crónica sustentadas en eventos reales. |
| Backlog D | Tormentas organizadas | Presión, circulación y energía que permitan formación y disipación; la lluvia intensa por sí sola no se etiqueta como ciclón. |

Antes de P1, retirar los supuestos fijos de seis familias y separar dieta/hábitat del identificador numérico sin ampliar sin control los presupuestos. Revisar el efecto alimentario del cuello mediante acceso o eficiencia con costes; el multiplicador anterior de calorías de helecho fue retirado.

La microfauna actual es agregada: todavía no hay insectos individuales ni aves. Tampoco se reconstruyen civilizaciones extintas. La recuperación de vida compleja desde microorganismos permanece pendiente.

## Documentos vinculados

- [Roadmap general](ROADMAP-V4.md)
- [Naturaleza y sociedades](PLANET-SOCIETIES-ROADMAP.md)
- [IV.6: investigación, resultados y reglas](V4-BIOSPHERE.md)
- [Plan ejecutado y validaciones pendientes](superpowers/plans/2026-09-20-ecological-continuity.md)
