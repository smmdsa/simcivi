# V4.4 · El planeta respira

Entrega A del [plan investigado de naturaleza y sociedades](PLANET-SOCIETIES-ROADMAP.md). El clima pasa de parámetros globales editables a condiciones locales con estado persistente.

## Qué cambia

Se retiran los sliders de temperatura, humedad y fertilidad, y la herramienta de invocar lluvia. El worker ya no acepta órdenes de ajustar el clima. Sembrar y mutar siguen siendo intervenciones opcionales.

El panel sigue el lugar observado por la cámara: temperatura, agua en el suelo, humedad relativa del aire, índice de fertilidad, viento y precipitación. Explica la incidencia solar, el papel del agua y el transporte atmosférico. El registro permite filtrar acontecimientos climáticos.

Las fichas de criaturas usan las mismas condiciones que su biología. Metabolismo, crecimiento, dormancia, recuperación, utilidad del refugio y desgaste de materiales responden a su entorno local. Ya no se aplica un episodio de lluvia global a todas las construcciones.

## Modelo reducido

- **512 celdas de igual área**, 32 longitudes × 16 bandas de seno de latitud. Se actualizan una vez por segundo simulado, dentro del worker. No dependen de la cámara ni del LOD.
- La observación interpola las cuatro celdas adyacentes; la longitud envuelve sin costura. La biología conserva su caché de coordenadas canónicas durante la revisión ambiental de un segundo y usa su instante guardado; una recarga no cambia los resultados según el orden de consulta. La interfaz puede evaluar la iluminación al instante observado. La geografía y los pesos de interpolación se reutilizan en un caché derivado acotado a 8.192 posiciones.
- Temperatura persistente con relajación exponencial hacia un objetivo dependiente de incidencia solar, latitud, altura, cobertura vegetal y nubes. El océano y la proximidad al agua aumentan la inercia. El calentamiento no empieza de cero al amanecer ni desaparece de golpe al anochecer.
- Sol orbital y declinación anual existentes: días de 160 segundos y años de 24 días. Las estaciones son opuestas por hemisferio. La geografía no cambia al recargar.
- Depósitos separados de suelo, océano, vapor y condensado. La evaporación transfiere agua y enfría; la condensación transfiere vapor a nubes; la lluvia devuelve agua; el drenaje y el desborde transfieren agua hacia una celda vecina más baja.
- Presión aproximada a partir de anomalías térmicas; viento hacia gradientes de presión con desviación dependiente de latitud y suavizado temporal. Transporta vapor y nubes con flujos conservativos y mueve hasta nueve semillas existentes cada treinta segundos, según el viento local.
- La vegetación activa aporta cobertura que modifica evaporación y temperatura. La fertilidad es un índice de base geográfica más nutrientes reales de parches de descomposición; ya no aumenta un multiplicador global al morir una criatura.

El océano tiene una reserva explícita grande. No se añade agua durante los pasos. El estado inicial incluye agua líquida, vapor y nubes; por eso la lluvia acumulada puede superar a la evaporación acumulada durante un período sin violar conservación. Los flujos usan unidades del modelo, no milímetros ni kilómetros por hora.

## Presentación y coste

Una textura de datos RGBA de 32×16 vincula la cobertura de nubes y sus sombras al condensado simulado, con ruido visual para dar detalle. Se actualiza cuando cambia la revisión ambiental. El shader interpola sobre el mismo dominio esférico de igual área.

Cerca de una zona lluviosa aparecen gotas inclinadas por el viento local: hasta 160 trazos en Cinemática y 80 en Equilibrada. En Fluida no se renderizan nubes ni lluvia, pero sus efectos biológicos continúan. Los límites de células y píxeles de IV.3 se conservan.

El modelo solo recorre las 512 celdas y las listas ya acotadas de plantas/nutrientes. No agrega consultas entre cada pareja de organismos ni un motor de fluidos volumétricos. El informe `verification-environment.json` mide el coste de actualizar el entorno en Node; no certifica FPS de navegador.

## Guardado y migración

Formato 6, misma clave local. Se conservan criaturas, nombres, parentescos, semillas, estructuras, recuerdos y tiempo de partidas 2–5. La migración histórica del jardín a planeta mantiene sus reglas anteriores para formatos anteriores a 5.

Las partidas sin atmósfera reciben una inicialización geográfica determinista a partir de su semilla. Los valores de los sliders antiguos no se convierten en forzamientos permanentes. El nuevo estado conserva reloj fraccionario, agua, temperatura, viento, nubes y contadores. Una recarga de formato 6 no reinicializa el clima.

El receptor del worker conserva la clase ambiental y aplica sus datos; el guardado sigue conteniendo un estado completo. Pausar detiene también el clima. Estar fuera de cámara no lo detiene; la suspensión de la pestaña por el navegador sigue siendo una limitación externa.

## Comprobación

`verify-environment.mjs` verifica cuatro ciclos diarios, conservación del agua, inercia térmica oceánica, respuesta estacional de ambos hemisferios, viento, continuidad en longitud, fertilidad local, eliminación del control manual, migración y continuación determinista.

Las pruebas de crisis mantienen forzamientos controlados **solo en fixtures de pruebas fuera de `dist`** para comprobar dormancia y recuperación en escenarios reproducibles. No se añade un modo oculto de controlar el clima en la aplicación. Se mantienen las pruebas de veinte minutos biológicos, transporte, geometría, worker, notificaciones y pantalla completa.

## Resultado de la verificación de entrega

La suite integrada pasó con veinte minutos simulados, más una crisis controlada y recuperación. En esta ejecución, P95 del paso biológico fue 38,949 ms y la preparación CPU de una vista cercana 4,983 ms. La actualización de las 512 celdas climáticas registró P95 de 2,718 ms en la prueba ambiental. Son medidas distintas; no deben sumarse ni interpretarse como tiempo GPU.

En las bandas de prueba, el período de verano norte produjo medias de 17,81 °C al norte y 11,61 °C al sur; durante el verano sur, 11,93 °C al norte y 17,34 °C al sur. El error acumulado del inventario de agua en cuatro ciclos diarios quedó por debajo de 10⁻⁷ unidades. Las cifras exactas y la semilla se conservan en los informes de verificación.

El paso biológico puede superar el presupuesto nominal de un turno del worker: se detiene el lote tras completar ese paso indivisible. A velocidad alta puede reducirse el avance efectivo del reloj. Las mediciones de Node no certifican 60 FPS de navegador.

## Límites explícitos

Es un modelo ambiental de juego inspirado en relaciones físicas, no un pronóstico meteorológico calibrado. La ecuación térmica es una parametrización y no conserva rigurosamente la energía radiativa. La presión y Coriolis son aproximados: todavía no permiten afirmar que se simulan huracanes.

El dominio atmosférico es grueso. Los ríos siguen siendo accidentes geográficos fijos; su amortiguación local de humedad es una parametrización. No hay aún caudales por cuenca, acuíferos profundos, nieve como depósito físico, erosión, placas, sismos ni volcanes. La fertilidad base representa aptitud mineral del suelo, no un inventario completo de nitrógeno, fósforo y potasio.

Las siguientes entregas y sus criterios están especificados en el plan investigado. Las noticias sobre países e instituciones siguen pendientes.
