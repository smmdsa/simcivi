# Próximas tareas de Véspera

Actualizado: 22 de septiembre de 2026. IV.7 publicada; este documento define trabajo pendiente, no implementaciones nuevas.

## IV.7.1 · Diagnóstico antes de ampliar especies

- [ ] **ECO-01 · Corridas reproducibles.** Ejecutar las semillas 1726312000000 y 1726312000001 durante 150 días con paso 0,1, igual al worker. Agregar tres semillas declaradas antes de correr. Guardar revisión de código, configuración, métricas diarias y checkpoints por tramos; reanudar sin repetir avances. Los resultados existentes de 10 días a 0,2 son exploratorios, no una comparación controlada.
- [ ] **ECO-02 · Explicar pérdidas.** Registrar población y biomasa por familia y región, nacimientos, hambre, muertes por causa, presas accesibles, productores, semillas, nutrientes y desplazamientos. Conservar checkpoints antes y después de cada extinción. Separar escasez real, inaccesibilidad, inviabilidad reproductiva y errores de reglas. La captura del día 516 no permite reconstruir por sí sola la partida original.
- [ ] **ECO-03 · Corregir causas demostradas.** Para cada fallo: caso mínimo, regresión, corrección pequeña y comparación con las mismas semillas y paso. Auditar transferencia de energía, reproducción, consumo y reciclaje. Revisar los límites vegetales existentes y medir si sesgan la disponibilidad; no sustituir el cupo animal por cuotas de especies ni alimento gratuito.
- [ ] **ECO-04 · Recuperación y dispersión.** Probar crisis con refugios viables y sin reservas vivas. Medir recolonización entre zonas accesibles y fallos de navegación. Recuperar productores y consumidores supervivientes cuando las condiciones lo permiten; no restaurar animales extintos ni cultura perdida.
- [ ] **ECO-05 · Escala real.** Medir CPU, transporte, tamaño y tiempo de guardado y FPS de navegador por separado a 400, 1.000 y 4.000 animales. Registrar equipo y escenarios. Verificar que saturar el dibujo no altera nacimientos, censo ni persistencia; identificar el punto donde el reloj se ralentiza.
- [ ] **ECO-06 · Cierre.** Publicar informes y límites. Extender dos semillas a 600 días para cubrir el horizonte del problema observado. Corregir bloqueantes antes de iniciar IV.8; documentar extinciones explicadas sin exigir supervivencia artificial de las seis familias.

Dependencias: ECO-01 alimenta ECO-02; ECO-03 y ECO-04 usan sus checkpoints; ECO-05 puede ejecutarse por separado; ECO-06 reúne la evidencia. Una corrida sin colapso no demuestra equilibrio general. No fijar porcentajes de diversidad sin una línea base medida.

## IV.8 · Insectos funcionales

- [ ] **BIO-01:** detritívoro con etapas de desarrollo y consumo de materia orgánica; reciclaje sin duplicar nutrientes.
- [ ] **BIO-02:** polinizador con alimento vegetal finito, transporte de polen y efecto medible sobre reproducción de plantas.
- [ ] **BIO-03:** reproducción, mortalidad, diapausa y rasgos heredables con compensaciones; persistencia y visualización con presupuestos independientes.
- [ ] **BIO-04:** comparar mundos con y sin estas interacciones bajo las mismas semillas. Aceptar por efectos funcionales y contabilidad coherente, no por cantidad de criaturas dibujadas.

## Después de IV.8

1. **Red marina y aves:** productores, consumidores y detritos marinos; oxígeno local, gasto y mortalidad; después aves con nichos, desplazamiento y alimentación propios.
2. **Radiación de linajes:** nuevas formas desde supervivientes, aislamiento y rasgos heredados. Sucesión condicionada por recursos; 3 + 20 días permanece como objetivo de calibración acelerada.
3. **Comunidades y domesticación:** memoria colectiva persistente; cultivo mediante semillas, trabajo y cosechas; pastoreo mediante manejo, alimento y reproducción animal. Excedente real antes de expansión, con posibilidad de fracaso y pérdida de conocimientos.
4. **Instituciones e historia:** territorio de uso, decisiones, conflictos, registro histórico y noticias basadas en evidencia. Tormentas organizadas y mejoras visuales conservan su lugar en el backlog.

La siguiente tarea ejecutable es ECO-01. Este ajuste de roadmap no inicia las corridas ni agrega funcionalidades.
