# Véspera III: qué emerge y qué está programado

## Dos principios, varios mecanismos necesarios

1. **Variación heredable y consecuencias diferenciales.** Los alelos varían, se heredan de ambos progenitores y modifican capacidades y costes. Sobrevivir y reproducirse determina qué variantes persisten. No se suma inteligencia por generación ni existe una meta civilizatoria.
2. **Aprender de la interacción y dejar huellas.** Cada individuo elige entre acciones primitivas, evalúa consecuencias y conserva preferencias. La memoria del entorno y el aprendizaje social permiten reutilizar lo que otros dejaron o aprendieron.

Estos dos principios no bastan solos. Debemos especificar representación, materiales, percepción, acciones, costes, aprendizaje y física. Las reglas programadas delimitan qué resultados pueden aparecer. No se presenta la programación de esas posibilidades como inteligencia general espontánea.

## Fundamento consultado

- **Estigmergia / TERMES.** El equipo de Harvard demuestra coordinación de construcción distribuida mediante cambios locales del entorno, sin supervisor central. Sus robots y materiales están diseñados y sus reglas son explícitas; el trabajo no demuestra aparición espontánea de una civilización. Fuente primaria institucional: [Robotic construction crew needs no foreman, Wyss Institute, 2014](https://wyss.harvard.edu/news/robotic-construction-crew-needs-no-foreman/).
- **Evolución abierta.** Tim Taylor identifica requisitos que van más allá de variación, herencia y reproducción diferencial: diversidad de interacciones, descendencia potencialmente más compleja, caminos mutacionales viables y presión para continuar cambiando. No ofrece dos reglas que garanticen ciudades. [Requirements for Open-Ended Evolution in Natural and Artificial Systems, 2015](https://arxiv.org/abs/1507.07403).

El modelo es una interpretación de diseño inspirada por estas ideas, no una reproducción de TERMES ni una validación de las tesis de Taylor. Su espacio de rasgos y acciones es acotado: no satisface una diversidad prácticamente ilimitada.

## Mecanismos implementados

- **Genes adicionales:** cognición, plasticidad, manipulación, sociabilidad, curiosidad y competencia. La cognición tiene coste energético y modifica alcance perceptivo, candidatos examinados y memoria. El aprendizaje modifica preferencias; no reescribe código.
- **Herencia biológica:** alelos biparentales, mutaciones registradas y expresión fenotípica. La capacidad cognitiva puede subir o bajar.
- **Transmisión cultural:** parte de las estimaciones de ambos padres inicializa las preferencias de la cría. Los individuos también copian parcialmente estimaciones de vecinos con más experiencias favorables. Estas memorias no se escriben en los alelos.
- **Aprendizaje:** bandido contextual con contextos de hambre, exposición y calma. Cada acción mantiene valor estimado y frecuencia. La curiosidad favorece acciones menos ensayadas. Se incorporan consecuencias sobre energía, salud y cobijo; hay además incentivos de diseño declarados para novedad y reciprocidad. No se afirma aprendizaje libre de objetivos impuestos.
- **Acciones:** observar, recoger, colocar/unir, buscar cobijo, compartir, explorar y disputar. No existen acciones `buildHouse`, `foundCity`, `declareWar` ni recetas de casas/castillos.
- **Materiales:** madera, piedra, fibra y arcilla, con masa, rigidez, aislamiento y degradación diferentes. Cada colocación consume una unidad transportada. No aparecen edificios completos por eventos o edad.
- **Construcción:** muestreo de posiciones locales, ocupación, soporte y altura limitada. La adhesión a piezas existentes favorece agrupaciones. No hay plano de vivienda, techo o ciudadela. Un conjunto de bloques puede parecer una pared o refugio; no se lo etiqueta automáticamente como una casa.
- **Consecuencias físicas simplificadas:** las piezas rígidas obstaculizan el paso y su distribución angular/aislamiento da cobijo. El cobijo modifica el balance energético. No hay dinámica de ingeniería estructural o balance térmico real.
- **Agrupaciones:** se calculan componentes conectados de piezas y habitantes que frecuentan las proximidades. Se detectan después; no tienen gobierno, reglas legales, tecnología o una IA de colonia.
- **Intercambio y conflicto:** la ayuda deja confianza. Disputar un recurso puede causar daño, pérdida energética y represalias locales de vecinos con vínculos. No hay estados de guerra, ejércitos, diplomacia ni guerra estratégica. La predación permanece como sistema distinto.
- **Exploración:** visitas y tentativas a fronteras, curiosidad y presión de espacio/recursos acumulan evidencia de expansión. La ampliación ocurre sin botón del jugador. Se conserva el límite de tres ampliaciones, radio máximo 39 y 126 habitantes.

## Lo que todavía no existe

Civilizaciones humanas, casas funcionales con espacios interiores/techos, ciudadelas garantizadas, lenguaje emergente, planificación a largo plazo, creación de acciones o herramientas nuevas y evolución abierta ilimitada. Es una base experimental de construcción y aprendizaje local. Presentar estos resultados como ciudades o guerras emergentes sería exagerarlos.

## Rendimiento y trazabilidad

Hasta 1.400 piezas, 420 depósitos de materiales, 126 habitantes, memorias individuales acotadas y grupos calculados periódicamente. Se usa indexación espacial de piezas y geometría instanciada. Los tests verifican transporte/consumo, obstáculos, cobijo, aprendizaje, persistencia, migración y límites. Los benchmarks CPU no certifican GPU ni 60 FPS universales.

Las notificaciones conservan sus nodos DOM: máximo diez visibles, permanencia de 1.000 ms y desvanecimiento único de 160 ms. El exceso espera en FIFO. La historia completa reciente se consulta en el diario; no se reconstruyen los avisos al refrescar estadísticas.
