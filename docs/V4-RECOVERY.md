# V4.2 — La vida resiste

Punto 9 del roadmap: recuperación ecológica mediante reservas finitas, dormancia y microrefugios. La partida continúa con las mismas identidades y linajes. No se programan repoblaciones al detectar una extinción.

## Semillas que pueden esperar

La reproducción vegetal y la dispersión animal intentan establecer descendientes. Si el clima o el límite de vegetación impiden hacerlo, las semillas pueden quedar en una reserva local de hasta 1.200 unidades. Cada una conserva posición, variedad, progenitor, semilla visual, genes ya heredados y mutados, edad, viabilidad y progreso de germinación. Despertar no vuelve a sortear su genética.

Las semillas necesitan humedad y temperatura adecuadas durante varias observaciones antes de brotar. Los umbrales varían entre las cinco variedades. El agua y la tierra son hábitats distintos: las algas no colonizan tierra seca y las especies terrestres no se convierten en algas al caer al agua. La viabilidad se agota: dispersión heredada y protección local influyen en cuánto dura. Las semillas agotadas devuelven una pequeña cantidad de nutrientes al suelo.

Al actualizar una partida sin este sistema, hasta 160 plantas maduras fértiles dejan una reserva inicial, con coste de biomasa. Las flores necesitan estar polinizadas. Esta operación ocurre una sola vez; recargar no rellena la reserva.

Se elimina la llegada continua de plantas fundadoras. El viento desplaza semillas existentes. Los cadáveres fertilizan, pero no generan hongos de la nada. Después de la creación inicial del mundo, los brotes proceden de reproducción, semillas existentes o de la intervención explícita Sembrar.

## Plantas en reposo

Tras doce segundos de estrés local sostenido, plantas suficientemente desarrolladas repliegan su crecimiento. La vegetación dormante se ve más baja y apagada y deja de ofrecer alimento y cobertura de copa. El suelo puede alimentar sus reservas, pero no forzar el crecimiento de la parte visible durante el reposo.

La edad avanza al 8% y se consumen reservas. Veinte segundos favorables permiten volver a crecer. La duración máxima del reposo y la biomasa restante limitan la supervivencia: las raíces también pueden morir. Las plantas tienen los mismos ciclos de senescencia y retorno de nutrientes existentes.

## Animales y microrefugios

El estrés depende de temperatura, humedad y escasez local de alimento. Los individuos pueden buscar un lugar próximo con condiciones más suaves, mediante el movimiento habitual y sus restricciones de hábitat. Si no encuentran uno, pueden intentar conservar energía donde están. No se teletransportan.

En letargo, el gasto basal es el 18% del normal; continúan envejeciendo y consumiendo reservas. No comen, construyen, cortejan ni se reproducen mientras duermen. No entran durante cortejo o gestación. Se despiertan cuando mejora el entorno y hay alimento, ante un depredador o ataque, cuando necesitan energía, o al alcanzar un límite de duración determinado parcialmente por su aislamiento heredado. El hambre todavía puede matarlos.

La animación usa postura de descanso, ojos reducidos y respiración lenta. Las fichas indican el estado, letargos, despertares y amortiguación ambiental.

Los microrefugios se calculan a partir del agua, la proximidad a ríos, cobertura vegetal y materiales colocados. Modifican temperatura y humedad locales. Al retirar materiales o perder vegetación desaparece su contribución. El observatorio identifica núcleos de vegetación activa en esos lugares; no son zonas invulnerables.

## Observar la recuperación

El botón **La vida resiste** muestra reservas, plantas en reposo, animales en letargo, semillas agotadas y brotes recuperados. Resume cada región y permite acercarse a un microrefugio observado. Los acontecimientos de repliegue, despertar y germinación aparecen en el diario y pueden ser elegidos por la cámara documental.

De cerca, pequeñas cápsulas doradas representan reservas superficiales. La reserva sigue existiendo en datos cuando no se dibuja. Hasta 240 cápsulas visibles, instanciadas, con descarte por distancia y horizonte. La vegetación dormante conserva el LOD habitual.

## Reloj, límites y persistencia

- Paso biológico: 100 ms. Respuestas ambientales y reservas: cada dos segundos simulados.
- Hasta 80 semillas examinadas y 16 germinaciones de reserva por actualización; se recorre la reserva por turnos, sin favorecer siempre las primeras.
- Hasta seis búsquedas nuevas de microrefugio por actualización. Índices espaciales esféricos para alimento y depredadores.
- Reproducción vegetal: presupuesto ampliado a 80 plantas cada dos segundos para sostener el ciclo sin el aporte artificial anterior.
- Hasta doce microrefugios observados por región, 48 en total.
- Se guardan temporizadores, semillas, viabilidad, genética, estados y contadores. Los datos derivados de clima y aptitud de cada criatura se recalculan y no se duplican en las transferencias del worker ni en el guardado.
- Las regiones fuera de cámara siguen evolucionando. No se exige intervención ni reinicio de partidas.

## Límites del modelo

Una recuperación es posible, no garantizada. Las especies animales extintas no reaparecen. Si desaparecen todas las plantas, raíces vivas y semillas viables, ni lluvia, ni abono, ni viento recrean vegetación. Sembrar permite intervenir voluntariamente.

Se mantienen la geografía y los ríos analíticos de V4: no se añade hidrología completa ni agotamiento físico de océanos y acuíferos. La dormancia es una regla de diseño con parámetros acotados, no una calibración biológica de especies reales. La cámara describe cambios registrados; no los provoca.

## Verificación

`npm test` incluye pruebas causales de dormancia, consumo de energía y envejecimiento, bloqueo reproductivo, despertar, ventajas y pérdida de refugios, viabilidad finita, germinación heredada, ausencia de respawn, migración y continuidad durante una crisis. También ejecuta un ecosistema completo antes, durante y después de una sequía calurosa, además de los veinte minutos de funcionamiento normal y las regresiones existentes.

Informes: `verification-recovery.json`, `verification-crisis.json` y `verification-v4.json`. Las mediciones son de lógica y CPU con geometría Three.js; no certifican GPU ni 60 FPS en todos los equipos.
