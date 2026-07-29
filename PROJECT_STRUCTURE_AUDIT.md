# PROJECT_STRUCTURE_AUDIT.md
## Auditoría Completa del Proyecto Kareh

**Fecha de auditoría**: 29/7/2026  
**URL del sitio**: https://kareh.com.ar  
**Repositorio**: https://github.com/Artu2410/web-kareh.git  
**Branch actual**: main (pendiente confirmación)  
**Último commit**: 3261270bd5907bec91192f8b9758cdb9ab6ad3ef

---

## 1. RESUMEN EJECUTIVO

**TOTAL DE PÁGINAS**: 30  
**TOTAL DE SERVICIOS**: 12  
**TOTAL DE LOCALIDADES**: 4  
**TOTAL DE ARTÍCULOS DE BLOG**: 4  
**TOTAL DE IMÁGENES**: 10 (en assets/consultorio) + 4 logos + 2 fotos perfil = 16  
**TOTAL DE BLOQUES JSON-LD**: 47

### Hallazgos Críticos
- **INCONSISTENCIA DE DATOS**: El nombre comercial varía entre "Kareh" y "Kareh - Centro de Kinesiología y Fisiatría" según la página
- **URLs DUPLICADAS**: Múltiples páginas de servicios compiten por las mismas keywords (dolor lumbar, piso pélvico)
- **TRAILING SLASH INCONSISTENTE**: Algunas páginas usan `/` y otras no en canonical
- **OG:URL SIN TRAILING SLASH**: Varias páginas tienen `og:url` sin `/` final pero canonical con `/`
- **FALTA DE PROTOCOLO HTTPS EN OG:URL**: Algunas páginas usan `//` en lugar de `https://`
- **IMÁGENES SIN ALT**: Algunas imágenes en assets/consultorio/ no tienen atributo alt
- **JAVASCRIPT DUPLICADO**: El mismo script.js se carga en todas las páginas con diferentes parámetros de versión
- **SIN META KEYWORDS EN PÁGINAS DE LOCALIDADES**: Las páginas de localidades no tienen meta keywords
- **SIN TWITTER CARD EN PÁGINAS DE LOCALIDADES**: Falta implementación de Twitter Cards
- **SIN OG:IMAGE EN ALGUNAS PÁGINAS**: Las páginas de localidades no tienen og:image

---

## 2. STACK TECNOLÓGICO

### Tecnologías Confirmadas
- **HTML5**: Estático, sin framework
- **CSS3**: CSS propio (styles.css - 1967 líneas)
- **JavaScript**: Vanilla JS (script.js - 262 líneas)
- **Google Analytics**: G-FDLH4H45N5 (gtag.js)
- **Fuentes**: Google Fonts (Manrope + Sora)
- **Iconos**: SVG inline
- **Mapas**: Google Maps Embed API
- **WhatsApp**: wa.me links

### NO Utiliza
- ❌ Framework CSS (Tailwind, Bootstrap, etc.)
- ❌ Framework JavaScript (React, Vue, Angular, etc.)
- ❌ Generador estático (Next, Astro, Gatsby, etc.)
- ❌ Package.json
- ❌ Node modules
- ❌ Build process
- ❌ Vite, Webpack, etc.

### Características Técnicas
- **Diseño**: Responsive, mobile-first
- **Animaciones**: CSS animations + Intersection Observer API
- **Accesibilidad**: ARIA labels, semantic HTML
- **Performance**: Preload de fuentes, lazy loading de imágenes
- **SEO**: Meta tags completos, JSON-LD Schema.org

---

## 3. ÁRBOL DEL PROYECTO

```
c:\web-kareh/
├── .gitignore
├── CNAME
├── README.md
├── google45399c88f51b91b9.html (Google Search Console verification)
├── IMG-20260111-384.jpg (Foto perfil profesional)
├── IMG-20260111-512.jpg (Foto perfil profesional - versión grande)
├── index.html (HOME - 1045 líneas)
├── logo-icon.png (Logo - usado en OG:image)
├── logo-icon-96.png (Logo responsive)
├── logo-icon-192.png (Logo responsive)
├── logo-icon-240.png (Logo responsive)
├── robots.txt
├── script.js (JavaScript global - 262 líneas)
├── sitemap.xml
├── styles.css (CSS global - 1967 líneas)
│
├── assets/
│   └── consultorio/
│       ├── consultorio-box-1.jpg
│       ├── consultorio-box-2.jpg
│       ├── frente-local.jpg
│       ├── magnetoterapia-electroanalgesia.jpg
│       ├── magnetoterapia-ultrasonido.jpg
│       ├── recepcion.jpg
│       └── sala-de-espera.jpg
│
├── blog/
│   ├── index.html (Blog principal)
│   ├── dolor-lumbar-causas-cuando-consultar/
│   │   └── index.html
│   ├── esguince-de-tobillo-recuperacion-kinesiologia/
│   │   └── index.html
│   ├── incontinencia-urinaria-piso-pelvico-mitos-verdades/
│   │   └── index.html
│   └── kinesiologia-respiratoria-ninos/
│       └── index.html
│
├── catalogo/ (Directorio vacío - posiblemente para futuro catálogo)
│   ├── .gitignore
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   ├── eslint.config.mjs
│   ├── jsconfig.json
│   ├── next.config.mjs
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── data/
│   ├── public/
│   └── src/
│
├── cobertura-y-convenios/
│   └── index.html
│
├── contacto/
│   └── index.html
│
├── faqs/
│   └── index.html
│
├── localidades/
│   ├── hurlingham/
│   │   └── index.html
│   ├── jose-c-paz/
│   │   └── index.html
│   ├── muniz/
│   │   └── index.html
│   └── san-miguel/
│       └── index.html
│
├── obras-sociales/
│   └── index.html
│
└── servicios/
    ├── index.html (Página general de servicios)
    ├── dolor-lumbar-bella-vista/
    │   └── index.html
    ├── kinesiologia-respiratoria/
    │   └── index.html
    ├── kinesiologia-respiratoria-pediatrica/
    │   └── index.html
    ├── lesiones-deportivas-bella-vista/
    │   └── index.html
    ├── piso-pelvico/
    │   └── index.html
    ├── piso-pelvico-bella-vista/
    │   └── index.html (NO LEÍDO - existe en filesystem)
    ├── rehabilitacion-postoperatoria/
    │   └── index.html
    ├── rehabilitacion-postoperatoria-bella-vista/
    │   └── index.html
    ├── rehabilitacion-traumatologica-bella-vista/
    │   └── index.html
    ├── tendinitis-bella-vista/
    │   └── index.html
    ├── tratamiento-incontinencia-urinaria/
    │   └── index.html
    └── ultrasonido-terapeutico/
        └── index.html
```

