# Véspera · Clima autónomo, riesgos naturales y sociedades observables

Investigación y plan de implementación · 14 de septiembre de 2026.

El objetivo es que un mundo con intervención opcional produzca cambios que puedan observarse y explicarse. La primera entrega de este plan es **clima autónomo local**. Tectónica, ciclones e información social se especifican aquí, pero no se presentan como funciones ya implementadas.

## Lo que había y lo que faltaba

La versión anterior ya calculaba iluminación, día/noche y temperatura local con latitud, relieve y estación. Sin embargo, dependía de una temperatura y humedad globales controladas por sliders. La lluvia era global y sorteada periódicamente; parte del metabolismo y de los refugios todavía consultaba esos valores globales. Esto debilitaba la autonomía y podía hacer que dos lugares distantes respondieran al mismo episodio.

Los grupos culturales actuales son agrupaciones espaciales y prácticas compartidas. No representan soberanía, instituciones, gobiernos ni medios de comunicación. Renombrarlos «países» no añadiría esos mecanismos. La emergencia necesita acciones, memoria, restricciones e incentivos explícitos; no existe una regla mínima conocida que garantice una civilización abierta e ilimitada.

## Relaciones ambientales investigadas

| Relación | Evidencia | Traducción propuesta |
|---|---|---|
| Inclinación, latitud e iluminación | Las estaciones terrestres responden a la orientación del eje y a la distribución anual de luz; los hemisferios tienen estaciones opuestas. [NASA](https://spaceplace.nasa.gov/seasons/en/) | Conservar un único sol y declinación anual; usar su incidencia para calentar cada zona. La noche permite enfriamiento gradual, no un salto instantáneo de temperatura. |
| Diferencia entre tierra y agua | El calentamiento diferencial provoca gradientes de presión y brisas costeras. [NOAA/NWS](https://www.weather.gov/source/zhu/ZHU_Training_Page/winds/Wx_Terms/Flight_Environment.htm) | Dar mayor inercia al agua y moderación térmica a las costas. Derivar viento del contraste térmico entre celdas. |
| Agua, vegetación y aire | Evapotranspiración reúne evaporación y transpiración; cambia con disponibilidad de agua, temperatura, humedad, sol y viento. [USGS](https://www.usgs.gov/water-science-school/science/evapotranspiration-and-water-cycle) | Reservas separadas de agua, vapor y condensado; evaporación con coste hídrico; transporte, condensación, precipitación y escorrentía. |
| Ciclones tropicales | Requieren condiciones oceánicas y atmosféricas apropiadas; intervienen calor, humedad, circulación y Coriolis. [UCAR](https://scied.ucar.edu/learning-zone/storms/how-hurricanes-form) | Modelar perturbaciones que crezcan o se debiliten por energía disponible. La lluvia intensa por sí sola no merece llamarse huracán. |
| Placas y sismicidad | Los terremotos se concentran en límites de placas. [USGS](https://www.usgs.gov/media/images/tectonic-plates-earth) | Definir placas persistentes, bordes y esfuerzos acumulados; liberar energía en fallas, con intensidad que disminuya espacialmente. |
| Volcanismo | El contexto tectónico y los puntos calientes condicionan dónde se forman volcanes. [USGS](https://www.usgs.gov/programs/VHP/about-volcanoes) | Reservorios magmáticos locales, presión y episodios de emisión. No todo borde de placa debe ser volcánico. |
| Erupciones y clima | Algunas grandes erupciones afectan el clima mediante aerosoles; no todas producen un enfriamiento global significativo. [USGS](https://www.usgs.gov/programs/VHP/volcanoes-can-affect-climate) | Separar lava, ceniza local y aerosol estratosférico; distintas duraciones, alcances y efectos. |

Estas fuentes sustentan las relaciones cualitativas. Las constantes, unidades aceleradas y límites elegidos para Véspera son decisiones de diseño, no coeficientes calibrados para reproducir la Tierra.

## Orden de ejecución

| Entrega | Alcance y dependencia | Criterio para considerarla terminada |
|---|---|---|
| **A · Clima autónomo — implementada en IV.4** | Temperatura con memoria, agua/suelo/aire, condensación y lluvia local, viento básico, fertilidad observada y eliminación de sliders. | Día/noche y hemisferios diferenciados; agua conservada entre depósitos; biología local; recarga determinista; presupuesto medido. |
| **B · Cuencas y relieve activo — pendiente** | Ampliar A con caudales fluviales, infiltración profunda, nieve física, escorrentía por cuencas y erosión. | Agua aguas arriba afecta aguas abajo; inundaciones y sequías tienen duración y huella; cambios de navegabilidad seguros. |
| **C · Geología — pendiente** | Placas con identidad, fronteras convergentes/divergentes/transformantes, tensión, fallas y reservorios de magma. | Sismos situados y causados; volcanes condicionados por estructura geológica; destrucción, nutrientes y recuperación registradas. |
| **D · Tormentas organizadas — pendiente** | Ampliar A/B con presión dinámica, circulación, temperatura oceánica superficial, cizalladura aproximada y vorticidad. | Un ciclón consume condiciones favorables, puede disiparse y pierde fuerza sobre tierra; sin generación por mero temporizador. |
| **E · Comunidades e instituciones — pendiente** | Identidad colectiva persistente, pertenencia, territorio de uso, normas y decisiones comunes; integración con recursos y migración. | Comunidades que sobreviven a cambios de habitantes, se dividen/fusionan y pueden perder instituciones. No progresión obligatoria. |
| **F · Crónica y medios — pendiente** | Registro estructurado y boletín del observatorio sobre A–E; después redes de comunicación dentro del mundo. | Cada noticia enlaza hechos, lugar, período y evidencia. Sin inventar categorías que no tengan mecanismos. |

B–D enriquecen la naturaleza, pero no es necesario completar todas antes de empezar E/F. Una crónica de nacimientos, recursos, cuidado y clima ya podría aportar valor; una geopolítica ficticia sin instituciones todavía no.

## Diseño de riesgos naturales

Los riesgos deben surgir de condiciones persistentes y tener una cadena completa: causa → exposición → daño → respuesta → huella → recuperación. Antes de añadir espectáculo, registrar qué organismos, reservas, rutas y construcciones quedaron afectados.

**Sismos:** energía acumulada por movimiento relativo, umbral de ruptura heterogéneo y propagación local. No ofrecer predicción exacta: mostrar actividad y tensión del modelo. Guardar daños y cambios de rutas; evitar reconstruir toda la geografía en cada fotograma.

**Volcanes:** magma, presión, conductos y capacidad de liberación; lava y ceniza dañan localmente. La meteorización posterior puede aportar nutrientes con demora; no convertir de inmediato toda erupción en fertilización beneficiosa. Los aerosoles deben tener masa, transporte y decaimiento propios.

**Vientos y ciclones:** la entrega A tiene transporte horizontal y una desviación dependiente de latitud, pero carece de dinámica vertical y no simula huracanes. D debe añadir condiciones de organización, energía y disipación; fijar límites de sistemas activos y coste por paso.

**Frecuencia:** las escalas geológicas y biológicas no coinciden. Su aceleración debe declararse como decisión del mundo simulado. No aumentar desastres para que «siempre pase algo»: el silencio y la recuperación también son parte de la contemplación.

## Comunidades antes de países

Propuesta de diseño, no conclusión científica: medir convivencia, vínculos, prácticas y uso compartido de lugares; conservar una identidad mientras exista continuidad suficiente de miembros y memoria. Las agrupaciones actuales basadas en piezas no bastan: sus identificadores no deben convertirse directamente en identidades políticas.

Las acciones adicionales serían compartir información, reconocer compromisos, contribuir a reservas, negociar acceso y sancionar incumplimientos con coste. Las normas necesitan aprendizaje, transmisión, seguimiento y posibilidad de rechazo. La literatura de agentes normativos ofrece marcos para estos mecanismos, sin garantizar que surjan Estados. [Hollander y Wu, JASSS](https://www.jasss.org/14/2/6.html).

Distinguir comunidad, confederación e institución territorial mediante comportamientos observados. Los nombres pueden ser bautizados por el usuario. Economía requiere producción/consumo/transferencias verificables; política requiere decisiones colectivas; guerra requiere conflicto organizado y persistente. La agresión entre dos organismos no cumple esa definición.

## Noticiero: contar lo que el mundo hizo

La base técnica adecuada es **story sifting**: consultar un registro de acontecimientos para reconocer secuencias significativas. Felt explora un lenguaje de consultas y patrones sobre una simulación de reglas. Aplicarlo aquí permite separar la evolución del mundo de la selección editorial. [Kreminski, Dickinson y Wardrip-Fruin, Felt](https://mkremins.github.io/publications/Felt_SimpleStorySifter.pdf).

Dos productos distintos:

1. **Crónica del observatorio:** conoce el estado registrado y presenta un resumen verificable al espectador. Es la primera implementación recomendable.
2. **Medios dentro del mundo:** habitantes observan, recuerdan y transmiten información por redes con alcance, demora, confianza y coste. Un medio nace al sostener una actividad informativa reconocible; no aparece automáticamente al superar cierta población. Su versión de los hechos puede ser incompleta y debe distinguirse del registro del observatorio.

| Sección | Hechos que permitirían cubrirla | Lo que todavía falta |
|---|---|---|
| Economía | Producción, consumo, reservas, escasez e intercambios materiales. | Flujos por comunidad y ventanas temporales. No hablar de PIB, inflación o moneda sin implementarlos. |
| Sociedad | Nacimientos, mortalidad, migración, cuidados y cohesión. | Identidades colectivas estables y denominadores para comparar tasas. |
| Política | Adopción de normas, decisiones colectivas, disputas institucionales. | Instituciones, propuestas, aceptación y sanciones. Sin elecciones ficticias. |
| Cultura | Prácticas difundidas, innovación, pérdida de memoria compartida. | Atribución temporal y colectiva de cambios. |
| Entretenimiento | Juego social o expresiones compartidas con función propia. | Acciones de juego/expresión y transmisión. No renombrar una animación de cortejo como festival. |
| Seguridad | Daño por clima, depredación, disputas y protección. | Registro de consecuencias y distinción entre conflicto, accidente y fenómeno natural. |
| Geopolítica | Acuerdos, acceso territorial, cooperación y conflicto entre instituciones. | Territorio de uso, reconocimiento mutuo, acuerdos y acciones colectivas. |

**Contrato de datos propuesto:** `id`, `time`, `place`, `actors`, `communityIds`, `kind`, `before`, `after`, `causeIds`, `sourceIds`. Las noticias añaden `period`, `category`, `evidenceIds`, `severity`, `confidence` y `supersedes`. Los nombres mostrados deben escaparse; las referencias deben sobrevivir a la muerte de individuos.

**Selección:** magnitud relativa, personas afectadas, novedad, duración y confianza; penalizar repetición. Agrupar nacimientos o escasez por período en vez de emitir un titular por criatura. Reservar categorías sin actividad como «sin acontecimientos relevantes», sin rellenarlas con ficción.

**Presentación contemplativa:** un boletín discreto, pausa de lectura, opción de seguir una comunidad y enlace para llevar la cámara al lugar. Interrumpir un plano únicamente ante sucesos realmente excepcionales. El noticiero observa; no cambia el RNG, no provoca guerras y no altera decisiones para completar una historia.

**Rendimiento propuesto:** registro circular acotado, índices por comunidad/tipo/tiempo, agregación incremental y consulta editorial cada varios segundos en worker. Plantillas deterministas son suficientes inicialmente; ningún generador de lenguaje en el bucle biológico.

## Estado de esta entrega

Se completa A. No se implementan todavía B–F, medios, países, terremotos, volcanes ni huracanes. Las reglas y límites del clima entregado se detallan en [V4-ENVIRONMENT.md](V4-ENVIRONMENT.md). Este plan amplía el roadmap original, sin declarar terminado el punto 8 de memoria histórica.
