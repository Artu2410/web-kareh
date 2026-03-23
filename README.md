# Kareh Web

Sitio web estático de Kareh, un centro de kinesiología y fisiatría ubicado en Bella Vista, Buenos Aires. El proyecto está pensado como una landing page orientada a captación de consultas por WhatsApp, con navegación interna, diseño responsive y base SEO local.

## Objetivo

Presentar los servicios principales de Kareh, facilitar el contacto rápido y comunicar ubicación, cobertura y perfil profesional en una sola página.

## Stack

- HTML5
- CSS3
- JavaScript vanilla
- Assets estáticos en PNG

## Características actuales

- Landing page de una sola página con secciones internas
- Navegación sticky con menú responsive
- Resaltado automático de la sección visible
- Animaciones de entrada con `IntersectionObserver`
- Efecto tilt en el bloque principal
- CTA directos a WhatsApp
- Metadatos SEO y Open Graph
- Datos estructurados `MedicalBusiness` en JSON-LD
- `robots.txt` habilitado para indexación

## Estructura del proyecto

```text
.
|-- index.html
|-- styles.css
|-- script.js
|-- logo-icon.png
```

## Archivos principales

- `index.html`: contenido, estructura semántica, metadatos SEO y datos estructurados.
- `styles.css`: estilos globales, layout responsive, componentes visuales y animaciones.
- `script.js`: comportamiento del menú, progreso de scroll, reveal animations, sección activa y año automático del footer.
- `robots.txt`: reglas básicas para rastreo e indexación.

## Cómo verlo en local

No requiere instalación de dependencias.

Opción simple:

1. Abrí `index.html` en el navegador.

Opción recomendada con servidor estático:

1. Desde la carpeta del proyecto, levantá un servidor local.
2. Si tenés Python instalado:

```powershell
python -m http.server 8080
```

3. Abrí `http://localhost:8080`.

## Qué editar con más frecuencia

### Contenido

En `index.html` podés actualizar:

- textos del hero
- servicios y tratamientos
- cobertura
- datos de la profesional
- dirección y zonas de atención
- enlaces a redes sociales

### Contacto

Buscá el número `5491132016039` para cambiar todos los accesos a WhatsApp.

### SEO local

Revisá especialmente en `index.html`:

- `<title>`
- `<meta name="description">`
- etiquetas Open Graph y Twitter
- bloque JSON-LD con dirección, teléfono y servicios

## Publicación

El sitio puede desplegarse en cualquier hosting estático:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- hosting tradicional con archivos estáticos

Solo hace falta subir los archivos tal como están en la raíz del proyecto.

## Siguientes mejoras recomendadas

- corregir y validar el HTML antes de escalar el proyecto
- agregar `sitemap.xml`
- optimizar imágenes para reducir peso
- separar contenido en páginas solo si cada sección va a tener entidad SEO propia
- centralizar datos repetidos si el sitio crece

