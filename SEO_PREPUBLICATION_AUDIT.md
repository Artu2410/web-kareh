# Auditoría de prepublicación — borradores SEO

**Fecha de auditoría:** 23 de octubre de 2026  
**Alcance:** `SEO_CONTENT_DRAFTS.md`, las páginas de servicio relacionadas y el patrón actual de artículos.  
**Estado:** no aprobar para publicación automática. No se crearon URLs, no se alteró el sitemap y no se desplegó contenido.

## Estado de Git y preservación

Al comenzar había cambios locales en FAQs, servicios regulados y artículos existentes. Se preservaron. Este trabajo agrega únicamente este informe; no edita `SEO_CONTENT_DRAFTS.md` ni archivos públicos.

## Decisión SEO de arquitectura

Los cuatro borradores responden a intención informativa distinta de sus servicios: explican una condición, una etapa de recuperación o una duda antes de solicitar atención. Por ello, los slugs propuestos bajo `blog/` son razonables y no duplican una URL actual. El servicio debe mantener la intención transaccional/local y el artículo derivar hacia él con un único enlace contextual principal.

No publicar dos variantes geolocalizadas del mismo artículo. La mención natural de Bella Vista y San Miguel es suficiente; “Zona Oeste” puede mantenerse en el contexto local, no repetirse en cada encabezado.

## Evaluación por borrador

### 1. Qué es la kinesiología del piso pélvico

**URL propuesta:** `/blog/que-es-kinesiologia-piso-pelvico/`  
**Diferenciación:** buena. El servicio `/servicios/piso-pelvico/` capta turnos; el borrador explica la disciplina y la primera consulta. Riesgo de canibalización bajo si el servicio conserva su foco en atención/tratamiento y este artículo conserva “qué es”.  
**SEO:** título y metadescripción claros, naturales y alineados con intención informativa. La keyword principal está en título, H1 y primer párrafo sin sobreoptimización.  
**Estructura/UX:** H1 único, H2 y H3 lógicos, FAQs útiles y CTA específico. Al pasarlo a HTML, el aviso de modalidad debe ir inmediatamente después de la introducción y de nuevo junto al CTA final.  
**Enlaces sugeridos:** `/servicios/piso-pelvico/` como destino principal; `/servicios/tratamiento-incontinencia-urinaria/` solo donde se menciona ese síntoma; `/faqs/` al final.  
**Clínico:** la definición anatómica y la necesidad de individualizar el entrenamiento son compatibles de manera general con la guía NICE sobre disfunción de piso pélvico. La fuente enlazada devuelve una interposición técnica en esta auditoría, por lo que se debe verificar el texto exacto y la aplicabilidad local antes de citarla públicamente.  
**Corrección recomendada:** agregar una FAQ sobre qué información llevar a la primera consulta, sin afirmar que siempre es obligatoria una orden médica.  
**Comercial:** correcto: informa “exclusivamente particular, sin cobertura por obra social”.

### 2. Tendinitis de hombro: tratamiento kinésico

**URL propuesta:** `/blog/tendinitis-hombro-tratamiento-kinesico/`  
**Diferenciación:** buena frente a `/servicios/tendinitis/`, que aborda tendinopatías en general. Este borrador resuelve una duda por región corporal. Riesgo bajo mientras el H1 no se convierta en “tratamiento de tendinitis en Bella Vista”, frase reservada para el servicio.  
**SEO:** título y descripción responden a búsqueda de problema/solución. La terminología es prudente al distinguir dolor de hombro de tendinitis.  
**Estructura/UX:** jerarquía adecuada, pero conviene sumar una FAQ: “¿Qué información puedo enviar por WhatsApp?” para mejorar el primer contacto. El CTA codificado es específico y no promete reserva.  
**Enlaces sugeridos:** `/servicios/tendinitis/` como principal, `/servicios/rehabilitacion-traumatologica-bella-vista/` como secundario y `/faqs/`.  
**Clínico:** requiere revisión profesional. La URL JOSPT citada respondió 403 durante la auditoría, por lo cual no fue posible contrastar el documento ni confirmar que el DOI corresponde a la guía prevista. No publicar esa cita tal como está: sustituir por una fuente verificable o confirmar el DOI con la profesional. Las señales de alarma deben ser aprobadas clínicamente, en particular la inclusión de dolor de pecho en un artículo de hombro.  
**Comercial:** correcto: la cobertura queda pendiente de confirmación y no se afirma ni exclusión ni aceptación.

