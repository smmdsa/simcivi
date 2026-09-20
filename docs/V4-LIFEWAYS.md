# V4.1 — Memoria, compañía y vidas entrelazadas

Implementación de los puntos 4–7 del primer roadmap. Nota posterior: V4.2 reemplaza el aporte ambiental de plantas por reservas finitas y amplía el presupuesto reproductivo; ver [Recuperación](V4-RECOVERY.md). Se conserva el planeta, el reloj solar, los habitantes y el guardado existente. No hace falta reiniciar.

## 4. Culturas aprendidas y perecederas

Cada individuo conserva hasta ocho prácticas con acción, material cuando corresponde, origen, fundador, transmisor y fuerza. Los resultados útiles las refuerzan; una práctica recordada aumenta la preferencia por esa acción. Padres y vecinos transmiten copias parciales, con variación en su fuerza. El aprendizaje por contacto también fortalece la afinidad.

La memoria se debilita exponencialmente: entre 210 y más de 400 segundos según cognición. Bajo 10% se olvida. También decaen las estimaciones de utilidad, preferencias materiales, confianza y valor de las rutas. Usar una práctica vuelve a reforzarla. Las culturas regionales son resúmenes de individuos vivos: no se asignan facciones ni tecnologías. El observatorio muestra conocedores, procedencia y pérdidas de prácticas antes compartidas. El registro está limitado a las 96 prácticas más extendidas y las últimas 24 pérdidas; no es un archivo histórico exhaustivo.

## 5. Relaciones sociales visibles

La proximidad repetida crea afinidad. Compartir y cuidar la refuerzan; las disputas la dañan. Los vínculos pierden fuerza sin contacto y desaparecen al morir el otro individuo. Cada habitante recuerda hasta ocho vínculos.

Las crías buscan familiares próximos. Los adultos bien alimentados se acercan a sus crías, esperan junto a ellas y pueden transferirles energía. La transferencia ocurre al llegar, conserva la energía entre ambos y se realiza una sola vez por encuentro. Cuidar consume recursos reales del adulto. Los compañeros caminan más despacio, se orientan entre sí y permanecen juntos; el cuidado mantiene una postura inclinada durante el encuentro. Los individuos afines toleran más a quienes transportan materiales. Compartir recursos y el apoyo durante disputas siguen usando las reglas anteriores, con transferencia energética corregida para no crear energía.

Hambre, peligro, gestación y trabajo en curso limitan las oportunidades sociales. Son reglas locales de parentesco y afinidad; no lenguaje ni planificación social ilimitada.

## 6. Coevolución e interdependencias

Las plantas tienen rasgos heredables de altura, néctar y dispersión. La altura modifica su representación y el acceso al néctar depende del cuello del visitante. El néctar aporta energía y su reposición necesita luz y biomasa. Los herbívoros llevan polen visible durante un tiempo limitado. Visitar otra flor madura permite fecundarla; una flor no se poliniza a sí misma.

Las flores solares necesitan polinización cruzada para producir descendencia local o semillas viables tras ser comidas. Los rasgos vegetales combinan ambos progenitores y mutan ligeramente. Otras variedades se propagan localmente. Los animales transportan hasta tres semillas: solo intentan germinar después de un tiempo de tránsito y a más de dos unidades del origen. La humedad, el hábitat y el espacio disponible determinan el éxito. La ficha muestra visitas, transporte y cobertura vegetal; las flores polinizadas cambian de tono.

Helechos y algas maduros ofrecen cobertura: disminuyen el alcance de detección y el daño de ataques para sus habitantes. Este efecto desaparece al perder vegetación. La selección vegetal, las capacidades animales heredadas y los beneficios de contacto se influyen mutuamente. Son mecanismos de coevolución simplificados, no evidencia de especiación ni mutualismos abiertos garantizados.

El aporte ambiental de semillas existente se conserva como base de alimento; no toda planta procede de reproducción local. El número de germinaciones mostrado corresponde únicamente a la nueva reproducción y dispersión. Cadáveres, plantas marchitas y digestión continúan devolviendo nutrientes al suelo.

## 7. Cámara documental autónoma

`documentary.js` lee eventos e individuos sin modificar la simulación. Prioriza nacimientos, cuidados, polinización, cambios culturales y migraciones recientes. Entre acontecimientos observa habitantes reales. No crea encuentros para obtener una escena.

Planos de 32–40 segundos de tiempo real, movimiento esférico y aproximación gradual. Para cambiar de continente se aleja primero; evita repetir entidades cuando existen alternativas. Captions describen el hecho observado. El modo de movimiento reducido alarga transiciones. La cámara conserva el presupuesto habitual de actualización de vegetación; no lo eleva a la frecuencia de fotogramas.

Arrastrar o hacer zoom concede 30 segundos de control manual; seleccionar concede 45. El seguimiento individual y las herramientas de intervención retienen el control manual. El botón Documental activa o desactiva el director, también dentro de pantalla completa. Pausar la simulación detiene la elección de planos. La cámara no avanza mientras la pestaña está oculta.

## Reloj, guardado y coste

- Sistemas sociales y ecológicos: actualización cada dos segundos simulados; movimientos y cuidados en el paso fijo existente de 100 ms.
- Índice espacial cartesiano sobre la esfera: cruza la costura de longitud y los polos.
- Reproducción vegetal: presupuesto rotativo de 40 plantas cada dos segundos.
- Censo cultural: cada doce segundos simulados.
- Vínculos, recuerdos, polen, semillas, genomas vegetales y temporizadores se guardan con el mundo. No se cambia la clave de guardado ni se reinicia la partida.
- El render y la cámara son observadores. El worker sigue simulando regiones invisibles.
- Objetivo visual 60 FPS con LOD y calidad adaptativa. El coste CPU se informa en `verification-v4.json`; no equivale a certificar WebGL, GPU ni cualquier equipo.

## Verificación

`npm test` incluye transmisión y pérdida cultural, cuidados con conservación y llegada física, polinización cruzada, herencia vegetal, dispersión, protección vegetal, búsqueda esférica, cámara sin mutaciones, prioridad manual, migración de partidas y continuación idéntica entre estado vivo y restaurado. También cubre 20 minutos simulados, límites de población/recursos/memoria, genética, IK/LOD, worker, notificaciones y ciclo de vida del modo pantalla.

No se realizó comprobación visual en navegador ni prueba física del apagado del monitor. Se incluye el modo fullscreen/Wake Lock preparado anteriormente.
