# V4: planeta, biología solar y cultura situada

## Alcance del primer roadmap

Se implementan las primeras cuatro líneas del [roadmap](ROADMAP-V4.md), más mundo esférico, navegación, LOD y sol orbital. Las líneas 5–9 continúan como propuestas, salvo capacidades previas que ya existían. La línea 10 recibe la infraestructura visual necesaria para el planeta.

### 1. Anatomía funcional

Los alelos de madre y padre determinan proporciones de cuerpo, cuello, patas, cola, pigmento y metabolismo; se amplía la variación de extremidades y cuello. Nuevos rasgos: aislamiento, afinidad nocturna y adaptación anfibia. La longitud de patas influye en marcha, coste y vadeo; el cuello modifica el rendimiento al comer helechos; aislamiento y clima local cambian el coste térmico. La adaptación anfibia facilita canales o natación oceánica con menor velocidad. La pigmentación y las proporciones se expresan en la malla celular y el IK.

Son seis familias anatómicas preexistentes. No se crean órganos, nuevas topologías o especies de forma ilimitada. La selección procede de supervivencia y reproducción; no se incrementa cognición o complejidad por número de generación.

### 2. Paisaje y sol

Radio 42 unidades, longitud periódica y latitud acotada. Movimiento por destino geodésico y distancias de arco; el cortejo valida también posiciones intermedias. Continentes y ríos proceden de la misma función en datos y render. Auralia, Nimbara, Umbriel e Islas del Alba son regiones geográficas, no culturas impuestas.

El sol recorre el planeta en 160 segundos de simulación; el producto escalar entre normal de superficie y dirección solar determina iluminación local. Una declinación sinusoidal de 23,4° durante 24 días aproxima estaciones opuestas por hemisferio. Temperatura depende de latitud, altura, estación, incidencia y ajuste climático. La luz contribuye a evaporación y crecimiento; el rasgo nocturno modifica descanso. Se muestrean condiciones próximas por celdas de dos unidades para reducir coste.

El relieve y el trazado de ríos permanecen fijos en V4. No hay erosión, hidráulica conservativa, tectónica ni circulación atmosférica. Temperatura es una respuesta analítica, sin inercia térmica material. Las estaciones y la vegetación cambian; no se promete que los continentes se deformen.

### 3. Modificación del hábitat

Se mantienen recoger, colocar, descansar, compartir, observar, explorar y disputar; se añaden reparar y retirar. Una colocación consume la unidad transportada. Retirar recupera una unidad y sólo admite la pieza superior de la columna. Reparar consume otra unidad del mismo material y recupera salud de la pieza.

Rigidez produce obstrucción y protección del viento. Aislamiento y disposición local producen cobijo y afectan gasto energético. Fibra y arcilla retienen humedad en la vecindad; ésta favorece crecimiento vegetal. Desgaste y descomposición devuelven materia al circuito simplificado existente. No hay planos de casa, ciudad o ciudadela. No se simulan techos habitables, presas ni ingeniería estructural.

### 4. Prácticas culturales

Cada mente mantiene preferencias para cuatro materiales, hasta ocho lugares útiles y una lista acotada de fuentes de aprendizaje. Buscar materiales utiliza las preferencias; explorar puede recuperar rutas recordadas. Experiencias favorables guardan lugares. Parte de estas memorias se transmite a crías y vecinos; copiar introduce variación pequeña. Una práctica puede perder portadores o ser reemplazada por otras.

Los paneles regionales resumen preferencias efectivamente almacenadas. No hay culturas asignadas al nacer por continente, gobiernos ni órdenes globales. Persisten funciones de utilidad y bonificaciones explícitas de diseño; esto no constituye inteligencia general ni cultura humana validada.

## Reloj, visibilidad y rendimiento

`simulation-worker.js` es propietario del estado. Procesa pasos fijos de 0,1 s y comandos de pausa, velocidad, clima, nombres, intervenciones y reinicio. Publica estados a 5 Hz; la vista interpola. La cámara no participa en decisiones biológicas. Los individuos del hemisferio oculto siguen ejecutando las mismas reglas.

`globe.js` usa posición de cámara, horizonte y frustum. Cercanos: células y articulaciones; intermedios: menos esferas; remotos: marcadores seleccionables; ocultos: sin instancias. Hay presupuestos de células, recursos acotados y resolución adaptativa con histéresis. Se mantiene el objetivo de 60 FPS, sujeto al hardware. El worker dispone de presupuesto y acumulador acotado: con sobrecarga el mundo se ralentiza, no aumenta el paso ni elimina organismos para compensar.

La geografía se renderiza con una malla finita; los datos son analíticos, por lo que la aproximación visual de costas puede diferir ligeramente. El renderer de pruebas no usa WebGL: comprueba transformaciones, navegación y selección geométrica, no apariencia rasterizada.

## Persistencia

Formato 5. Migración desde 2, 3 y 4, copia de respaldo previa en el navegador, identidades y herencia conservadas. La colonia antigua se trasplanta a Auralia; otros continentes reciben fundadores explícitos. Mantener la semilla permite continuar el RNG. Las posiciones de parto se comprueban contra las capacidades heredadas; si no hay posición próxima viable, la gestación espera.

La página cerrada no simula. Los navegadores pueden suspender workers de pestañas ocultas. No hay servidor que avance el mundo ni recuperación de tiempo offline en V4.