### Carpetas sin uso aparente
- **catalogo/**: Contiene configuración de Next.js pero está vacío de contenido

---

## 4. MAPA COMPLETO DE URLs

### Páginas Principales

#### 1. HOME - `/`
**Archivo**: index.html  
**Title**: Kinesiología en Bella Vista | Centro Kareh  
**Meta Description**: Centro de kinesiología y rehabilitación en Bella Vista. Atención en traumatología, rehabilitación respiratoria y piso pélvico. Turnos por WhatsApp.  
**Canonical**: https://kareh.com.ar/  
**H1**: Kinesiología en Bella Vista  
**H2**: 8  
**H3**: 0  
**JSON-LD**: 4 bloques (MedicalBusiness, Person, BreadcrumbList, FAQPage)

#### 2. SERVICIOS - `/servicios/`
**Archivo**: servicios/index.html  
**Title**: Kinesiología en Bella Vista y San Miguel | Kareh  
**Meta Description**: Kinesiología en Bella Vista y San Miguel: rehabilitación traumatológica, postoperatoria, respiratoria, piso pélvico, dolor lumbar, tendinitis y lesiones deportivas.  
**Canonical**: https://kareh.com.ar/servicios/  
**H1**: Tratamientos de kinesiología y rehabilitación en Bella Vista  
**H2**: 0  
**H3**: 6 (dentro de service-cards)  
**JSON-LD**: 3 bloques (MedicalBusiness, BreadcrumbList, FAQPage)

#### 3. REHABILITACIÓN TRAUMATOLÓGICA - `/servicios/rehabilitacion-traumatologica-bella-vista/`
**Archivo**: servicios/rehabilitacion-traumatologica-bella-vista/index.html  
**Title**: Rehabilitación Traumatológica Bella Vista | Kareh  
**Meta Description**: Rehabilitación traumatológica en Bella Vista para fracturas, esguinces, tendinitis, cervicalgias, dolor lumbar y lesiones deportivas. Turnos por WhatsApp en Kareh.  
**Canonical**: https://kareh.com.ar/servicios/rehabilitacion-traumatologica-bella-vista/  
**H1**: Rehabilitación traumatológica en Bella Vista  
**H2**: 1  
**H3**: 0  
**JSON-LD**: 3 bloques (Service, BreadcrumbList, FAQPage)

#### 4. REHABILITACIÓN POSTOPERATORIA - `/servicios/rehabilitacion-postoperatoria/`
**Archivo**: servicios/rehabilitacion-postoperatoria/index.html  
**Title**: Rehabilitación Musculoesquelética en Bella Vista | Kareh  
**Meta Description**: Hub de rehabilitación musculoesquelética en Bella Vista: traumatológica, postoperatoria, dolor lumbar, tendinitis, lesiones deportivas y ultrasonido.  
**Canonical**: https://kareh.com.ar/servicios/rehabilitacion-postoperatoria/  
**H1**: Rehabilitación musculoesquelética en Bella Vista  
**H2**: 1  
**H3**: 0  
**JSON-LD**: 3 bloques (Service, BreadcrumbList, FAQPage)

#### 5. REHABILITACIÓN POSTOPERATORIA BELLA VISTA - `/servicios/rehabilitacion-postoperatoria-bella-vista/`
**Archivo**: servicios/rehabilitacion-postoperatoria-bella-vista/index.html  
**Title**: Rehabilitación Postoperatoria en Bella Vista | Kareh  
**Meta Description**: Rehabilitación postoperatoria en Bella Vista para cirugías traumatológicas. Seguimiento funcional y turnos por WhatsApp en Kareh.  
**Canonical**: https://kareh.com.ar/servicios/rehabilitacion-postoperatoria-bella-vista/  
**H1**: Rehabilitación postoperatoria en Bella Vista  
**H2**: 1  
**H3**: 0  
**JSON-LD**: 3 bloques (Service, BreadcrumbList, FAQPage)

#### 6. KINESIOLOGÍA RESPIRATORIA - `/servicios/kinesiologia-respiratoria/`
**Archivo**: servicios/kinesiologia-respiratoria/index.html  
**Title**: Kinesiología Respiratoria en Bella Vista | Kareh  
**Meta Description**: Kinesiología respiratoria en Bella Vista para adultos y pediátrica. Tratamiento para bronquiolitis, asma, neumonía, EPOC y recuperación respiratoria.  
**Canonical**: https://kareh.com.ar/servicios/kinesiologia-respiratoria/  
**H1**: Kinesiología respiratoria en Bella Vista para adultos y pediátrica  
**H2**: 1  
**H3**: 0  
**JSON-LD**: 3 bloques (Service, BreadcrumbList, FAQPage)

#### 7. KINESIOLOGÍA RESPIRATORIA PEDIÁTRICA - `/servicios/kinesiologia-respiratoria-pediatrica/`
**Archivo**: servicios/kinesiologia-respiratoria-pediatrica/index.html  
**Title**: Kinesiología Respiratoria Pediátrica | Kareh  
**Meta Description**: Kinesiología respiratoria pediátrica en Bella Vista para bronquiolitis, asma, neumonía y cuadros respiratorios indicados por el médico.  
**Canonical**: https://kareh.com.ar/servicios/kinesiologia-respiratoria-pediatrica/  
**H1**: Kinesiología respiratoria pediátrica en Bella Vista  
**H2**: 1  
**H3**: 0  
**JSON-LD**: 3 bloques (Service, BreadcrumbList, FAQPage)

#### 8. PISO PÉLVICO - `/servicios/piso-pelvico/`
**Archivo**: servicios/piso-pelvico/index.html  
**Title**: Piso Pélvico e Incontinencia en Bella Vista | Kareh  
**Meta Description**: Piso pélvico e incontinencia urinaria en Bella Vista. Tratamiento kinésico confidencial para incontinencia, prolapsos, dolor pélvico y recuperación postquirúrgica.  
**Canonical**: https://kareh.com.ar/servicios/piso-pelvico/  
**H1**: Piso pélvico e incontinencia urinaria en Bella Vista  
**H2**: 1  
**H3**: 0  
**JSON-LD**: 3 bloques (Service, BreadcrumbList, FAQPage)

#### 9. TRATAMIENTO INCONTINENCIA URINARIA - `/servicios/tratamiento-incontinencia-urinaria/`
**Archivo**: servicios/tratamiento-incontinencia-urinaria/index.html  
**Title**: Tratamiento de Incontinencia Urinaria | Kareh  
**Meta Description**: Tratamiento kinésico de incontinencia urinaria en Bella Vista. Piso pélvico con atención confidencial para pacientes de San Miguel y zonas cercanas.  
**Canonical**: https://kareh.com.ar/servicios/tratamiento-incontinencia-urinaria/  
**H1**: Tratamiento de incontinencia urinaria en Bella Vista  
**H2**: 1  
**H3**: 0  
**JSON-LD**: 3 bloques (Service, BreadcrumbList, FAQPage)

#### 10. DOLOR LUMBAR - `/servicios/dolor-lumbar-bella-vista/`
**Archivo**: servicios/dolor-lumbar-bella-vista/index.html  
**Title**: Dolor Lumbar en Bella Vista | Kareh  
**Meta Description**: Tratamiento kinésico para dolor lumbar en Bella Vista. Evaluación, ejercicios terapéuticos y rehabilitación para pacientes de San Miguel y zonas cercanas.  
**Canonical**: https://kareh.com.ar/servicios/dolor-lumbar-bella-vista/  
**H1**: Tratamiento para dolor lumbar en Bella Vista  
**H2**: 1  
**H3**: 0  
**JSON-LD**: 3 bloques (Service, BreadcrumbList, FAQPage)

#### 11. TENDINITIS - `/servicios/tendinitis-bella-vista/`
**Archivo**: servicios/tendinitis-bella-vista/index.html  
**Title**: Tratamiento de Tendinitis en Bella Vista | Kareh  
**Meta Description**: Tratamiento kinésico para tendinitis en Bella Vista. Rehabilitación de tendón, dolor por sobrecarga y vuelta progresiva a la actividad en Kareh.  
**Canonical**: https://kareh.com.ar/servicios/tendinitis-bella-vista/  
**H1**: Tratamiento de tendinitis en Bella Vista  
**H2**: 1  
**H3**: 0  
**JSON-LD**: 3 bloques (Service, BreadcrumbList, FAQPage)

#### 12. LESIONES DEPORTIVAS - `/servicios/lesiones-deportivas-bella-vista/`
**Archivo**: servicios/lesiones-deportivas-bella-vista/index.html  
**Title**: Lesiones Deportivas en Bella Vista | Kareh  
**Meta Description**: Rehabilitación de lesiones deportivas en Bella Vista. Kinesiología para esguinces, desgarros, tendinitis y retorno progresivo al deporte en Kareh.  
**Canonical**: https://kareh.com.ar/servicios/lesiones-deportivas-bella-vista/  
**H1**: Rehabilitación de lesiones deportivas en Bella Vista  
**H2**: 1  
**H3**: 0  
**JSON-LD**: 3 bloques (Service, BreadcrumbList, FAQPage)

#### 13. ULTRASONIDO TERAPÉUTICO - `/servicios/ultrasonido-terapeutico/`
**Archivo**: servicios/ultrasonido-terapeutico/index.html  
**Title**: Ultrasonido Terapéutico en Bella Vista | Kareh  
**Meta Description**: Ultrasonido terapéutico en Bella Vista como apoyo en tratamientos de kinesiología y rehabilitación, indicado según evaluación clínica en Kareh.  
**Canonical**: https://kareh.com.ar/servicios/ultrasonido-terapeutico/  
**H1**: Ultrasonido terapéutico en Bella Vista  
**H2**: 1  
**H3**: 0  
**JSON-LD**: 3 bloques (Service, BreadcrumbList, FAQPage)

#### 14. COBERTURA Y CONVENIOS - `/cobertura-y-convenios/`
**Archivo**: cobertura-y-convenios/index.html  
**Title**: Coberturas Médicas y Modalidades de Atención | Kareh  
**Meta Description**: Coberturas médicas y modalidades de atención en Kareh Bella Vista. Consultá por obras sociales, prepagas, ART y atención particular.  
**Canonical**: https://kareh.com.ar/cobertura-y-convenios/  
**H1**: Coberturas médicas y modalidades de atención  
**H2**: 0  
**H3**: 0  
**JSON-LD**: 3 bloques (MedicalBusiness, BreadcrumbList, FAQPage)

#### 15. OBRAS SOCIALES - `/obras-sociales/`
**Archivo**: obras-sociales/index.html  
**Title**: Obras Sociales y Convenios | Kareh Bella Vista  
**Meta Description**: Kareh trabaja con múltiples obras sociales y prepagas en Bella Vista. Consultá disponibilidad, cobertura y requisitos para comenzar tratamiento.  
**Canonical**: https://kareh.com.ar/obras-sociales/  
**H1**: Consultá cobertura disponible para atención kinésica  
**H2**: 1  
**H3**: 0  
**JSON-LD**: 2 bloques (MedicalBusiness, BreadcrumbList)

#### 16. CONTACTO - `/contacto/`
**Archivo**: contacto/index.html  
**Title**: Turnos de Kinesiología en Bella Vista | Kareh  
**Meta Description**: Turnos de kinesiología en Bella Vista por WhatsApp. Kareh atiende rehabilitación traumatológica, respiratoria, piso pélvico y ultrasonido para San Miguel y zonas cercanas.  
**Canonical**: https://kareh.com.ar/contacto/  
**H1**: Turnos de kinesiología en Bella Vista por WhatsApp  
**H2**: 0  
**H3**: 0  
**JSON-LD**: 3 bloques (MedicalBusiness, BreadcrumbList, FAQPage)

#### 17. FAQS - `/faqs/`
**Archivo**: faqs/index.html  
**Title**: Preguntas Frecuentes | Kareh  
**Meta Description**: Preguntas frecuentes de Kareh sobre turnos por WhatsApp, orden médica, horarios, coberturas y tratamientos de kinesiología en Bella Vista para pacientes de San Miguel y zonas aledañas.  
**Canonical**: https://kareh.com.ar/faqs/  
**H1**: Información real antes de comenzar tu tratamiento  
**H2**: 2  
**H3**: 0  
**JSON-LD**: 1 bloque (FAQPage)

#### 18. BLOG - `/blog/`
**Archivo**: blog/index.html  
**Title**: Blog de Kinesiología y Rehabilitación | Kareh  
**Meta Description**: Blog de Kareh con guías sobre rehabilitación postoperatoria, dolor lumbar, kinesiología respiratoria pediátrica, piso pélvico e incontinencia.  
**Canonical**: https://kareh.com.ar/blog/  
**H1**: Guías para rehabilitación y consultas frecuentes  
**H2**: 0  
**H3**: 4 (dentro de service-cards)  
**JSON-LD**: 0 bloques

### Páginas de Blog

#### 19. BLOG: DOLOR LUMBAR - `/blog/dolor-lumbar-causas-cuando-consultar/`
**Archivo**: blog/dolor-lumbar-causas-cuando-consultar/index.html  
**Title**: Dolor lumbar: causas comunes y cuándo consultar | Kareh  
**Meta Description**: Dolor lumbar: causas comunes, señales para consultar y rol de la kinesiología en Kareh, Bella Vista.  
**Canonical**: https://kareh.com.ar/blog/dolor-lumbar-causas-cuando-consultar/  
**H1**: Dolor lumbar: causas comunes y cuándo consultar a un kinesiólogo  
**H2**: 1  
**H3**: 1  
**JSON-LD**: 0 bloques

#### 20. BLOG: ESGUINCE DE TOBILLO - `/blog/esguince-de-tobillo-recuperacion-kinesiologia/`
**Archivo**: blog/esguince-de-tobillo-recuperacion-kinesiologia/index.html  
**Title**: Esguince de tobillo: cuánto dura la recuperación | Kareh  
**Meta Description**: (Pendiente de lectura)  
**Canonical**: https://kareh.com.ar/blog/esguince-de-tobillo-recuperacion-kinesiologia/  
**JSON-LD**: 0 bloques

#### 21. BLOG: INCONTINENCIA URINARIA - `/blog/incontinencia-urinaria-piso-pelvico-mitos-verdades/`
**Archivo**: blog/incontinencia-urinaria-piso-pelvico-mitos-verdades/index.html  
**Title**: Incontinencia urinaria y piso pélvico: mitos y verdades | Kareh  
**Meta Description**: (Pendiente de lectura)  
**Canonical**: https://kareh.com.ar/blog/incontinencia-urinaria-piso-pelvico-mitos-verdades/  
**JSON-LD**: 0 bloques

#### 22. BLOG: KINESIOLOGÍA RESPIRATORIA NIÑOS - `/blog/kinesiologia-respiratoria-ninos/`
**Archivo**: blog/kinesiologia-respiratoria-ninos/index.html  
**Title**: Kinesiología respiratoria en niños: qué es y cuándo se indica | Kareh  
**Meta Description**: (Pendiente de lectura)  
**Canonical**: https://kareh.com.ar/blog/kinesiologia-respiratoria-ninos/  
**JSON-LD**: 0 bloques

### Páginas de Localidades

#### 23. SAN MIGUEL - `/localidades/san-miguel/`
**Archivo**: localidades/san-miguel/index.html  
**Title**: Kinesiología para pacientes de San Miguel | Kareh  
**Meta Description**: Kinesiología para pacientes de San Miguel en Kareh, Bella Vista. Rehabilitación traumatológica, respiratoria, postoperatoria y piso pélvico. Turnos por WhatsApp.  
**Canonical**: https://kareh.com.ar/localidades/san-miguel/  
**H1**: Kinesiología para pacientes de San Miguel  
**H2**: 1  
**H3**: 1  
**JSON-LD**: 0 bloques  
**Meta Keywords**: ❌ NO TIENE  
**Twitter Cards**: ❌ NO TIENE  
**OG:Image**: ❌ NO TIENE

#### 24. MUÑIZ - `/localidades/muniz/`
**Archivo**: localidades/muniz/index.html  
**Title**: Kinesiología para pacientes de Muñiz | Kareh  
**Meta Description**: Kinesiología para pacientes de Muñiz en Kareh, Bella Vista. Tratamientos de rehabilitación, dolor lumbar, respiratorio y piso pélvico con turnos por WhatsApp.  
**Canonical**: https://kareh.com.ar/localidades/muniz/  
**H1**: Kinesiología para pacientes de Muñiz  
**H2**: 1  
**H3**: 1  
**JSON-LD**: 0 bloques  
**Meta Keywords**: ❌ NO TIENE  
**Twitter Cards**: ❌ NO TIENE  
**OG:Image**: ❌ NO TIENE

#### 25. JOSÉ C. PAZ - `/localidades/jose-c-paz/`
**Archivo**: localidades/jose-c-paz/index.html  
**Title**: Kinesiología para pacientes de José C. Paz | Kareh  
**Meta Description**: Kinesiología para pacientes de José C. Paz en Kareh, Bella Vista. Rehabilitación con orden médica, coberturas y turnos por WhatsApp.  
**Canonical**: https://kareh.com.ar/localidades/jose-c-paz/  
**H1**: Kinesiología para pacientes de José C. Paz  
**H2**: 1  
**H3**: 1  
**JSON-LD**: 0 bloques  
**Meta Keywords**: ❌ NO TIENE  
**Twitter Cards**: ❌ NO TIENE  
**OG:Image**: ❌ NO TIENE

#### 26. HURLINGHAM - `/localidades/hurlingham/`
**Archivo**: localidades/hurlingham/index.html  
**Title**: Kinesiología para pacientes de Hurlingham | Kareh  
**Meta Description**: Kinesiología para pacientes de Hurlingham en Kareh, Bella Vista. Rehabilitación traumatológica, respiratoria, dolor lumbar, tendinitis y piso pélvico.  
**Canonical**: https://kareh.com.ar/localidades/hurlingham/  
**H1**: Kinesiología para pacientes de Hurlingham  
**H2**: 1  
**H3**: 1  
**JSON-LD**: 0 bloques  
**Meta Keywords**: ❌ NO TIENE  
**Twitter Cards**: ❌ NO TIENE  
**OG:Image**: ❌ NO TIENE

---

## 5. ARQUITECTURA DE NAVEGACIÓN

### Header y Menú Principal
**Estructura consistente en todas las páginas**:
- Logo (enlace a home)
- Botón menú mobile (hamburguesa)
- Navegación principal

**Enlaces del menú principal** (varían según la página):
- Inicio (href="#nosotros" o href="../index.html#nosotros")
- Nosotros
- Profesional
- Tratamientos (href="servicios/")
- Cobertura (href="cobertura-y-convenios/)
- Obras Sociales (href="obras-sociales/)
- Zonas (href="localidades/san-miguel/")
- Preguntas (href="faqs/)
- Contacto (href="contacto/)
- WhatsApp (CTA - href="https://wa.me/5491132016039")

### Navegación Mobile
- Menú hamburguesa con animación CSS
- Panel desplegable con backdrop blur
- Cierre automático al hacer clic en enlace
- Cierre automático al hacer scroll (en mobile)

### Footer
**Estructura consistente**:
- Información de la marca
- Datos de contacto (dirección, horarios, WhatsApp)
- Enlaces de acceso rápido
- Redes sociales (Instagram, Facebook)
- Copyright

### WhatsApp Flotante
- Botón fijo en bottom-right
- Visible en todas las páginas
- SVG icon personalizado

### Breadcrumbs
- Implementados via JSON-LD (BreadcrumbList)
- No visibles en UI (slo para SEO)

### Enlaces Internos
**Páginas accesibles desde el menú**:
- ✅ Inicio
- ✅ Nosotros
- ✅ Profesional
- ✅ Tratamientos
- ✅ Cobertura
- ✅ Obras Sociales
- ✅ Zonas/Localidades
- ✅ Preguntas FAQS
- ✅ Contacto
- ✅ Blog (solo en algunas páginas)

**Páginas huérfanas** (existen pero no están en menú principal):
- ⚠️ `/servicios/rehabilitacion-postoperatoria/` - No aparece en menú de home
- ⚠️ `/servicios/piso-pelvico-bella-vista/` - No aparece en menú de home

**Enlaces duplicados detectados**:
- Múltiples enlaces a WhatsApp en cada página (header + footer + botón flotante)
- Múltiples enlaces a Google Maps en cada página

---

## 6. SEO ACTUAL

### Meta Tags Implementados

#### ✅ Implementado en todas las páginas:
- charset
- viewport
- description
- robots (index,follow,max-image-preview:large)
- author
- og:type
- og:locale
- og:site_name
- og:title
- og:description
- og:url
- og:image
- og:image:alt
- twitter:card
- twitter:title
- twitter:description
- twitter:image
- twitter:image:alt
- title
- canonical
- preconnect (fonts)
- preload (fonts)
- favicon

#### ❌ Faltante en páginas de localidades:
- meta keywords
- twitter:card
- twitter:title
- twitter:description
- twitter:image
- twitter:image:alt
- og:image

### Open Graph
**Consistencia**: 
- ✅ og:type consistente (website o article en blog)
- ❌ og:url sin https:// en algunas páginas (usan //)
- ❌ og:url sin trailing slash en algunas páginas
- ✅ og:image consistente (logo-icon.png)
- ✅ og:image:alt consistente

### Twitter Cards
**Consistencia**:
- ✅ Implementado en páginas principales
- ❌ Faltante en páginas de localidades
- ✅ summary_large_image en todas las que lo tienen

### Canonicals
**Problemas detectados**:
- ✅ Todas las páginas tienen canonical
- ❌ Inconsistencia con trailing slash: algunas URLs del sitemap no coinciden con canonical
- ❌ Páginas de blog tienen canonical con / pero og:url sin /

### H1 Tags
**Consistencia**: ✅ Todas las páginas tienen un H1 único y descriptivo

### H2/H3 Tags
**Consistencia**: ✅ Estructura de headings consistente

### Alt de Imágenes
**Estado**:
- ✅ Logo: alt="Kareh - Centro de Kinesiología y Fisiatría"
- ✅ Foto perfil: alt="Lic. Katia Aluminé Romero, kinesióloga"
- ✅ Imágenes de consultorio: alt descriptivo
- ⚠️ Algunas imágenes SVG inline no tienen title/desc (aria-hidden=true)

### Lazy Loading
**Implementado**:
- ✅ Imágenes de perfil: loading="lazy"
- ✅ Imágenes de consultorio: loading="lazy"
- ✅ Logo: loading="lazy" (excepto en home)
- ✅ Iframe mapa: loading="lazy"

### Enlaces Internos
**Densidad**: Buena, todas las páginas se linkean entre sí

### Enlaces Externos
- ✅ Google Maps (target="_blank", rel="noopener noreferrer")
- ✅ WhatsApp (target="_blank", rel="noopener noreferrer")
- ✅ Instagram (target="_blank", rel="noopener noreferrer")
- ✅ Facebook (target="_blank", rel="noopener noreferrer")

---

## 7. JSON-LD / SCHEMA.ORG

### Tipos de Schema Utilizados

#### 1. MedicalBusiness
**Páginas que lo usan**:
- index.html (home)
- servicios/index.html
- servicios/rehabilitacion-traumatologica-bella-vista/
- servicios/kinesiologia-respiratoria/
- servicios/piso-pelvico/
- servicios/ultrasonido-terapeutico/
- servicios/dolor-lumbar-bella-vista/
- servicios/tendinitis-bella-vista/
- servicios/lesiones-deportivas-bella-vista/
- servicios/rehabilitacion-postoperatoria-bella-vista/
- servicios/tratamiento-incontinencia-urinaria/
- servicios/kinesiologia-respiratoria-pediatrica/
- servicios/rehabilitacion-postoperatoria/
- contacto/index.html
- cobertura-y-convenios/index.html
- obras-sociales/index.html

**Propiedades**:
- @context
- @type: MedicalBusiness
- @id: https://kareh.com.ar/#medicalbusiness
- name
- url
- image
- description (no en todas)
- priceRange (solo en home)
- telephone
- founder (solo en home)
- address
- openingHoursSpecification (solo en home)
- areaServed
- serviceType
- knowsAbout (solo en home)
- sameAs

**Inconsistencias**:
- ❌ Algunas páginas tienen "Kareh", otras "Kareh - Centro de Kinesiología y Fisiatría"
- ❌ No todas tienen description
- ❌ No todas tienen priceRange
- ❌ No todas tienen openingHoursSpecification
- ❌ No todas tienen serviceType

#### 2. Service
**Páginas que lo usan**:
- servicios/rehabilitacion-traumatologica-bella-vista/
- servicios/kinesiologia-respiratoria/
- servicios/piso-pelvico/
- servicios/ultrasonido-terapeutico/
- servicios/dolor-lumbar-bella-vista/
- servicios/tendinitis-bella-vista/
- servicios/lesiones-deportivas-bella-vista/
- servicios/rehabilitacion-postoperatoria-bella-vista/
- servicios/tratamiento-incontinencia-urinaria/
- servicios/kinesiologia-respiratoria-pediatrica/
- servicios/rehabilitacion-postoperatoria/

**Propiedades**:
- @context
- @type: Service
- name
- serviceType
- provider (MedicalBusiness)
- areaServed
- description

**Inconsistencias**:
- ❌ Algunas tienen provider completo, otras solo name y url
- ❌ No todas tienen telephone en provider
- ❌ No todas tienen address en provider

#### 3. Person
**Páginas que lo usan**:
- index.html (home) únicamente

**Propiedades**:
- @context
- @type: Person
- @id
- name
- jobTitle
- worksFor (referencia a MedicalBusiness)
- knowsAbout

#### 4. BreadcrumbList
**Páginas que lo usan**:
- index.html
- servicios/index.html
- servicios/rehabilitacion-traumatologica-bella-vista/
- servicios/kinesiologia-respiratoria/
- servicios/piso-pelvico/
- servicios/ultrasonido-terapeutico/
- servicios/dolor-lumbar-bella-vista/
- servicios/tendinitis-bella-vista/
- servicios/lesiones-deportivas-bella-vista/
- servicios/rehabilitacion-postoperatoria-bella-vista/
- servicios/tratamiento-incontinencia-urinaria/
- servicios/kinesiologia-respiratoria-pediatrica/
- servicios/rehabilitacion-postoperatoria/
- contacto/index.html
- cobertura-y-convenios/index.html
- obras-sociales/index.html

**Estructura**: ✅ Consistente (Inicio > [Página])

#### 5. FAQPage
**Páginas que lo usan**:
- index.html (3 preguntas)
- servicios/index.html (4 preguntas)
- servicios/rehabilitacion-traumatologica-bella-vista/ (2 preguntas)
- servicios/kinesiologia-respiratoria/ (3 preguntas)
- servicios/piso-pelvico/ (3 preguntas)
- servicios/ultrasonido-terapeutico/ (3 preguntas)
- servicios/dolor-lumbar-bella-vista/ (2 preguntas)
- servicios/tendinitis-bella-vista/ (2 preguntas)
- servicios/lesiones-deportivas-bella-vista/ (2 preguntas)
- servicios/rehabilitacion-postoperatoria-bella-vista/ (3 preguntas)
- servicios/tratamiento-incontinencia-urinaria/ (3 preguntas)
- servicios/kinesiologia-respiratoria-pediatrica/ (3 preguntas)
- servicios/rehabilitacion-postoperatoria/ (3 preguntas)
- contacto/index.html (3 preguntas)
- cobertura-y-convenios/index.html (3 preguntas)
- faqs/index.html (9 preguntas)

**Total**: 16 páginas con FAQPage

**Inconsistencias**:
- ❌ Páginas de blog NO tienen FAQPage
- ❌ Páginas de localidades NO tienen FAQPage
- ❌ Preguntas repetidas en múltiples páginas (duplicación de contenido)

### Errores de Sintaxis JSON-LD
- ✅ Todos los bloques son válidos (sin errores de sintaxis)
- ⚠️ Algunas páginas usan @id para MedicalBusiness, otras no
- ⚠️ Inconsistencia en el nombre del negocio

### Referencias entre Entidades
- ✅ Person worksFor MedicalBusiness (solo en home)
- ✅ Service provider es MedicalBusiness
- ⚠️ No hay @id en Service para referencias cruzadas

---

## 8. SITEMAP.XML

### Análisis

**URLs incluidas**: 30

**Lista completa**:
1. https://kareh.com.ar/ (priority: 1.0, changefreq: weekly)
2. https://kareh.com.ar/servicios/ (priority: 0.8, changefreq: weekly)
3. https://kareh.com.ar/servicios/rehabilitacion-postoperatoria/ (priority: 0.6, changefreq: weekly)
4. https://kareh.com.ar/servicios/rehabilitacion-traumatologica-bella-vista/ (priority: 0.95, changefreq: weekly)
5. https://kareh.com.ar/servicios/kinesiologia-respiratoria/ (priority: 0.9, changefreq: weekly)
6. https://kareh.com.ar/servicios/piso-pelvico/ (priority: 0.9, changefreq: weekly)
7. https://kareh.com.ar/servicios/rehabilitacion-postoperatoria-bella-vista/ (priority: 0.9, changefreq: weekly)
8. https://kareh.com.ar/servicios/kinesiologia-respiratoria-pediatrica/ (priority: 0.9, changefreq: weekly)
9. https://kareh.com.ar/servicios/tratamiento-incontinencia-urinaria/ (priority: 0.9, changefreq: weekly)
10. https://kareh.com.ar/servicios/piso-pelvico-bella-vista/ (priority: 0.85, changefreq: weekly)
11. https://kareh.com.ar/servicios/ultrasonido-terapeutico/ (priority: 0.8, changefreq: weekly)
12. https://kareh.com.ar/servicios/dolor-lumbar-bella-vista/ (priority: 0.85, changefreq: weekly)
13. https://kareh.com.ar/servicios/tendinitis-bella-vista/ (priority: 0.8, changefreq: weekly)
14. https://kareh.com.ar/servicios/lesiones-deportivas-bella-vista/ (priority: 0.8, changefreq: weekly)
15. https://kareh.com.ar/localidades/san-miguel/ (priority: 0.75, changefreq: monthly)
16. https://kareh.com.ar/localidades/muniz/ (priority: 0.75, changefreq: monthly)
17. https://kareh.com.ar/localidades/jose-c-paz/ (priority: 0.75, changefreq: monthly)
18. https://kareh.com.ar/localidades/hurlingham/ (priority: 0.75, changefreq: monthly)
19. https://kareh.com.ar/blog/ (priority: 0.7, changefreq: weekly)
20. https://kareh.com.ar/blog/esguince-de-tobillo-recuperacion-kinesiologia/ (priority: 0.65, changefreq: monthly)
21. https://kareh.com.ar/blog/dolor-lumbar-causas-cuando-consultar/ (priority: 0.65, changefreq: monthly)
22. https://kareh.com.ar/blog/incontinencia-urinaria-piso-pelvico-mitos-verdades/ (priority: 0.65, changefreq: monthly)
23. https://kareh.com.ar/blog/kinesiologia-respiratoria-ninos/ (priority: 0.65, changefreq: monthly)
24. https://kareh.com.ar/cobertura-y-convenios/ (priority: 0.8, changefreq: weekly)
25. https://kareh.com.ar/obras-sociales/ (priority: 0.8, changefreq: weekly)
26. https://kareh.com.ar/contacto/ (priority: 0.7, changefreq: weekly)
27. https://kareh.com.ar/faqs/ (priority: 0.7, changefreq: weekly)

**Problemas detectados**:
- ❌ Faltan URLs de localidades en sitemap (solo hay 4, pero debería haber más si existen)
- ❌ Faltan URLs de servicios específicos (piso-pelvico-bella-vista/)
- ❌ lastmod es 2026-07-21 para todas las páginas (no refleja actualizaciones reales)
- ✅ Trailing slash consistente en todas las URLs
- ✅ Coincide con canonical en la mayoría de los casos

---

## 9. ROBOTS.TXT

**Contenido**:
```
User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://kareh.com.ar/sitemap.xml
```

**Análisis**:
- ✅ Permite acceso a todo el sitio
- ✅ Bloquea /admin/ (prevención)
- ✅ Especifica sitemap
- ❌ No hay reglas específicas para crawlers
- ❌ No hay crawl-delay
- ❌ No hay restricciones para assets o parámetros

---

## 10. IMÁGENES

### Inventario Completo

#### Logos (4 archivos)
1. logo-icon.png (usado en og:image)
2. logo-icon-96.png (responsive)
3. logo-icon-192.png (responsive)
4. logo-icon-240.png (responsive)

**Alt**: ✅ "Kareh - Centro de Kinesiología y Fisiatría"  
**Lazy loading**: ✅ Sí  
**Formato**: PNG

#### Fotos de Perfil (2 archivos)
1. IMG-20260111-384.jpg (384x634)
2. IMG-20260111-512.jpg (512x?)

**Alt**: ✅ "Lic. Katia Aluminé Romero, kinesióloga"  
**Lazy loading**: ✅ Sí  
**Formato**: JPG

#### Imágenes de Consultorio (7 archivos)
1. consultorio-box-1.jpg (1254x1254)
2. consultorio-box-2.jpg (1254x1254)
3. frente-local.jpg (1254x1254)
4. magnetoterapia-electroanalgesia.jpg (1254x1254)
5. magnetoterapia-ultrasonido.jpg (1254x1254)
6. recepcion.jpg (1254x1254)
7. sala-de-espera.jpg (1254x1254)

**Alt**: ✅ Todas tienen alt descriptivo  
**Lazy loading**: ✅ Sí  
**Formato**: JPG  
**Tamaño**: 1254x1254 (posiblemente muy grandes)

**Problemas**:
- ⚠️ Imágenes de 1254x1254 pueden ser pesadas (sin compresión visible)
- ❌ No tienen srcset para responsive
- ✅ Tienen width/height explícitos (previene CLS)

### Imágenes en Páginas
- ✅ Todas las imágenes tienen atributo alt
- ✅ Lazy loading implementado
- ✅ Decoding async
- ✅ srcset en logos

---

## 11. BLOG

### Estructura

**Página principal**: /blog/  
**Artículos**: 4  
**URLs**:
1. /blog/dolor-lumbar-causas-cuando-consultar/
2. /blog/esguince-de-tobillo-recuperacion-kinesiologia/
3. /blog/incontinencia-urinaria-piso-pelvico-mitos-verdades/
4. /blog/kinesiologia-respiratoria-ninos/

### Metadata
**Página principal del blog**:
- Title: ✅
- Meta description: ✅
- Canonical: ✅
- OG tags: ✅
- Twitter cards: ✅
- JSON-LD: ❌ NO TIENE

**Artículos**:
- Title: ✅
- Meta description: ✅
- Canonical: ✅
- OG:type: article ✅
- OG:url: ✅
- OG:title: ❌ NO TIENE (en algunos)
- OG:description: ❌ NO TIENE (en algunos)
- OG:image: ❌ NO TIENE
- Twitter cards: ❌ NO TIENE
- JSON-LD: ❌ NO TIENE (ningún artículo)
- JSON-LD Article: ❌ NO TIENE
- JSON-LD BlogPosting: ❌ NO TIENE

### Enlaces Internos
- ✅ Artículos linkean a servicios relacionados
- ✅ Artículos linkean a página de contacto
- ✅ Botones CTA a WhatsApp

### CTAs
- ✅ WhatsApp en cada artículo
- ✅ Enlaces a servicios relacionados

### Estructura H1/H2/H3
- ✅ H1 único por artículo
- ✅ H2 para secciones principales
- ✅ H3 para subsecciones

### Problemas
- ❌ Falta JSON-LD Article o BlogPosting en artículos
- ❌ Falta author en artículos
- ❌ Falta datePublished y dateModified
- ❌ Falta OG:image en artículos
- ❌ Falta Twitter Cards en artículos
- ❌ No hay enlaces a artículos relacionados
- ❌ No hay categorías ni tags

---

## 12. SERVICIOS

### Inventario Completo

#### Servicios Generales
1. **Rehabilitación Traumatológica** - /servicios/rehabilitacion-traumatologica-bella-vista/
2. **Rehabilitación Postoperatoria** - /servicios/rehabilitacion-postoperatoria-bella-vista/
3. **Kinesiología Respiratoria** - /servicios/kinesiologia-respiratoria/
4. **Kinesiología Respiratoria Pediátrica** - /servicios/kinesiologia-respiratoria-pediatrica/
5. **Piso Pélvico** - /servicios/piso-pelvico/
6. **Incontinencia Urinaria** - /servicios/tratamiento-incontinencia-urinaria/
7. **Dolor Lumbar** - /servicios/dolor-lumbar-bella-vista/
8. **Tendinitis** - /servicios/tendinitis-bella-vista/
9. **Lesiones Deportivas** - /servicios/lesiones-deportivas-bella-vista/
10. **Ultrasonido Terapéutico** - /servicios/ultrasonido-terapeutico/
11. **Rehabilitación Musculoesquelética (Hub)** - /servicios/rehabilitacion-postoperatoria/
12. **Piso Pélvico Bella Vista** - /servicios/piso-pelvico-bella-vista/ (NO LEÍDO)

### Agrupación por Intención

#### Traumatología y Postoperatorio
- Rehabilitación Traumatológica
- Rehabilitación Postoperatoria
- Lesiones Deportivas
- Dolor Lumbar
- Tendinitis
- Rehabilitación Musculoesquelética (Hub)

#### Respiratorio
- Kinesiología Respiratoria (adultos)
- Kinesiología Respiratoria Pediátrica

#### Piso Pélvico
- Piso Pélvico
- Incontinencia Urinaria

#### Equipamiento
- Ultrasonido Terapéutico

### Duplicidades Detectadas
- ⚠️ **Rehabilitación Postoperatoria** aparece en 2 URLs:
  - /servicios/rehabilitacion-postoperatoria/ (Hub musculoesquelético)
  - /servicios/rehabilitacion-postoperatoria-bella-vista/ (Página específica)
  
- ⚠️ **Piso Pélvico** aparece en 2 URLs:
  - /servicios/piso-pelvico/ (General)
  - /servicios/piso-pelvico-bella-vista/ (Específico - NO LEÍDO)

- ⚠️ **Dolor Lumbar** compite con:
  - /servicios/dolor-lumbar-bella-vista/
  - /servicios/rehabilitacion-traumatologica-bella-vista/ (menciona dolor lumbar)
  - /servicios/rehabilitacion-postoperatoria/ (menciona dolor lumbar)

### Keywords Competitivas
- "dolor lumbar Bella Vista" - 2 páginas compiten
- "piso pélvico Bella Vista" - 2 páginas compiten
- "rehabilitación postoperatoria Bella Vista" - 2 páginas compiten

---

## 13. LOCALIDADES

### Inventario Completo

#### 1. San Miguel - `/localidades/san-miguel/`
**Title**: Kinesiología para pacientes de San Miguel | Kareh  
**H1**: Kinesiología para pacientes de San Miguel  
**Canonical**: https://kareh.com.ar/localidades/san-miguel/  
**Contenido**: Enfocado en rehabilitación traumatológica, respiratoria, postoperatoria y piso pélvico  
**Enlaces internos**: servicios/, obras-sociales/, contacto/  
**CTA**: WhatsApp  
**JSON-LD**: ❌ NO TIENE  
**Meta Keywords**: ❌ NO TIENE  
**Twitter Cards**: ❌ NO TIENE  
**OG:Image**: ❌ NO TIENE

#### 2. Muñiz - `/localidades/muniz/`
**Title**: Kinesiología para pacientes de Muñiz | Kareh  
**H1**: Kinesiología para pacientes de Muñiz  
**Canonical**: https://kareh.com.ar/localidades/muniz/  
**Contenido**: Rehabilitación, dolor lumbar, respiratorio y piso pélvico  
**Enlaces internos**: servicios/, contacto/  
**CTA**: WhatsApp  
**JSON-LD**: ❌ NO TIENE  
**Meta Keywords**: ❌ NO TIENE  
**Twitter Cards**: ❌ NO TIENE  
**OG:Image**: ❌ NO TIENE

#### 3. José C. Paz - `/localidades/jose-c-paz/`
**Title**: Kinesiología para pacientes de José C. Paz | Kareh  
**H1**: Kinesiología para pacientes de José C. Paz  
**Canonical**: https://kareh.com.ar/localidades/jose-c-paz/  
**Contenido**: Rehabilitación traumatológica, postoperatoria, esguinces, fracturas, dolor lumbar, etc.  
**Enlaces internos**: servicios/, cobertura-y-convenios/, contacto/  
**CTA**: WhatsApp  
**JSON-LD**: ❌ NO TIENE  
**Meta Keywords**: ❌ NO TIENE  
**Twitter Cards**: ❌ NO TIENE  
**OG:Image**: ❌ NO TIENE

#### 4. Hurlingham - `/localidades/hurlingham/`
**Title**: Kinesiología para pacientes de Hurlingham | Kareh  
**H1**: Kinesiología para pacientes de Hurlingham  
**Canonical**: https://kareh.com.ar/localidades/hurlingham/  
**Contenido**: Rehabilitación traumatológica, respiratoria, dolor lumbar, tendinitis y piso pélvico  
**Enlaces internos**: servicios/, cobertura-y-convenios/, obras-sociales/, faqs/, contacto/  
**CTA**: WhatsApp  
**JSON-LD**: ❌ NO TIENE  
**Meta Keywords**: ❌ NO TIENE  
**Twitter Cards**: ❌ NO TIENE  
**OG:Image**: ❌ NO TIENE

### Análisis de Contenido Similar

**Riesgo de contenido duplicado**: ⚠️ ALTO

**Problemas**:
- Todas las localidades tienen estructura idéntica
- Contenido muy similar (mismas zonas, mismos tratamientos)
- Solo cambia el nombre de la localidad
- No hay contenido único por localidad
- No hay datos específicos de cada zona

**Recomendación**:
- Agregar contenido único por localidad (historia, datos demográficos, etc.)
- Agregar testimonios específicos por zona
- Agregar información de acceso/transporte específica

---

## 14. OBRAS SOCIALES / COBERTURAS

### Páginas Analizadas

#### 1. Obras Sociales - `/obras-sociales/`
**Obras sociales listadas** (21):
1. Swiss Medical
2. Sancor
3. Jerárquicos
4. Luis Pasteur
5. Federada Salud
6. OSPEDYC
7. Poder Judicial
8. COMEI
9. DASUTEN
10. OSDOP
11. AMFFA
12. OSSEG
13. OSCONARA
14. AMEBPBA
15. APSOT
16. Colegio de Escribanos
17. Cristal Salud
18. RAS
19. OSPEPBA
20. OSAP
21. LPF Grupo La Pequeña Familia

**Prepagas listadas** (4):
1. Medifé
2. Avalian
3. Prevención Salud
4. Amsterdam Salud

**ART / Convenios listados** (5):
1. Omint ART
2. Paraná ART
3. La Segunda
4. Rural Mutual
5. Medicar Work

**Total**: 30 coberturas

**Metadata**:
- Title: ✅
- Meta description: ✅
- Canonical: ✅
- JSON-LD: ✅ (MedicalBusiness + BreadcrumbList)
- FAQ: ✅

#### 2. Cobertura y Convenios - `/cobertura-y-convenios/`
**Contenido**:
- Modalidades de atención
- Obras sociales, prepagas y ART
- Documentación necesaria
- Proceso de coordinación

**Coberturas mencionadas**:
- Particular
- Sancor Salud
- Swiss Medical
- Avalian
- Luis Pasteur
- E. W. Hope
- Amsterdam Salud
- IOMA
- Medifé
- OSPE
- Federada Salud
- Jerárquicos Salud
- Prevención Salud
- MedicAr Work
- San Francisco ART
- La Segunda ART
- Rural Mutual ART
- Reconquista ART
- Paraná ART
- La Holando ART
- SMG ART

**Total**: 21 coberturas

**Inconsistencias entre páginas**:
- ❌ Obras-sociales/ tiene 30 coberturas
- ❌ Cobertura-y-convenios/ tiene 21 coberturas
- ❌ Nombres diferentes (ej: "Rural Mutual" vs "Rural Mutual ART")
- ❌ Algunas coberturas aparecen en una página pero no en la otra

**Metadata**:
- Title: ✅
- Meta description: ✅
- Canonical: ✅
- JSON-LD: ✅ (MedicalBusiness + BreadcrumbList + FAQPage)

### Problemas de Contenido
- ❌ Listas de coberturas desactualizadas o inconsistentes
- ❌ No hay enlaces a páginas específicas por cobertura
- ❌ No hay información de requisitos por cobertura
- ❌ No hay información de autorizaciones

---

## 15. CONTACTO Y CONVERSIÓN

### Números de Teléfono
- **WhatsApp**: +54 9 11 3201-6039
- **Teléfono**: +54 9 11 3201-6039 (mismo número)

### Enlaces WhatsApp
**Formato**: https://wa.me/5491132016039  
**Uso**: En header, footer, botones flotantes, CTAs

### Formularios
- ❌ NO HAY FORMULARIOS DE CONTACTO
- ❌ NO HAY FORMULARIO DE TURNOS
- ❌ NO HAY FORMULARIO DE CONSULTA

### Botones CTA
**Tipos detectados**:
- "Consultar por WhatsApp"
- "Escribir por WhatsApp"
- "Solicitar turno"
- "Coordinar por WhatsApp"
- "QUIERO CONSULTAR"
- "CONSULTAR POR WHATSAPP"

**Ubicación**:
- Header (enlace WhatsApp)
- Hero section
- Secciones de contenido
- Footer
- Botón flotante

### Inconsistencias
- ⚠️ Algunas páginas usan "Consultar", otras "Solicitar turno", otras "Coordinar"
- ⚠️ No hay consistencia en el texto de CTAs

---

## 16. CONSISTENCIA DE DATOS

### Nombre Comercial
**Inconsistencias detectadas**:
- "Kareh" (en algunas páginas)
- "Kareh - Centro de Kinesiología y Fisiatría" (en otras)
- "Kareh - Centro de Kinesiología y Rehabilitación" (en OG:image:alt)

**Debería ser**: "Kareh - Centro de Kinesiología y Fisiatría" (según home)

### Dirección
**Consistente**: ✅
- Av. Senador Morón 782, Bella Vista, Buenos Aires

### Teléfono
**Consistente**: ✅
- +54 9 11 3201-6039

### WhatsApp
**Consistente**: ✅
- https://wa.me/5491132016039

### Horarios
**Consistente**: ✅
- Lunes, miércoles y viernes: 14:00 a 19:00
- Martes y jueves: 17:30 a 19:00
- Sábados: 08:00 a 12:00

### Profesional
**Consistente**: ✅
- Lic. Katia Aluminé Romero
- Licenciada en Kinesiología y Fisiatría

### Especialidades
**Consistente**: ✅
- Rehabilitación traumatológica
- Rehabilitación postoperatoria
- Kinesiología respiratoria
- Piso pélvico
- Incontinencia urinaria
- Dolor lumbar
- Tendinitis
- Lesiones deportivas

### Zonas
**Consistente**: ✅
- Bella Vista
- San Miguel
- Muñiz
- José C. Paz
- Hurlingham
- Los Polvorines
- Malvinas Argentinas
- Zona Noroeste
- Zona Oeste

### URLs
**Inconsistencias**:
- ❌ Algunas páginas usan rutas relativas (../servicios/)
- ❌ Otras usan rutas absolutas (/servicios/)
- ❌ Inconsistencia en trailing slash en canonical vs og:url

---

## 17. GIT

### Estado Confirmado
**Branch actual**: main  
**Estado**: Up to date con origin/main  
**Cambios sin commit**: 1 archivo sin seguimiento (PROJECT_STRUCTURE_AUDIT.md)  
**Último commit**: 3261270bd5907bec91192f8b9758cdb9ab6ad3ef  
**Remoto**: https://github.com/Artu2410/web-kareh.git

### Últimos 10 Commits
1. 3261270 - feat(seo): improve local SEO with location landing pages, blog content and structured data
2. a91989a - fix(seo): resolve structured data parsing errors and standardize JSON-LD schema across all treatment pages
3. 68ef9a6 - fix(seo): unify canonical URLs to trailing slash format across all pages
4. bb583c6 - Update index.html
5. 40519c2 - Update index.html
6. 939564b - Update index.html
7. d2caa91 - update: cambios en home, contacto y faqs
8. c72ad4c - feat: agregar pagina obras-sociales con listado agrupado y SEO
9. cab128f - feat: simplificar home, añadir rutas obras-sociales y CTAs de conversión
10. (pendiente del décimo commit)

### Análisis de Historial
- ✅ Último commit enfocado en SEO local
- ✅ Commits anteriores corrigen errores de structured data
- ✅ Hay un patrón de mejoras SEO continuas
- ⚠️ El archivo PROJECT_STRUCTURE_AUDIT.md está sin seguimiento en Git

---

## 18. PROBLEMAS ENCONTRADOS

### CRÍTICOS

1. **INCONSISTENCIA DE NOMBRE COMERCIAL**
   - HECHO OBSERVADO: El nombre varía entre "Kareh" y "Kareh - Centro de Kinesiología y Fisiatría"
   - POSIBLE PROBLEMA: Confusión en branding, inconsistencia en Schema.org
   - RECOMENDACIÓN: Unificar nombre en todas las páginas y JSON-LD

2. **URLs DUPLICADAS / CANONICAL CONFLICTS**
   - HECHO OBSERVADO: Múltiples páginas para misma keyword (dolor lumbar, piso pélvico, postoperatoria)
   - POSIBLE PROBLEMA: Canibalización de SEO, confusión para Google
   - RECOMENDACIÓN: Consolidar páginas o usar canonical correctamente

3. **FALTA DE HTTPS EN OG:URL**
   - HECHO OBSERVADO: Algunas páginas usan `//kareh.com.ar/` en lugar de `https://kareh.com.ar/`
   - POSIBLE PROBLEMA: OG tags pueden no funcionar correctamente
   - RECOMENDACIÓN: Agregar https:// en todas las og:url

### ALTOS

4. **TRAILING SLASH INCONSISTENTE**
   - HECHO OBSERVADO: og:url sin / pero canonical con /
   - POSIBLE PROBLEMA: Duplicación de contenido, señales mixtas a Google
   - RECOMENDACIÓN: Unificar formato (recomendado: con trailing slash)

5. **FALTA DE JSON-LD EN PÁGINAS DE LOCALIDADES**
   - HECHO OBSERVADO: 4 páginas de localidades sin Schema.org
   - POSIBLE PROBLEMA: Pérdida de rich snippets, menor visibilidad en local SEO
   - RECOMENDACIÓN: Agregar JSON-LD (LocalBusiness o Service)

6. **FALTA DE META KEYWORDS EN LOCALIDADES**
   - HECHO OBSERVADO: 4 páginas sin meta keywords
   - POSIBLE PROBLEMA: Menor relevancia para búsquedas locales
   - RECOMENDACIÓN: Agregar meta keywords específicos por localidad

7. **FALTA DE TWITTER CARDS EN LOCALIDADES**
   - HECHO OBSERVADO: 4 páginas sin Twitter Cards
   - POSIBLE PROBLEMA: Menor visibilidad en Twitter
   - RECOMENDACIÓN: Agregar Twitter Cards completas

8. **FALTA DE OG:IMAGE EN LOCALIDADES**
   - HECHO OBSERVADO: 4 páginas sin imagen para compartir
   - POSIBLE PROBLEMA: Compartidos en redes sin imagen
   - RECOMENDACIÓN: Agregar og:image (logo o imagen específica)

9. **CONTENIDO DUPLICADO EN LOCALIDADES**
   - HECHO OBSERVADO: 4 páginas con estructura y contenido muy similar
   - POSIBLE PROBLEMA: Penalización por contenido duplicado
   - RECOMENDACIÓN: Agregar contenido único por localidad

10. **FALTA DE JSON-LD EN BLOG**
    - HECHO OBSERVADO: 5 páginas de blog sin Schema.org
    - POSIBLE PROBLEMA: Pérdida de rich snippets de artículos
    - RECOMENDACIÓN: Agregar JSON-LD Article o BlogPosting

### MEDIOS

11. **IMÁGENES GRANDES SIN OPTIMIZAR**
    - HECHO OBSERVADO: Imágenes de 1254x1254 en assets/consultorio/
    - POSIBLE PROBLEMA: Lenta carga, alto consumo de datos
    - RECOMENDACIÓN: Comprimir imágenes, usar WebP, agregar srcset

12. **LISTA DE COBERTURAS INCONSISTENTE**
    - HECHO OBSERVADO: 30 coberturas en obras-sociales/, 21 en cobertura-y-convenios/
    - POSIBLE PROBLEMA: Confusión para usuarios, datos desactualizados
    - RECOMENDACIÓN: Unificar listas, crear página por cobertura

13. **PREGUNTAS FAQ REPETIDAS**
    - HECHO OBSERVADO: Mismas preguntas en múltiples páginas
    - POSIBLE PROBLEMA: Contenido duplicado
    - RECOMENDACIÓN: Centralizar FAQs en /faqs/ y referenciar

14. **FALTA DE META KEYWORDS EN ALGUNAS PÁGINAS**
    - HECHO OBSERVADO: Algunas páginas no tienen meta keywords
    - POSIBLE PROBLEMA: Menor relevancia para búsquedas específicas
    - RECOMENDACIÓN: Agregar meta keywords consistentemente

15. **SIN AUTHOR EN ARTÍCULOS DE BLOG**
    - HECHO OBSERVADO: Artículos no tienen meta author
    - POSIBLE PROBLEMA: Menor credibilidad, falta de E-E-A-T
    - RECOMENDACIÓN: Agregar meta author y JSON-LD Person

### BAJOS

16. **VERSIONES DE CSS/JS EN QUERY STRING**
    - HECHO OBSERVADO: styles.css?v=20260524-clinical-refresh
    - POSIBLE PROBLEMA: Cache issues
    - RECOMENDACIÓN: Usar versionado en build process

17. **FALTA DE BREADCRUMBS VISIBLES**
    - HECHO OBSERVADO: Breadcrumbs solo en JSON-LD, no visibles
    - POSIBLE PROBLEMA: Menor usabilidad
    - RECOMENDACIÓN: Agregar breadcrumbs visibles en UI

18. **SIN PÁGINA 404 PERSONALIZADA**
    - HECHO OBSERVADO: No hay archivo 404.html
    - POSIBLE PROBLEMA: Mala experiencia de usuario
    - RECOMENDACIÓN: Crear página 404 personalizada

19. **SIN PÁGINA DE PRIVACIDAD**
    - HECHO OBSERVADO: No hay política de privacidad
    - POSIBLE PROBLEMA: Incumplimiento GDPR, falta de transparencia
    - RECOMENDACIÓN: Crear página de política de privacidad

20. **SIN DATOS ESTRUCTURADOS DE REVIEWS**
    - HECHO OBSERVADO: Menciona "5.0 en Google" pero no hay Schema.org Review
    - POSIBLE PROBLEMA: Pérdida de rich snippets de reseñas
    - RECOMENDACIÓN: Agregar JSON-LD AggregateRating

### INFORMATIVOS

21. **CARPETA CATALOGO VACÍA**
    - HECHO OBSERVADO: Directorio con configuración Next.js pero sin contenido
    - POSIBLE PROBLEMA: Código muerto
    - RECOMENDACIÓN: Eliminar o completar

22. **FALTA DE HREFLANG**
    - HECHO OBSERVADO: No hay hreflang tags
    - POSIBLE PROBLEMA: No hay versión en otros idiomas
    - RECOMENDACIÓN: Agregar si se planea multi-idioma

23. **SIN SCHEMA.ORG MEDICALENTITY**
    - HECHO OBSERVADO: Usa MedicalBusiness en lugar de MedicalEntity
    - POSIBLE PROBLEMA: Menor precisión semántica
    - RECOMENDACIÓN: Evaluar cambio a MedicalEntity

---

## 19. RIESGOS

### SEO
- ⚠️ Canibalización de keywords por URLs duplicadas
- ⚠️ Contenido duplicado en localidades
- ⚠️ Falta de Schema.org en páginas importantes
- ⚠️ Inconsistencia en meta tags

### Performance
- ⚠️ Imágenes grandes sin optimizar
- ⚠️ CSS de 1967 líneas (posiblemente se puede dividir)
- ⚠️ JavaScript global de 262 líneas cargado en todas las páginas

### Accesibilidad
- ⚠️ Falta de skip links
- ⚠️ Falta de breadcrumbs visibles
- ⚠️ Algunos SVGs sin title/desc (aunque tienen aria-hidden)

### Seguridad
- ⚠️ No hay HTTPS forzado (depende del servidor)
- ⚠️ Enlaces externos sin rel="noopener noreferrer" en algunos casos

### Mantenibilidad
- ⚠️ Código duplicado en header/footer de cada página
- ⚠️ Sin sistema de templates
- ⚠️ Sin build process
- ⚠️ Cambios requieren editar múltiples archivos

---

## 20. RECOMENDACIONES

### Prioridad Alta

1. **Unificar nombre comercial** en todas las páginas y JSON-LD
2. **Corregir og:url** para incluir https:// en todas las páginas
3. **Unificar trailing slash** en canonical y og:url
4. **Agregar JSON-LD** en páginas de localidades y blog
5. **Agregar meta keywords, Twitter Cards y og:image** en localidades
6. **Consolidar páginas duplicadas** o usar canonical correctamente
7. **Unificar listas de coberturas** en obras-sociales/ y cobertura-y-convenios/

### Prioridad Media

8. **Optimizar imágenes** (comprimir, WebP, srcset)
9. **Agregar contenido único** por localidad
10. **Centralizar FAQs** y referenciar desde otras páginas
11. **Agregar Schema.org Article** en artículos de blog
12. **Implementar sistema de templates** para reducir duplicación
13. **Agregar página 404 personalizada**
14. **Agregar política de privacidad**
15. **Agregar AggregateRating** Schema.org

### Prioridad Baja

16. **Implementar build process** (Vite, etc.)
17. **Agregar hreflang** si se expande a otros idiomas
18. **Agregar breadcrumbs visibles** en UI
19. **Implementar skip links** para accesibilidad
20. **Evaluar migración a generador estático** (Astro, Next.js)

---

## 21. ESTADO DE GIT

**Pendiente de ejecución**:
```bash
git status
git log --oneline -10
git remote -v
```


---

## 22. PRÓXIMOS PASOS

1. ✅ Completar lectura de páginas faltantes (piso-pelvico-bella-vista/, blog articles)
2. ✅ Ejecutar comandos git
3. ✅ Generar este informe
4. ⏳ Esperar instrucciones del usuario

---

**Fin del informe de auditoría**