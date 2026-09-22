# IV.7 · Población regulada por alimento

El contador global de 384 animales ya no bloquea cortejos, gestaciones ni nacimientos. No se reemplaza por cuotas por familia o región. Los peces compiten por alimento acuático; ocupar un número en el planeta no impide que una pareja terrestre tenga descendencia.

## Reglas

- La reproducción requiere madurez, pareja cercana, energía superior a 72, ausencia de gestación y recuperación del intervalo reproductivo.
- Concebir descuenta 24 unidades de energía de cada progenitor. La cría recibe 40 de esa reserva; las ocho restantes son coste reproductivo.
- Gestar añade un gasto de 0,08 por segundo simulado. El proceso continúa durante tareas culturales. No se retrasa el parto porque haya otros animales.
- Los nacimientos con hábitat incompatible conservan el mismo descendiente pendiente mientras la madre busca un lugar viable. No se sortean genomas nuevos en cada intento.
- La escasez reduce reservas, impide nuevos cortejos y finalmente causa mortalidad. La abundancia puede permitir reproducción, pero no elimina madurez, tiempos ni costes.
- Los carnívoros buscan presas terrestres próximas y carroña, sin consultar una proporción global que contaba también peces. Comen antes de llegar a una reserva tan baja como antes.
- Una mordida de carne descuenta hasta ocho unidades de biomasa del cadáver. Cazar y carroñear utilizan el mismo depósito; lo comido no vuelve a abonarse completo.
- Los refugios reducen hasta un 28 % del gasto metabólico con el máximo abrigo actual. Descansar y construir no crean calorías.
- Alimento, amenazas y parejas se consultan mediante vecindades esféricas. La exploración ordinaria propone destinos a seis unidades de distancia, no puntos aleatorios de todo el planeta. Los recuerdos culturales existentes siguen disponibles.

Son unidades y coeficientes del modelo, no parámetros calibrados para especies terrestres. La regulación utiliza energía obtenida al comer, no una predicción omnisciente de la comida futura. Puede haber sobrepoblación temporal, hambre y extinciones.

## Simulación y dibujo

Todos los animales vivos permanecen en la simulación, el censo y el guardado. La vista prioriza al seleccionado y después a los cercanos; dibuja como máximo 4.096 animales por fotograma. El resto continúa viviendo. El presupuesto de geometría es independiente: hasta 23.000 células y 4.096 huesos, con niveles de calidad inferiores más económicos.

El worker conserva sus pasos y presupuesto temporal. Con carga alta el reloj puede avanzar más despacio; no se eliminan habitantes ni se impide que nazcan para sostener FPS. Esta entrega no incorpora agregación de animales ni demuestra rendimiento ilimitado. La prueba de render usa geometría Three.js con renderer inyectado; no certifica FPS de GPU.

## Guardados y limpieza

El formato sigue siendo v8. Se aceptan poblaciones mayores que 384 sin truncarlas. Una gestación antigua sin reserva separa una sola vez hasta 40 unidades de la energía disponible de la madre, conservando al menos 15 cuando las tiene. Después se conserva la reserva explícita. No se reinicia el mundo ni se repueblan familias extintas.

Se eliminan el máximo animal, su getter, la proporción global depredador/presa, contadores de expansión inactivos, reloj de alimento sin efecto, conteos internos sin consumidores, bandera de descendencia sin uso y energía separada de la carroña. El panel cuenta las variedades vegetales presentes.

## Verificación

`npm test` incluye reproducción por encima del antiguo límite, coste parental, hambre, gestación durante tareas, refugios sin energía gratuita, migración de gestaciones, continuación determinista, depredación y carroñeo. La prueba visual satura la vista con 4.296 animales, selecciona el último, activa esqueletos, materiales transportados y polen; comprueba buffers acotados e independencia de los datos.

El diagnóstico acepta pasos de 0,1 (predeterminado, igual al worker) y 0,2 segundos, y permite continuar un checkpoint sin repetir los días ya registrados:

```sh
node scripts/diagnose-ecology.mjs 1726312000000 150 resultado.json 0.2
node scripts/diagnose-ecology.mjs 1726312000000 150 resultado.json 0.2 --resume
```

Validación de entrega: `npm test` completó sus pruebas. Se conservaron dos diagnósticos hasta el día 10, con paso 0,2, en `docs/verification/ecology-local-1.json` y `ecology-local-2.json`. Las corridas de 150 días se interrumpieron y siguen pendientes; estos resultados no demuestran recuperación de diversidad a largo plazo.

Dos semillas no certifican estabilidad general. Los resultados de larga duración se registran junto con su paso temporal; una corrida a 0,2 no es una comparación idéntica con el diagnóstico histórico a 0,1.

## Pendientes ecológicos

Se conservan los límites existentes de plantas, semillas, materiales y microbiología. El crecimiento vegetal y la biomasa animal aún no forman un balance global de carbono/nitrógeno. La búsqueda local no es un planificador de rutas entre continentes. No hay especiación macroscópica, insectos individuales, aves, agricultura ni pastoreo; continúan en el roadmap. La desaparición de una familia sigue siendo posible y no la corrige aumentar la población total.