### 3. Rehabilitación postoperatoria de rodilla

**URL propuesta:** `/blog/rehabilitacion-postoperatoria-rodilla/`  
**Diferenciación:** buena frente a `/servicios/rehabilitacion-postoperatoria/`; ofrece una guía de decisión general para personas luego de cirugía de rodilla. Riesgo bajo si se evita crear otros artículos por cada técnica quirúrgica sin estrategia editorial.  
**SEO:** título y metadescripción responden a “recuperación de cirugía de rodilla”. La redacción no fuerza las localidades.  
**Estructura/UX:** adecuada; las FAQs responden dudas frecuentes sin fijar plazos. El CTA especifica el motivo de consulta y no confirma turno.  
**Enlaces sugeridos:** `/servicios/rehabilitacion-postoperatoria/` como principal, `/servicios/rehabilitacion-postoperatoria-bella-vista/` como alternativa local y `/faqs/`.  
**Clínico:** aprobación obligatoria. La fuente AAOS verificada aplica a reemplazo total de rodilla, no a la totalidad de las cirugías que menciona el borrador (ligamentos, meniscos, rótula y reemplazos). La afirmación de que cada cirugía tiene restricciones y protocolo diferente es prudente, pero la fuente debe ajustarse al alcance o el artículo debe limitar explícitamente la información educativa a principios generales. Los signos de alarma son apropiados como orientación general, pero deben ser validados por un profesional antes de publicarlos.  
**Comercial:** correcto: no comunica cobertura ni falta de cobertura.

### 4. Kinesiología respiratoria para adultos con EPOC

**URL propuesta:** `/blog/kinesiologia-respiratoria-adultos-epoc/`  
**Diferenciación:** aceptable frente a `/servicios/kinesiologia-respiratoria/`, donde EPOC ya aparece como una condición atendida. Para reducir canibalización, el servicio debe mantenerse como página de turnos para respiratoria adulta y el artículo como guía sobre rehabilitación programada, seguimiento médico y signos de urgencia.  
**SEO:** título, descripción y términos secundarios son naturales. Evitar repetir “EPOC” innecesariamente fuera de título, H1, primer párrafo y un H2.  
**Estructura/UX:** H1 único, FAQs útiles, CTA específico y advertencia visible. En la versión HTML, repetir la leyenda particular junto al CTA y sumar un enlace de “si es una urgencia, buscá atención médica” sin dirigir a WhatsApp.  
**Enlaces sugeridos:** `/servicios/kinesiologia-respiratoria/` como principal; `/faqs/` y `/contacto/` como complementos. No enlazar a la página pediátrica salvo comparación editorial explícita.  
**Clínico:** aprobación obligatoria. GOLD 2025 fue verificado como informe estratégico basado en evidencia para diagnóstico, manejo y prevención de EPOC. No se inspeccionó el PDF íntegro en esta auditoría; por lo tanto, no se valida que cada formulación del borrador sea una recomendación literal. Mantener la redacción condicional (“puede formar parte”, “cuando está indicada”) y hacer que la profesional revise las señales de alarma y cualquier descripción de rehabilitación.  
**Comercial:** correcto: exclusivamente particular y sin obra social, tanto en cuerpo como FAQ y CTA.

## Riesgos clínicos y comerciales transversales

