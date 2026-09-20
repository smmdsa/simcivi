# IV.5 · El paisaje tiene memoria

Entrega B (cuencas y relieve) y C (geología), 14 de septiembre de 2026. Guardado v7; carga mundos v2–v6 conservando habitantes, herencia, nombres y memoria existente.

## Base y alcance

Una cuenca reúne el agua que llega a un desagüe común. Pendiente, cobertura, infiltración, almacenamiento y deshielo modifican la escorrentía. La implementación usa esas relaciones en un modelo reducido; sus coeficientes no representan milímetros o años terrestres. [USGS: Watersheds and Drainage Basins](https://www.usgs.gov/water-science-school/science/watersheds-and-drainage-basins).

El movimiento relativo de placas concentra actividad sísmica en sus fronteras. Aquí se representa mediante identidad de placa, velocidad tangencial, carga y umbral de ruptura; no mediante un sorteo de desastres cada cierto tiempo. [USGS: Tectonic Plates](https://www.usgs.gov/media/images/tectonic-plates-earth).

La actividad volcánica depende de magma y vías de salida. El modelo simplifica esa relación a reservorios que recargan, descargan y dejan material que se enfría. Los valores mostrados son propios del experimento, no magnitudes Richter ni pronósticos. [USGS: About Volcanoes](https://www.usgs.gov/programs/VHP/about-volcanoes).

## Agua y relieve

512 celdas de igual área comparten la resolución de la atmósfera. Cada una conserva agua superficial, acuífero, nieve, sedimento suspendido y caudal. La precipitación se transfiere del condensado atmosférico a nieve, superficie u océano. El calor derrite nieve; la infiltración transfiere agua al suelo; la percolación alimenta el acuífero y su descarga vuelve a la superficie. La evaporación consume agua existente.

La ruta de desagüe sigue vecinos de menor altura. Una depresión retiene agua hasta que su nivel supera la salida vecina. La transferencia se aplica con acumuladores separados: el agua recibida no recorre arbitrariamente varias celdas por el orden del bucle. Las cuencas comparten un identificador de salida. Se recalculan cuando avanza el entorno, incluyendo deformación tectónica, erosión, sedimentación y conos volcánicos.

El flujo erosiona más con pendiente y menos con vegetación; mueve sedimento que se deposita cuando disminuye el transporte. Dos balances verificables:

- Agua total = suelo + océano + vapor + nube + superficie + acuífero + nieve.
- Material erosionado = sedimento suspendido + material depositado.

El exceso superficial genera exposición a inundación, localizada alrededor de las celdas. Daña vegetación y construcciones; los animales terrestres tienen tolerancias asociadas a su anatomía y buscan menor riesgo caminando. Un cambio del entorno puede dejarlos temporalmente expuestos: no se teletransportan a una zona segura. La falta de agua reduce caudales y sigue afectando la vegetación mediante el clima local.

## Placas, tensión y magma

Seis placas se generan determinísticamente desde la semilla del mundo. Sus centros definen regiones esféricas y sus ejes definen movimiento tangencial. Se conservan hasta dos fallas representativas por pareja de placas, con fronteras convergentes, divergentes o transformantes según movimiento relativo. Las fallas acumulan tensión; superar el umbral libera parte de ella, deforma el relieve y daña estructuras y habitantes próximos.

Hasta ocho respiraderos terrestres se sitúan cerca de fronteras convergentes o divergentes. Recargan magma según la carga de su falla. Al superar capacidad comienzan a descargar; al disminuir el reservorio terminan. Como presupuesto del modelo, hasta dos erupciones ocurren a la vez: los demás reservorios conservan su presión pendiente.

El material extruido se reparte entre roca y ceniza. La roca aumenta el cono persistente; la ceniza se meteoriza gradualmente según humedad y entra en el circuito de nutrientes. La descarga caliente aparece en el pie de menor altura muestreado alrededor del cono, se enfría exponencialmente y deja una huella oscura. No se resuelve un frente de lava como fluido.

El calor daña vida y piezas cercanas; las muertes conservan su causa y siguen el sistema de cadáveres y compost. Las construcciones dañadas pasan por el ciclo existente de deterioro, reutilización o descomposición. Se conserva el balance roca + ceniza + material meteorizado = material extruido. La fertilidad no aumenta globalmente por una erupción.

## Observar

El botón **Agua y roca** abre reservas, cuencas principales, tensión de fallas y estado de volcanes. Cada lugar permite enfocar la cámara. La superposición de fallas es opcional. El diario separa inundaciones, sismos y volcanes; sus entradas sitúan la cámara. El documental incluye estos hechos sin modificar la simulación.

El relieve usa una textura de 32 × 16 valores actualizada al cambiar el estado ambiental; el desplazamiento se realiza en el shader. La nieve visual procede de nieve almacenada. Vegetación, piezas, cámara y animación celular se apoyan en la nueva altura. Los conos, lava y agua usan instancias; la red de drenaje y los anillos sísmicos usan buffers fijos. El modo de menor detalle elimina las columnas de ceniza, no sus consecuencias.

Presupuestos adicionales: 8 conos, 8 cráteres, 48 huellas de lava, 512 parches de agua, 64 partículas de columna, 12 frentes sísmicos y 512 enlaces fluviales. Las reglas corren a 1 Hz en el worker, independientemente del encuadre; el bucle biológico conserva su paso anterior. Las clases serializan reservas, tensión, magma, roca, rutas, relojes y fenómenos en curso. La migración crea los nuevos depósitos de agua vacíos para no inventar reservas adicionales.

## Límites explícitos

La costa y los lechos fluviales originales siguen definiendo los hábitats base. Las líneas nuevas muestran drenaje a resolución gruesa; no excavan cada meandro ni habilitan peces en cualquier charco. No hay deriva continental visible, terremotos físicamente calibrados, tsunamis, transporte subterráneo lateral ni simulación del manto. La pendiente tectónica es una aproximación local acelerada. Los conos tienen un límite visual de altura y conservan la masa acumulada en datos.

La iluminación de las superficies desplazadas conserva las normales del relieve base, una aproximación de rendimiento para pequeñas deformaciones; los conos tienen su propia geometría y normales. Los mapas de fallas muestran lugares representativos de la frontera, no cartografía geológica terrestre.

## Verificación

`node scripts/verify-geodynamics.mjs` comprueba 2.400 segundos ambientales autónomos, balances de agua/sedimento/material volcánico, transferencias aguas abajo, deshielo, ruptura causal y daño local, magma finito, enfriamiento, evacuación sin teletransporte, recarga JSON durante fenómenos y migración v6. También ejecuta geometría Three.js con renderer inyectado y comprueba que observar no modifica datos.

`npm test` incluye los sistemas anteriores. `npm run test:shaders` compila y enlaza siete programas GLSL ES 3, incluido el relieve nuevo. Los informes `verification-*.json` contienen resultados y tiempos CPU de esta ejecución. Estas pruebas no equivalen a una revisión visual en navegador ni garantizan 60 FPS en todos los equipos; el objetivo sigue gestionándose con LOD y presupuesto adaptativo.
