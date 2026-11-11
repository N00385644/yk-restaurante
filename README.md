# YK · Sazón casera de 7 a 3

Web estática del restaurante YK, con diseño adaptable en crema, terracota y verde oliva. Incluye el logo con fondo transparente; no utiliza fotografías de platos ni locales.

- **Web:** https://n00385644.github.io/yk-restaurante/
- **Repositorio:** https://github.com/N00385644/yk-restaurante

## Desarrollo local

No requiere instalar dependencias ni compilar:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Abrir http://127.0.0.1:4173. También se puede abrir `index.html` directamente.

## Información del negocio

La información comercial se conserva en `config.js`: nombre, descripciones, horario, modalidades, categorías, platos, precios y preguntas frecuentes. El rediseño conserva este archivo sin cambios.

- Horario: lunes a domingo, 7:00 a.m. a 3:00 p.m.
- Servicio: local y delivery.
- Menú del día desde S/ 7, desayunos, platos a la carta y bebidas.
- Sin promociones ni redes sociales confirmadas.

Los números de información, delivery y WhatsApp, la dirección y los métodos de pago siguen pendientes de confirmación. Se mantiene el precio de medio cuy recibido originalmente; debe confirmarse con el negocio.

## Actualizar contenido

Editar `config.js`. Cada plato admite `id`, `categoria`, `nombre`, `descripcion`, `precio`, `precioTexto`, `disponible` y `etiqueta`.

Para habilitar pedidos por WhatsApp, completar `restaurante.whatsapp` con el número real, código de país y solo dígitos. Completar también `telefonoInfo` y `telefonoDelivery`. Mientras estos datos estén vacíos, la web muestra su estado pendiente y no envía pedidos. El restaurante confirma disponibilidad, importe final y entrega; la web no procesa pagos.

## Funciones

La opción «Añadir» al carrito está disponible exclusivamente para los platos de la categoría «A la carta». Las demás categorías conservan la opción de consulta. Los carritos guardados anteriormente se filtran al cargar para respetar esta regla.

Búsqueda sin distinguir tildes, filtros por categoría, carrito y cantidades guardados en el navegador, total estimado, validación de nombre y dirección de delivery, preparación de mensaje por WhatsApp, preguntas desplegables y navegación móvil. El carrito admite teclado, cierre con Escape, foco contenido en el diálogo y retorno al botón de apertura. Se respeta la preferencia de movimiento reducido.

## Archivos

- `index.html`: estructura y textos.
- `stily.css`: diseño y adaptación a móvil, tablet y escritorio.
- `config.js`: datos del negocio, sin modificaciones en el rediseño.
- `app.js`: búsqueda, filtros, carrito y preguntas.
- `assets/icons.svg`: íconos vectoriales de objetos; sustituyen los emojis de la interfaz.
- `assets/logo-yk.png`: logo blanco con canal alfa transparente, usado también en verde mediante CSS.
- `robots.txt`, `sitemap.xml`: referencias a la URL publicada.
- `.nojekyll`: publicación estática directa en GitHub Pages.

El logo se preparó con la herramienta integrada de edición de imágenes a partir del archivo aportado. Instrucción: quitar el fondo morado, conservar el monograma YK, gorro, cubiertos y círculo blancos, con fondo transparente y sin añadir elementos.

Los documentos de levantamiento, fotografías de referencia y demos alternativos permanecen locales y están excluidos de la publicación mediante `.gitignore`.

## Publicación y reversión

GitHub Pages publica automáticamente la raíz de la rama `main`. Tras modificar archivos, crear un commit y hacer `git push origin main`. Revisar el despliegue en la pestaña Actions y comprobar la URL pública. Para deshacer un cambio publicado, usar `git revert <commit>` y subir el nuevo commit.