| Riesgo | Impacto | Acción previa a publicación |
|---|---|---|
| Contenido sanitario sin firma/revisión profesional | Alto | Validación y fecha de revisión por profesional responsable. |
| Fuente JOSPT no verificable en esta auditoría | Alto | Confirmar DOI o reemplazarla por una guía accesible y pertinente. |
| Fuente AAOS limitada a artroplastia total | Medio/alto | Acotar el alcance o incorporar fuente aplicable a cada cirugía mencionada. |
| Urgencias respiratorias y postoperatorias | Alto | Validar redacción y añadir circuito de urgencia que no dependa de WhatsApp. |
| Cobertura de tendinitis y postoperatorio | Alto comercial | Obtener confirmación formal antes de declarar modalidad. |
| Particular de piso pélvico y respiratoria | Alto comercial | Mantener la leyenda exacta, también en CTA y FAQ. |

## Integración técnica y experiencia de usuario

El patrón existente de blog usa `page-shell--compact`, `section`, `article-layout`, `article-body`, `hero-actions` y el CSS centralizado en `styles.css`. `article-layout` limita el ancho a 52rem y `article-body` usa grilla, tipografía y espaciado apropiados para lectura móvil. Los nuevos artículos deberían reutilizar este patrón, el encabezado, footer y botón flotante existentes; no requieren CSS nuevo.

Antes de implementar, corregir el desajuste observado en el artículo existente de esguince: el título, Open Graph, Twitter y JSON-LD no están completamente sincronizados, y hay caracteres mal codificados en un párrafo. No se modificó en esta auditoría para preservar cambios locales fuera de alcance.

## Checklist técnico para la futura publicación

- [ ] Crear únicamente las cuatro rutas aprobadas y agregar canonical autoreferente.
- [ ] Agregar cada URL al sitemap y al índice de blog solo después de aprobación clínica/comercial.
- [ ] Un único H1; título SEO, meta description, `lang="es-AR"` y viewport.
- [ ] JSON-LD `Article` coherente con título, descripción, fecha real de publicación y autora confirmada.
- [ ] No añadir `FAQPage` hasta confirmar que las preguntas/respuestas son visibles y vigentes.
- [ ] Reutilizar el CTA y codificar el texto de WhatsApp; conservar `target="_blank"` y `rel="noopener noreferrer"`.
- [ ] Confirmar que los enlaces internos y la URL canónica responden correctamente en entorno de prueba.
- [ ] Verificar menú móvil, foco visible, contraste, orden de tabulación y que el botón flotante no tape CTA ni pie.
- [ ] Ejecutar auditoría Lighthouse y validación de datos estructurados en un entorno accesible.
- [ ] Revisar metadatos sociales, imagen Open Graph y la codificación UTF-8 antes de publicar.

## Métricas recomendadas

- Impresiones, clics, CTR y posición por consulta en Search Console.
- Consultas no marcarias locales: Bella Vista, San Miguel y Zona Oeste combinadas con cada tema.
- Clics en CTA WhatsApp por artículo, servicio destino y dispositivo.
- Tasa de paso artículo → servicio → WhatsApp.
- Engagement: scroll, tiempo de lectura y apertura de FAQs, respetando la política de privacidad aplicable.
- Indexación, URL canónica elegida por Google, Core Web Vitals y errores de rastreo.

## Validaciones ejecutadas y no ejecutadas

**Ejecutadas:** inspección de Git; confirmación de que las cuatro URLs propuestas aún no existen; revisión del documento y enlaces de WhatsApp; revisión del HTML/CSS de artículo existente; contraste de disponibilidad de fuentes.  
**No ejecutadas:** revisión clínica por profesional competente; prueba visual en navegador/dispositivos móviles; Lighthouse; comprobación HTTP de rutas futuras; validación de Search Console, datos estructurados o analítica. Estas tareas requieren páginas HTML implementadas o acceso a las plataformas correspondientes.

## Aprobaciones pendientes

1. Profesional responsable: piso pélvico, hombro, postoperatorio y EPOC; con especial foco en urgencias, alcance de cada tratamiento y fuentes.
2. Responsable comercial: cobertura/modalidad de tendinitis y rehabilitación postoperatoria.
3. Responsable editorial: URL definitiva, fecha real de publicación, imagen y autora visible.
4. Responsable técnico: implementación en entorno de prueba, QA móvil y aprobación previa a indexación.
