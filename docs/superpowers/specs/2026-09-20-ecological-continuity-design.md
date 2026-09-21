# Continuidad ecológica · IV.6

## Intención y alcance autorizado

El usuario pide investigar y ampliar el ciclo de vida, aceptando extinciones pero haciendo posible la recuperación natural, con microbiología, más vida acuática, pequeños animales, aves y adaptación heredable. Autoriza organizar el plan e implementar ahora lo necesario. Esta entrega construye la base trófica: productores microscópicos, descomponedores y microconsumidores terrestres/acuáticos, dormancia finita, selección de variantes y colonias observables. Insectos individuales, aves y radiaciones de macrofauna requieren entregas posteriores. La recuperación no restaura civilizaciones, conocimientos ni animales extintos.

## Bases científicas y decisiones de diseño

- [NASA: Ocean Worlds](https://science.nasa.gov/solar-system/ocean-worlds/): agua líquida, compuestos orgánicos y energía son condiciones relevantes para la vida conocida. Tener condiciones habitables no demuestra ni garantiza abiogénesis. Usamos agua, temperatura, luz y recursos locales; no modelamos química prebiótica.
- [Locey et al., 2017, Microscale Insight into Microbial Seed Banks](https://www.frontiersin.org/journals/microbiology/articles/10.3389/fmicb.2016.02040/full): su modelo conecta dormancia, recursos y costes energéticos. Representamos biomasa activa y latente; mantener tolerancias amplias y reservas tiene un coste.
- [Dunhill et al., 2024](https://www.nature.com/articles/s41467-024-53000-2): reconstruyen redes marinas y cascadas de extinción; la recuperación funcional y la de diversidad no coinciden necesariamente. Priorizamos productores, reciclaje y consumidores pequeños antes de añadir depredadores superiores.
- [Lennon y Jones, 2011](https://www.nature.com/articles/nrmicro2504): síntesis sobre reservas microbianas y diversidad latente. Conservamos linajes durante dormancia; las mutaciones aparecen en descendencia, independientemente del ambiente.

Los coeficientes y tiempos son decisiones de una simulación acelerada, no parámetros terrestres calibrados. No existe una escalera obligatoria bacteria → insecto → ave → civilización. Las colonias visibles son agregados de productores existentes; no plantas complejas aparecidas desde bacterias.

## Arquitectura

`Biosphere` usa las 512 celdas ambientales ya existentes, tres gremios y hasta tres variantes por gremio/celda. Mantiene su RNG, relojes, linajes, cuotas materiales, reservas y estadísticas serializables. Avanza a 1 Hz dentro del worker; la cámara no altera sus decisiones. No agrega miles de animales al bucle de IK.

Cada celda conserva mineral, detritos y cohortes con biomasa activa/latente. Los productores consumen mineral con luz y agua; los descomponedores procesan detritos y remineralizan; los consumidores comen productores (plancton) o detritos (suelo). Mortalidad, metabolismo, dormancia, reproducción y dispersión transfieren cuotas existentes. El libro de cuentas verifica masa inicial + importaciones − exportaciones. Es un balance del nuevo subsistema, no una certificación de masa global del modelo anterior.

Los rasgos heredables son óptimo térmico, amplitud térmica y tolerancia a sequía. Amplitud y resistencia reducen el crecimiento potencial. La descendencia muta sin consultar temperatura ni causas de muerte. Selección significa crecimiento/supervivencia diferencial. La dispersión es local y no cruza arbitrariamente hábitats marinos/terrestres.

La integración recibe parte del compost antes de depositar el resto en suelo; exporta nutrientes a plantas con coste y ofrece pastoreo real de colonias a herbívoros cercanos. No crea animales ni semillas de especies desaparecidas. Las colonias y la microfauna agregada se muestran en geometría acotada y en el observatorio.

## Persistencia y migración

Guardar formato 8; cargar 2–7 mediante las migraciones existentes. La primera carga sin biosfera inicializa una reserva finita declarada: representa vida microscópica previamente no modelada. Es una ampliación del estado inicial, no evidencia de que existía en un guardado antiguo. La carga v8 conserva también un reservorio totalmente vacío, sin reinicializarlo. Fallar de forma visible si falta/corrompe su estado, en vez de regenerar vida silenciosamente.

## Diagnóstico y aceptación

- Dos semillas deterministas, 150 días completos antes/después; censos diarios y mortalidad por causa, checkpoints previos y de extinción.
- Estado finito/acotado, masa conservada en la biosfera, ausencia de creación en mundos esterilizados, ausencia de crecimiento productor sin energía/recursos, latencia y recuperación condicional, herencia y costes demostrables, continuación JSON exacta.
- Migración idempotente, worker/decoder/vista preservan el subsistema y guardan su estado vacío.
- Crisis repetidas durante cientos de días en el modelo reducido; suite previa verde.
- Máximo 512 celdas, 4.608 cohortes, 256 colonias renderizadas y 256 marcadores de microfauna; muestras históricas acotadas. Medir CPU/transporte; no certificar GPU sin navegador real.
- El día sigue siendo 160 segundos y el paso biológico 0,1 s. Ningún cambio de cámara/velocidad altera la sucesión.

## Roadmap posterior

1. Insectos detritívoros y polinizadores individuales: huevos/larvas/adultos, diapausa y vuelo con costes.
2. Red marina: productores, zooplancton y consumidores bentónicos/pelágicos diferenciados; oxígeno y nutrientes limitantes.
3. Aves: vuelo, anidación, dispersión y migración alimentadas por insectos/semillas/presas.
4. Radiación de nuevos linajes macroscópicos mediante un modelo explícito de especiación y transiciones, sin resucitar identidades.
5. Comunidades, instituciones y memoria histórica sobre una ecología estable.
