# Checklist de aprobación para publicación futura

Estado general: **bloqueado hasta completar aprobaciones humanas**. Ninguna URL propuesta fue creada ni publicada.

## Aprobaciones clínicas

### Comprobaciones realizadas

- [x] Piso pélvico: NICE NG210 verificado para supervisión y adaptación individual del entrenamiento de piso pélvico.
- [x] Hombro: JOSPT 2025, DOI `10.2519/jospt.2025.13182`, verificado por registro de búsqueda y PubMed; su alcance es tendinopatía del manguito rotador en adultos, no todo dolor de hombro.
- [x] Rodilla: AAOS verificado para recuperación y signos de alerta luego de artroplastia total de rodilla; no se extrapoló a otras cirugías.
- [x] EPOC: GOLD 2025 y su capítulo de rehabilitación pulmonar/autocuidado identificados y accesibles.

### Pendientes de profesional competente

- [ ] Aprobar versión final y fuentes del artículo de piso pélvico; confirmar alcance de síntomas y población atendida.
- [ ] Aprobar las señales de alarma del artículo de hombro y verificar que no omitan derivaciones relevantes.
- [ ] Aprobar el artículo de rodilla y confirmar que cualquier pauta sea consistente con procedimientos concretos atendidos.
- [ ] Aprobar criterios de urgencia, derivación y lenguaje de rehabilitación del artículo de EPOC.
- [ ] Definir fecha de revisión clínica y profesional responsable visible antes de indexar.

## Confirmaciones comerciales

### Comprobaciones realizadas

- [x] Piso pélvico e incontinencia: leyenda de atención exclusivamente particular, sin obra social, incluida en candidato.
- [x] Respiratoria/EPOC: misma leyenda incluida en candidato y CTA particular.
- [x] Tendinitis y postoperatorio: no afirman cobertura, reintegro, precio ni convenio.

### Pendientes de responsable comercial

- [ ] Confirmar modalidad, documentación y coberturas vigentes para tendinitis de hombro.
- [ ] Confirmar modalidad, documentación y coberturas vigentes para rehabilitación postoperatoria de rodilla.
- [ ] Confirmar que el número de WhatsApp y los textos precompletados continúan siendo los oficiales antes de publicar.

## Validaciones técnicas y SEO

### Comprobaciones realizadas

- [x] Las cuatro URLs propuestas no existen en el repositorio.
- [x] CTA de los cuatro candidatos usa `wa.me/5491132016039` y texto URL-codificado.
- [x] La integración propuesta reutiliza `article-layout`, `article-body` y `hero-actions` de `styles.css`.
- [x] `git diff --check` ejecutado sin errores de espacios.
- [x] No se modificaron rutas públicas, sitemap ni los borradores originales durante esta fase.
- [x] Se revisó la plantilla actual de artículos: contiene `lang="es-AR"`, viewport, canonical, metadatos sociales, `Article` JSON-LD y el patrón visual reutilizable.
- [x] Se revisaron reglas CSS para lectura y responsive: `article-layout`, `article-body`, `hero-actions` y botón flotante tienen estilos y media queries existentes.
- [x] Se comprobó que el proyecto no ofrece staging/build/preview aislado: solo documenta un servidor estático manual de la raíz.

### Pendientes antes de publicación

- [ ] Crear HTML en entorno de prueba, con un H1 por página, `lang="es-AR"` y viewport.
- [ ] Habilitar un directorio o servidor temporal aislado, no desplegable y con `noindex, nofollow`, antes de crear una preview HTML.
- [ ] Incorporar metadatos SEO/sociales y `Article` JSON-LD consistentes con contenido, autora y fechas reales.
- [ ] Probar enlaces internos, canonical, CTA WhatsApp, menú móvil, foco de teclado y botón flotante en móvil.
- [ ] Ejecutar Lighthouse y revisar Core Web Vitals en las páginas implementadas.
- [ ] Validar HTML, datos estructurados y respuesta HTTP en entorno de prueba.
- [ ] Añadir al sitemap y al índice del blog solo después de todas las aprobaciones anteriores.
- [ ] Solicitar indexación solo después de comprobar que la versión aprobada es la desplegada.
## Actualización de preview aislada — 23/10/2026

- [x] Preview aislada generada fuera de la raíz pública en `%TEMP%\\kareh-private-content-preview`, con solo cuatro candidatos y assets mínimos.
- [x] Servidor limitado a `127.0.0.1:4173`, allowlist de archivos, meta/cabecera `noindex` y 404 verificado ante traversal y `/admin/`.
- [x] Cuatro previews verificadas: H1 único, meta description, CTA WhatsApp, sin canonical/JSON-LD ni enlaces navegables a rutas públicas. Piso pélvico y EPOC incluyen aviso de atención exclusivamente particular.
- [ ] Pendiente: Lighthouse, consola, revisión visual en escritorio y móvil, teclado/foco y CTA flotante; no hay navegador automatizable ni Lighthouse disponibles localmente.
- [ ] Pendiente: aprobaciones clínicas de los cuatro contenidos; confirmación comercial de tendinitis y postoperatorio. La preview no autoriza publicación, sitemap ni indexación.

Esta actualización reemplaza los ítems técnicos anteriores que indicaban crear una preview o habilitar un servidor aislado: ambos fueron completados solo para la copia local. Los restantes pendientes de publicación continúan vigentes.

- [x] QA estático adicional: idioma, viewport, orden de H1/H2/H3, semántica del CTA WhatsApp y ausencia de imágenes sin `alt` comprobados en los cuatro candidatos.

