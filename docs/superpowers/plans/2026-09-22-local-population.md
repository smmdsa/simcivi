# Regulación ecológica local · plan de implementación

**Objetivo:** eliminar el cupo animal global y regular nacimientos mediante alimento obtenido, reservas, madurez y costes reproductivos.
**Diseño aprobado:** recursos locales; competencia por alimento accesible; migración con percepción limitada; presupuestos visuales independientes. Código directo, comentarios breves, sin compatibilidad ficticia ni reglas de población paralelas.
**Ejecución:** implementación en esta sesión; GitHub y publicación al final.

## 1. Reproducción y alimento
- [x] Probar cortejo y nacimiento por encima de 384; hambre impide cortejo.
- [x] Eliminar MAX_CREATURES, capacity y la proporción global de depredadores/presas.
- [x] Pagar reserva de cría al concebir; gestación consume energía; no regalar energía al nacer.
- [x] Descontar carne del cadáver al comer; evitar cobrar una presa y después el cadáver completo.
- [x] Buscar alimento, amenazas y parejas mediante vecindad esférica; explorar distancias locales.

## 2. Presentación y persistencia
- [x] Cargar poblaciones mayores que 384 sin truncar individuos.
- [x] Separar límites de células, esqueletos, puntos y efectos de la población.
- [x] Probar población superior al presupuesto visual sin sobrescribir buffers ni modificar datos.
- [x] Reemplazar «habitantes posibles» por regulación por recursos; contar variedades vegetales reales.
- [x] Quitar campos muertos de expansión, reloj de alimento y descendencia pendiente sin consumidor.

## 3. Verificación
- [x] Regresiones de reproducción, consumo, guardado determinista y render denso.
- [x] Ejecutar npm test y registrar dos semillas hasta 10 días (paso 0,2).
- [ ] Completar calibración de 150 días: las corridas se interrumpieron; no se afirma estabilidad prolongada.
- [x] Revisar el diff completo y corregir fallos antes de publicar.

## 4. Entrega
- [x] Actualizar roadmap y documentar resultados y límites.
- [x] Publicar los cambios en GitHub y sincronizar el sitio con el código verificado.

## Riesgos que se verificarán
Guardados antiguos con gestación en curso; nacimientos con hábitat incompatible; cadáver sin biomasa; muerte durante búsqueda; buffers visuales saturados. No se garantiza diversidad ni se resucitan familias extintas. El presupuesto temporal del worker puede ralentizar el reloj bajo carga; no se bloquean nacimientos por rendimiento. La contabilidad vegetal y animal sigue siendo reducida, no un balance global de carbono.

## Cierre de entrega
IV.7 publicada en GitHub (`4b4ca72`) y Sites (despliegue confirmado). La calibración prolongada continúa abierta en [próximas tareas](../../NEXT-TASKS.md).
