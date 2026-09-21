# IV.6 · La vida pequeña

## Qué cambia

La biosfera incorpora productores fotosintéticos y fitoplancton, descomponedores, microfauna del suelo y zooplancton. Son poblaciones agregadas en las 512 celdas del ambiente, no miles de criaturas con esqueletos. Tienen reservas activas y latentes finitas, alimento, mortalidad, linajes y variantes heredables. Los productores forman colonias visibles; la microfauna se representa con pequeños indicadores móviles ampliados.

La vida puede persistir y proliferar después de perder los animales grandes. No se crean automáticamente nuevas especies animales, insectos individuales, aves o civilizaciones. La macrofauna actual conserva su genética diploide, herencia y mutaciones existentes. Esta versión añade evolución acotada a los nuevos gremios, no una transición completa desde bacterias hasta vertebrados.

## Investigación aplicada

- [NASA, Ocean Worlds](https://science.nasa.gov/solar-system/ocean-worlds/): habitabilidad requiere considerar agua, energía y química disponible. La simulación consulta luz, humedad, temperatura y recursos; no afirma simular abiogénesis.
- [Locey et al. (2017)](https://www.frontiersin.org/journals/microbiology/articles/10.3389/fmicb.2016.02040/full): recursos y costes energéticos modifican dormancia y persistencia en modelos microbianos. Aquí la dormancia reduce pérdidas, pero no elimina mortalidad.
- [Dunhill et al. (2024)](https://www.nature.com/articles/s41467-024-53000-2): interacciones tróficas pueden producir cascadas de extinción y la recuperación funcional puede preceder a la de diversidad. Por eso implementamos primero productores, reciclaje y microconsumidores.
- [Lennon y Jones (2011)](https://www.nature.com/articles/nrmicro2504): revisión de reservas microbianas y diversidad latente. El guardado conserva las variantes dormantes.

Las fuentes fundamentan relaciones cualitativas. Los coeficientes, tamaños visuales y tiempos acelerados son decisiones de diseño. No hay una secuencia universal obligatoria de evolución, ni una receta científica establecida que garantice el origen de vida en un planeta vacío.

## Diagnóstico reproducido

Con `main` en `cd77dd1`, dos semillas inicializadas con 1726312000000 y 1726312000001 fueron simuladas durante 150 días a pasos de 0,1 segundos. Los animales desaparecieron en los días 25 y 35 respectivamente. La vegetación sobrevivió: 756 y 1.001 plantas al día 150, dominadas por helechos. El registro de muerte acumuló 224/219 muertes por falta de alimento y 78/75 por depredación. No fue una esterilización del planeta.

El consumo anterior eliminaba una planta entera en cada bocado. Ahora el pastoreo extrae hasta 0,85 unidades de biomasa, deja 0,15 de raíces, reduce crecimiento y entrega energía proporcional al alimento realmente tomado. Las plantas siguen envejeciendo, sufriendo estrés y muriendo; las raíces no son invulnerables. Esta es una corrección dirigida del ciclo alimentario; dos corridas no prueban una causa única para todas las partidas.

Cambio de selección pendiente de profundizar: el cuello heredado ya no multiplica las calorías obtenidas de un helecho. La energía del bocado depende de su biomasa; una futura ventaja de cuello deberá actuar sobre el acceso o la eficiencia, con costes explícitos. El rasgo sigue heredándose, pero se retira esa ventaja alimentaria anterior.

Informes originales: [semilla 1](verification/ecology-baseline-1.json), [semilla 2](verification/ecology-baseline-2.json). `scripts/diagnose-ecology.mjs` permite repetir un censo diario, registrar todas las muertes y conservar checkpoints antes/durante la extinción.

## Resultado integrado disponible

Las corridas nuevas se interrumpieron después de **70 días** cada una; no completaron el objetivo de 150. Los informes conservados son [semilla 1](verification/ecology-after-1.json) y [semilla 2](verification/ecology-after-2.json).

Estos informes preceden a la corrección final de redondeo en el consumo microbiano. Esa corrección evita biomasa negativa infinitesimal que impedía cargar algunos guardados; pasó una regresión específica y una recarga tras un día completo. Las corridas extensas deberán repetirse con la versión final antes de considerar cerrado el balance a largo plazo.

| Al día 70 | Semilla 1 | Semilla 2 |
|---|---:|---:|
| Animales | 384 | 384 |
| Familias animales supervivientes | 5 de 6 | 5 de 6 |
| Plantas | 1.198 | 1.211 |
| Tipos vegetales supervivientes | 2 de 5 | 2 de 5 |
| Semillas en reserva | 1.097 | 795 |

La persistencia mejora respecto de las extinciones totales de fauna de `main` en los días 25/35, pero los depredadores desaparecen en ambas corridas. Sobreviven helechos y algas, y aumenta el peso relativo de los animales acuáticos. **No está demostrada la estabilidad de la diversidad ni la recuperación de fauna extinta.** El límite de 384 animales también condiciona la composición. El mayor desvío absoluto observado del balance microbiano fue menor que 3 × 10⁻⁷ unidades del modelo.

Quedan pendientes completar los dos mundos a 150 días y observar la interfaz en un navegador con GPU. Por eso la entrega se presenta en un PR borrador. El censo diario y los guardados periódicos del diagnóstico permiten continuar investigando sin atribuir al modelo resultados aún no medidos.

## Reglas y contabilidad

- Productores: mineral + luz + humedad → biomasa. La luz aporta energía, no material.
- Descomponedores: detritos → crecimiento y mineralización.
- Microconsumidores: productores acuáticos o descomponedores del suelo → crecimiento y detritos.
- Metabolismo y muerte devuelven cuota material a detritos; la reserva latente también se agota.
- Dispersión: transferencias entre celdas vecinas del mismo hábitat, aplicadas después de calcularlas.
- Compost: 30% de cada aporte existente entra en detritos; el resto sigue al suelo. Las plantas absorben una cantidad acotada del mineral microbiano; los herbívoros pueden pastar colonias accesibles.

El balance es `masa de la biosfera = masa inicial + importaciones − exportaciones`. Incluye mineral, detritos y cuotas activas/latentes. No es un balance global de carbono/nitrógeno del ecosistema anterior, cuyo crecimiento vegetal y metabolismo son aproximados.

## Evolución y recuperación

Cada variante tiene óptimo térmico, amplitud térmica y tolerancia a sequía. Una tolerancia más amplia reduce su velocidad potencial de crecimiento. La descendencia puede heredar una mutación aleatoria independiente de la temperatura y las muertes; el ambiente determina su éxito posterior. Se conservan progenitor, linaje raíz y generación.

Hasta tres variantes por gremio y celda limitan memoria y complejidad. Cuando están ocupadas, no se reemplaza una variante viable para fabricar progreso evolutivo. Esto limita la innovación en comunidades saturadas: no es evolución abierta ilimitada.

La reactivación depende de reservas, comida y condiciones; no hay un temporizador de tres días ni una aparición obligatoria al día 23. El ritmo anterior queda como objetivo de calibración para una futura entrega de sucesión macroscópica. Un mundo sin ninguna reserva viva continúa estéril. La presencia de minerales por sí sola no crea organismos.

## Observatorio

**La vida resiste → La vida pequeña** muestra los tres gremios, biomasa activa y latente, colonias, variantes y generación máxima. Los enlaces enfocan colonias y muestran la variante productora dominante. El texto de escena diferencia ausencia de animales grandes y estado microscópico. El documental puede seguir acontecimientos de recuperación situados.

Límites: 4.608 cohortes como máximo; 256 colonias y 256 indicadores de microfauna; el nivel visual reducido muestra hasta 96 colonias. El reloj del worker es independiente de la cámara. La biomasa usa unidades del modelo, no cantidades de individuos terrestres.

## Guardado

Formato 8, compatible con cargas 2–7. La primera migración inicializa una cantidad finita declarada de vida microscópica previamente no modelada; es una hipótesis de ampliación del mundo antiguo. Un guardado v8 con reservorios vacíos no recibe nueva vida; un estado ausente o dañado produce un error visible.

Se usa IndexedDB con transacciones atómicas para superar la cuota pequeña de localStorage. Si no existe una partida nueva, se lee la clave anterior `vespera-world-v2` y se conserva ese original. Sin IndexedDB se mantiene el guardado antiguo como alternativa, sujeto a su cuota. Errores de permisos, cuota o datos no se presentan como guardados exitosos. El guardado regular sigue cada 12 segundos; cerrar el navegador bruscamente puede perder los cambios posteriores al último guardado confirmado.

## Verificación y límites

`npm test` incorpora las verificaciones anteriores, el censo, la biosfera, integración, visuales y persistencia. Se comprueban transferencias conservativas, esterilidad, latencia, ausencia de fotosíntesis sin luz, selección diferencial, mutaciones no dirigidas, límites, guardado JSON, migración, worker y ausencia de efectos del render en datos. Cuatro crisis seguidas de recuperación abarcan 228 días en un fixture reducido de cuatro celdas; no equivalen a un planeta completo durante ese período.

`npm run diagnose:ecology -- 1726312000000 150 output.json` ejecuta 150 días completos. Las mediciones CPU no certifican FPS reales de navegador o GPU. La validación visual automatizada usa geometría Three.js con renderer inyectado.

## Siguiente desarrollo

1. Insectos individuales con desarrollo, diapausa, detritivoría y polinización.
2. Más nichos marinos, oxígeno disuelto y consumidores bentónicos/pelágicos.
3. Aves con vuelo, reproducción, dieta y migración que dependan de esa red.
4. Especiación y radiación de nuevas formas macroscópicas desde linajes supervivientes, con costes y registro de procedencia.
5. Sociedades e historia persistente sobre esas bases.

La siguiente entrega concreta es un detritívoro y un polinizador con ciclo huevo → larva → adulto, reservas de diapausa y descendencia registrada. Antes de incorporarlos hay que quitar los supuestos de seis familias en `simulation.js` y `ecology-census.js`, separar dieta/hábitat del identificador numérico y conservar los presupuestos del worker y del render. La microfauna actual seguirá siendo agregada: sus indicadores no se convertirán retrospectivamente en insectos con genealogía inventada.

Para aceptarla: consumo de detritos descontado del depósito local; puesta con coste parental; ninguna eclosión desde huevos inviables; polen trasladado entre plantas compatibles sin crear semillas o nutrientes gratis; variantes heredadas con supervivencia diferencial; guardado que conserve huevos, etapas y linajes. La diversidad de plantas y la disponibilidad de presas deberán medirse junto con el total de animales. Añadir especies sin alimento persistente repetiría el problema diagnosticado.
