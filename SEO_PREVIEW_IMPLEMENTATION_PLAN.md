# Plan de implementación de prueba aislada

Estado: **plan solamente; no se creó vista previa ni URL HTML pública**.

## Entorno detectado

El proyecto es estático. `README.md` documenta `python -m http.server 8080`, que sirve el directorio actual; `package.json` no contiene scripts de desarrollo, build, preview ni staging. No se detectó un directorio de staging ni una configuración de entorno aislado.

Por seguridad, no se deben crear los cuatro HTML dentro del repositorio hasta disponer de una de estas alternativas:

1. Un directorio temporal fuera de la raíz desplegable, copiado con los assets mínimos y servido únicamente en `localhost`.
2. Una rama o entorno de preview del proveedor, confirmado como no indexable y no productivo.
3. Un proceso de build que envíe solo artefactos aprobados a un directorio de preview excluido del despliegue.

## Archivos que se crearían tras las aprobaciones

- `blog/que-es-kinesiologia-piso-pelvico/index.html`
- `blog/tendinitis-hombro-tratamiento-kinesico/index.html`
- `blog/rehabilitacion-postoperatoria-rodilla/index.html`
- `blog/kinesiologia-respiratoria-adultos-epoc/index.html`

No crear estos archivos antes de contar con la aprobación clínica y comercial correspondiente.

## Plantilla de integración

Cada página debe derivarse de la plantilla de artículo existente y conservar:

- `html lang="es-AR"`, `meta charset` y `meta viewport`.
- `body.page-shell.page-shell--compact`.
- `main > section.section.section-soft > div.container.article-layout`.
- Contenido en `article.article-body`; un único H1, H2/H3 del candidato y FAQs visibles.
- CTA final dentro de `div.hero-actions`, con el enlace `wa.me` ya codificado en `SEO_CONTENT_CANDIDATE.md`.
- Header, footer, script global y botón flotante existentes.

`styles.css` ya define anchos de lectura para `article-layout`, espaciado tipográfico para `article-body` y reglas responsive para `hero-actions` y el botón flotante. No se necesita CSS específico previsto.

## Metadatos previstos

Cada HTML requerirá title, meta description, canonical autoreferente, Open Graph, Twitter y JSON-LD `Article` coherentes entre sí. Las fechas, imagen social y autora se completarán solo con datos confirmados. Hasta la aprobación no se usará `index,follow` en una vista de preview: el entorno aislado debe responder con `noindex, nofollow` y no incluirse en sitemap.

## Controles de contenido antes de integrar

- Piso pélvico y EPOC: leyenda visible de atención exclusivamente particular, sin obra social, debajo de la introducción y junto al CTA.
- Tendinitis y postoperatorio: no incluir afirmaciones de cobertura, precio, reintegro o convenios.
- Rodilla: limitar el aviso de signos posteriores a artroplastia total a ese procedimiento y remitir al equipo quirúrgico para otras cirugías.
- Hombro: indicar que la fuente cubre tendinopatía del manguito rotador, no cualquier dolor de hombro.

## Protocolo de QA para la futura preview

1. Generar los HTML en un directorio temporal no desplegable y servirlo solo en `localhost`.
2. Comprobar en 360 px, 720 px y 980 px: lectura, quiebres de encabezado, CTA, navegación y ausencia de solapamiento con el botón flotante.
3. Revisar navegación por teclado, foco visible, `alt` de imagen social y contraste.
4. Verificar canonical, metadatos, JSON-LD, enlaces internos, enlaces WhatsApp y consola del navegador.
5. Ejecutar Lighthouse y un verificador de enlaces sobre la preview local.
6. Eliminar la preview temporal al finalizar o conservarla fuera del repositorio, nunca como artefacto de producción.

## Bloqueos

La creación de la preview está bloqueada por falta de un directorio/servidor aislado confirmado y por aprobaciones clínicas y comerciales pendientes. No debe usarse el servidor de la raíz del proyecto para presentar contenido candidato como si fuera producción.
## Implementación ejecutada: preview aislada

La preview se genera en `%TEMP%\\kareh-private-content-preview` (fuera de `C:\\web-kareh`; en esta sesión `C:\\Users\\centr\\AppData\\Local\\Temp\\kareh-private-content-preview`). Solo incluye cuatro HTML candidatos, `index.html`, `styles.css`, `script.js`, `logo-icon.png` y `robots.txt`; no copia credenciales, Supabase, administración, archivos públicos ni otros assets.

Crear: `node scripts/create-private-preview.js`. Servir: `node scripts/serve-private-preview.js`, abrir `http://127.0.0.1:4173` y detener con `Ctrl+C`. Se enlaza únicamente a `127.0.0.1`, permite solo archivos de la copia mínima y devuelve 404 ante traversal o `/admin/`.

Incluye `noindex,nofollow,noarchive,nosnippet` como meta y cabecera, `robots.txt` con `Disallow: /`, y no contiene canonical público ni JSON-LD. Son defensas complementarias: la privacidad depende del aislamiento local, no de `noindex` por sí solo. Los destinos internos se muestran como texto, no llevan a URLs públicas.

Pruebas ejecutadas 23/10/2026: cuatro HTML generados; H1 único, meta description, CTA WhatsApp, robots, ausencia de canonical/JSON-LD y enlaces públicos verificados; aviso particular validado en piso pélvico y EPOC. HTTP devolvió 200 con cabecera noindex para un artículo y 404 para traversal y `/admin/index.html`. Lighthouse, capturas, navegador automatizado y revisión visual móvil quedan pendientes: no están disponibles localmente.

Esta sección reemplaza el estado anterior de “plan solamente” y el bloqueo técnico por falta de entorno aislado. Permanecen los bloqueos de aprobación clínica y comercial; no se crearon rutas públicas, sitemap ni despliegue.

QA editorial y accesibilidad estático adicional (23/10/2026): los cuatro HTML verifican `lang="es-AR"`, viewport, secuencia de encabezados sin saltos, un único CTA `wa.me` con texto accesible y atributos `target="_blank"` / `rel="noopener noreferrer"`; no contienen imágenes sin `alt` (la preview no incorpora imágenes editoriales). Esto no sustituye la inspección visual, el foco por teclado real, contraste calculado, consola ni pruebas responsive en navegador.

