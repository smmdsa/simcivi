# Primer roadmap de evolución — Véspera

Objetivo: contemplación autónoma, intervención opcional y evolución visible con consecuencias duraderas.

**Estado al 21 de septiembre de 2026:** IV.6 está mergeada y publicada en Sites. La validación prolongada y la diversidad trófica siguen abiertas. [Tareas actuales y prioridades](STATUS-TASKS.md).

1. **Anatomía evolutiva funcional:** siluetas, locomoción y capacidades heredadas con ventajas y costes ambientales.
2. **Paisaje que provoque evolución:** continentes, océanos, ríos, climas, estaciones, aislamiento y migraciones. Ampliación: planeta esférico y sol orbital, día/noche locales, luz que afecte a temperatura, evaporación, plantas y descanso.
3. **Transformación útil del hábitat:** transportar, colocar, retirar, reutilizar y reparar materiales; refugio y retención de humedad, sin planos de ciudades.
4. **Culturas aprendidas y perecederas:** preferencias materiales, lugares útiles y prácticas transmitidas entre padres y vecinos, con variación y pérdida.
5. **Relaciones sociales visibles:** afinidad, cuidado, tolerancia y cooperación expresados mediante movimiento.
6. **Coevolución:** semillas dispersadas, polinización, refugios e interdependencias ecológicas.
7. **Cámara documental autónoma:** observar hechos reales con planos largos y transiciones suaves.
8. **Memoria del mundo:** genealogías, mapas históricos y timelapses basados en acontecimientos registrados.
9. **Recuperación ecológica:** semillas latentes, dormancia y refugios que permitan nuevos ciclos después de crisis.
10. **Escala y detalle:** LOD, descarte visual y presupuestos de rendimiento medidos; las regiones invisibles siguen simulándose.

## Alcance V4

Primeras cuatro líneas, navegación esférica con mouse, zoom y desplazamiento, reloj de datos separado del render y migración de partidas anteriores. El sol orbital se combina con declinación estacional; el ciclo diario por sí solo no produce estaciones.

Evolución abierta no equivale a inteligencia creciente garantizada. Las familias anatómicas, acciones y utilidad están delimitadas por el diseño. [Tim Taylor: Requirements for Open-Ended Evolution](https://arxiv.org/abs/1507.07403).

## Entrega V4.1 — puntos 4, 5, 6 y 7

Completados dentro de un alcance de reglas locales acotadas:

- **4:** prácticas con procedencia, transmisión, refuerzo, olvido y pérdida colectiva registrada.
- **5:** afinidad y tolerancia, seguimiento familiar, espera, compañía y cuidados con transferencia real de energía y animación contextual.
- **6:** polinización cruzada, semillas transportadas, rasgos vegetales heredables, cobertura contra depredación y consecuencias ecológicas medibles.
- **7:** director autónomo basado en sucesos, planos largos, viajes esféricos suaves y prioridad al control manual; disponible en modo pantalla.

[Implementación, controles, presupuestos y límites](V4-LIFEWAYS.md). El punto 8 sigue pendiente: las bases de genealogía y eventos todavía no constituyen mapas históricos ni timelapses. Los puntos 9 y 10 se entregan en las versiones siguientes.

## Entrega V4.2 — punto 9

**9. Recuperación ecológica implementada:** banco finito de semillas con genética y viabilidad, dormancia vegetal, letargo animal con gasto energético y envejecimiento, búsqueda de microrefugios y recuperación observable por región. La reproducción y las reservas sustituyen la generación ambiental continua de plantas. No hay repoblación automática tras extinciones.

[Reglas, migración de partidas, pruebas y límites](V4-RECOVERY.md).

## Entrega V4.3 — punto 10

**10. Escala y detalle implementado:** descarte por horizonte y cámara, LOD con histéresis, presupuestos estrictos de células, vegetación y píxeles, calidad adaptada a P95/FPS medidos, consulta GPU opcional y transporte incremental sin pérdida. Todas las regiones conservan el mismo reloj biológico. Océano, atmósfera, nubes, estrellas y detalles de superficie se integran con el sol orbital y los niveles de calidad.

[Presupuestos, validación y límites](V4-SCALE.md). Objetivo de 60 FPS, sujeto al dispositivo; no se aumenta sin límite la población ni se garantiza ejecución en segundo plano cuando el navegador suspende la pestaña.

## Entrega V4.4 — profundización ambiental

Se profundiza el punto 2 y su conexión con el 9: clima autónomo con memoria térmica, ciclo del agua y viento local. Se eliminan los sliders climáticos. [Implementación](V4-ENVIRONMENT.md).

El nuevo [plan de naturaleza y sociedades](PLANET-SOCIETIES-ROADMAP.md) organiza riesgos, comunidades e información pública por entregas; A–C están completadas y C1 tiene su base microscópica publicada en IV.6. No sustituye ni declara terminado el punto 8 de memoria histórica.

## Ampliación ambiental · IV.5

Se completan B y C del [plan ambiental y social](PLANET-SOCIETIES-ROADMAP.md): cuencas, reservas hídricas, erosión, placas, fallas, sismos y volcanes. [Alcance y pruebas](V4-GEODYNAMICS.md). Esta entrega no cambia el estado pendiente del punto 8 del roadmap original.

## Prioridad siguiente · recuperación tras extinciones

El usuario informa de desaparición de vida cerca del día 100. C1 del [plan ambiental](PLANET-SOCIETIES-ROADMAP.md) prioriza reproducir el colapso, conservar un reservorio microbiano finito y permitir sucesión con selección heredable. IV.6 implementa esa base. El ritmo previo de colonias alrededor de 3 días y vida macroscópica unos 20 días después queda como objetivo de calibración para una futura radiación macroscópica; no se impone por temporizador.

## IV.6 · Base de continuidad ecológica

C1 recibe una biosfera microscópica finita, red trófica basal, adaptación heredable, colonias observables y pastoreo que conserva raíces. [Investigación y pruebas](V4-BIOSPHERE.md). Siguen pendientes la radiación de nuevos animales tras una extinción, insectos individuales, aves y la memoria histórica del punto 8.

## Orden de trabajo vigente

1. **Validación y balance de IV.6:** dos mundos de 150 días con el código final, recargas y revisión en navegador/GPU; investigar desaparición de depredadores y reducción de tipos vegetales.
2. **Insectos funcionales:** detritívoro y polinizador individuales; huevo, larva, adulto, diapausa y herencia con costes.
3. **Red marina ampliada:** oxígeno disuelto y nichos bentónicos/pelágicos sobre la base de fitoplancton y zooplancton.
4. **Aves:** vuelo, dieta, reproducción y migración dependientes de recursos y presas.
5. **Radiación macroscópica:** nuevas formas desde linajes supervivientes; innovación heredable acotada y procedencia visible.
6. **Memoria e instituciones:** punto 8 original, comunidades persistentes, instituciones y crónica/medios. Tormentas organizadas siguen en el backlog ambiental D.

La próxima tarea ejecutable es cerrar el punto 1. Insectos es la siguiente funcionalidad, no una funcionalidad ya entregada. C1 completo todavía no se considera terminado.
