# PLAN DE CORRECCIÓN SEO - KAREH

## ANÁLISIS DE CONTRADICCIONES CON EL NUEVO POSICIONAMIENTO

### Problemas Críticos Detectados:

1. **SERVICIOS QUE NO DEBEN POSICIONARSE** (según prompt):
   - `/servicios/lesiones-deportivas-bella-vista/` → DEPORTOLOGÍA (prohibido)
   - Keywords en meta: "lesiones deportivas Bella Vista", "rehabilitación deportiva"

2. **PÁGINAS DUPLICADAS/HUÉRFANAS**:
   - `/servicios/rehabilitacion-postoperatoria/` (hub) vs `/servicios/rehabilitacion-postoperatoria-bella-vista/`
   - `/servicios/piso-pelvico/` vs `/servicios/piso-pelvico-bella-vista/`

3. **INCONSISTENCIAS DE DATOS**:
   - Nombre: "Kareh" vs "Kareh - Centro de Kinesiología y Fisiatría"
   - Horarios: index.html dice 19:00, otros lados dice 19:00
   - og:url con doble slash: `https://kareh.com.ar/servicios//`
   - og:url sin https:// en algunas páginas

4. **FALTA DE METADATA**:
   - Localidades: sin JSON-LD, Twitter Cards, og:image
   - Blog: sin JSON-LD Article, author, fechas
   - Página blog/index.html: sin JSON-LD

5. **SITEMAP INCOMPLETO**:
   - Faltan: `/servicios/piso-pelvico-bella-vista/`
   - URLs inconsistentes con canonical

## ESTRATEGIA DE CORRECCIÓN

### FASE 1: Unificación de Identidad (PRIORIDAD 1)
- [x] Establecer nombre oficial: "Kareh - Centro de Kinesiología y Fisiatría"
- [ ] Corregir horarios a: 14-18, 17:30-18, 8-12
- [ ] Corregir todas las inconsistencias de og:url

### FASE 2: Limpieza de Arquitectura (PRIORIDAD 1)
- [ ] Decidir destino de `/servicios/lesiones-deportivas-bella-vista/`
- [ ] Consolidar páginas duplicadas de postoperatoria
- [ ] Consolidar páginas duplicadas de piso pélvico
- [ ] Actualizar sitemap.xml

### FASE 3: SEO Técnico (PRIORIDAD 2)
- [ ] Agregar JSON-LD en localidades (LocalBusiness)
- [ ] Agregar JSON-LD Article en blog
- [ ] Corregir meta keywords faltantes
- [ ] Agregar Twitter Cards en localidades
- [ ] Agregar og:image en localidades

### FASE 4: Contenido (PRIORIDAD 3-5)
- [ ] Revisar contenido de servicios contra el prompt
- [ ] Actualizar meta descriptions
- [ ] Agregar author y fechas en blog

### FASE 5: Verificación Final
- [ ] Auditoría completa
- [ ] Verificar consistencia NAP
- [ ] Verificar enlaces internos
- [ ] Verificar schema.org

## DECISIONES TOMADAS

1. **Lesiones deportivas**: ELIMINAR página (contradice posicionamiento)
2. **Postoperatoria**: Mantener `/servicios/rehabilitacion-postoperatoria-bella-vista/` como página principal, redirigir o noindex el hub
3. **Piso pélvico**: Mantener `/servicios/piso-pelvico/` como principal, noindex `/servicios/piso-pelvico-bella-vista/`
4. **Nombre**: Unificar a "Kareh - Centro de Kinesiología y Fisiatría" en todo el sitio
5. **Horarios**: Unificar a los horarios del prompt (14-18, 17:30-18, 8-12)

## ARCHIVOS A MODIFICAR

### Todos los HTML (27 archivos):
- index.html
- servicios/index.html
- servicios/rehabilitacion-traumatologica-bella-vista/index.html
- servicios/rehabilitacion-postoperatoria/index.html
- servicios/rehabilitacion-postoperatoria-bella-vista/index.html
- servicios/kinesiologia-respiratoria/index.html
- servicios/kinesiologia-respiratoria-pediatrica/index.html
- servicios/piso-pelvico/index.html
- servicios/piso-pelvico-bella-vista/index.html
- servicios/tratamiento-incontinencia-urinaria/index.html
- servicios/dolor-lumbar-bella-vista/index.html
- servicios/tendinitis-bella-vista/index.html
- servicios/lesiones-deportivas-bella-vista/index.html → ELIMINAR
- servicios/ultrasonido-terapeutico/index.html
- cobertura-y-convenios/index.html
- contacto/index.html
- faqs/index.html
- blog/index.html
- blog/dolor-lumbar-causas-cuando-consultar/index.html
- blog/esguince-de-tobillo-recuperacion-kinesiologia/index.html
- blog/incontinencia-urinaria-piso-pelvico-mitos-verdades/index.html
- blog/kinesiologia-respiratoria-ninos/index.html
- localidades/san-miguel/index.html
- localidades/muniz/index.html
- localidades/jose-c-paz/index.html
- localidades/hurlingham/index.html
- obras-sociales/index.html

### Archivos de configuración:
- sitemap.xml
- robots.txt (opcional, está bien)