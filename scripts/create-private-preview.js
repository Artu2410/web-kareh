/* Generates a minimal, local-only review package outside this repository. */
const fs = require('fs');
const path = require('path');
const os = require('os');
const projectRoot = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(projectRoot, 'SEO_CONTENT_CANDIDATE.md'), 'utf8');
const previewRoot = path.join(os.tmpdir(), 'kareh-private-content-preview');
const articleDir = path.join(previewRoot, 'articles');
function escapeHtml(value) { return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function inline(value) { return escapeHtml(value).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code>$1</code>'); }
function parseArticles(markdown) {
  return markdown.split(/\r?\n---\r?\n/).filter((part) => /^## [1-4]\./m.test(part)).map((part) => {
    const metadata = [...part.matchAll(/^\*\*[^*]+:\*\*\s*([^\r\n]+)/gm)].map((match) => match[1].trim());
    const title = metadata[4], description = metadata[5], h1 = (part.match(/^# ([^\r\n]+)/m) || [])[1], slug = (part.match(/`\/blog\/([^/]+)\/`/) || [])[1];
    if (!title || !description || !h1 || !slug) throw new Error('Candidate article metadata is incomplete.');
    return { title, description, h1, slug, part };
  });
}
function renderBody(article) {
  const lines = article.part.split(/\r?\n/), start = lines.findIndex((line) => line === `# ${article.h1}`) + 1, end = lines.findIndex((line) => /^## Integraci.n futura/.test(line)), html = [];
  for (const raw of lines.slice(start, end === -1 ? lines.length : end)) {
    const line = raw.trim(); if (!line || line === '---') continue;
    if (line.startsWith('## ')) html.push(`<h2>${inline(line.slice(3))}</h2>`);
    else if (line.startsWith('### ')) html.push(`<h3>${inline(line.slice(4))}</h3>`);
    else if (line.startsWith('**CTA:**')) { const url = (line.match(/`(https:\/\/wa\.me\/[^`]+)`/) || [])[1]; if (url) html.push(`<div class="hero-actions"><a class="button button-primary" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></div>`); }
    else if (line.startsWith('**Enlaces internos:**')) html.push(`<p class="preview-links"><strong>Enlaces internos previstos:</strong> ${inline(line.replace(/^\*\*Enlaces internos:\*\*/, '').trim())}</p>`);
    else if (/^\*\*(Fuente|Pendiente)/.test(line)) html.push(`<p class="preview-review">${inline(line)}</p>`);
    else if (/^\*\*(Modalidad|Atenci.n exclusivamente particular)/.test(line)) html.push(`<p class="preview-notice">${inline(line)}</p>`);
    else html.push(`<p>${inline(line)}</p>`);
  } return html.join('\n');
}
function page(a) { return `<!doctype html><html lang="es-AR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex,nofollow,noarchive,nosnippet"><meta name="description" content="${escapeHtml(a.description)}"><title>${escapeHtml(a.title)} — Preview privada</title><link rel="stylesheet" href="../styles.css"><style>.preview-banner{background:#24304a;color:#fff;padding:.8rem 1rem;text-align:center;font-weight:700}.preview-notice{padding:1rem;border:2px solid #8a4f00;background:#fff6df;color:#4c2a00}.preview-review{padding:.8rem;background:#eef4f8}.preview-links{font-size:.94rem}.site-header a{pointer-events:none}</style></head><body class="page-shell page-shell--compact"><div class="preview-banner" role="status">PREVIEW LOCAL PRIVADA — contenido pendiente de aprobación; no publicar ni indexar.</div><header class="site-header"><div class="container nav-shell"><span class="brand"><span class="brand-copy"><small>Kareh · Vista de revisión</small></span></span></div></header><main id="contenido"><section class="section section-soft"><div class="container article-layout"><div class="section-heading reveal"><p class="eyebrow">Borrador editorial</p><h1>${escapeHtml(a.h1)}</h1><p>Vista de revisión local. Los enlaces internos se muestran como destinos previstos y no navegan a páginas públicas.</p></div><article class="article-body reveal">${renderBody(a)}</article></div></section></main><footer class="site-footer"><div class="container footer-bottom"><p>Preview local aislada. Sin sitemap, canonical público ni datos estructurados.</p></div></footer><script src="../script.js"></script></body></html>`; }
const articles = parseArticles(source); fs.rmSync(previewRoot, { recursive: true, force: true }); fs.mkdirSync(articleDir, { recursive: true });
for (const asset of ['styles.css', 'script.js', 'logo-icon.png']) fs.copyFileSync(path.join(projectRoot, asset), path.join(previewRoot, asset));
fs.writeFileSync(path.join(previewRoot, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
for (const article of articles) fs.writeFileSync(path.join(articleDir, `${article.slug}.html`), page(article));
fs.writeFileSync(path.join(previewRoot, 'index.html'), `<!doctype html><html lang="es-AR"><head><meta charset="UTF-8"><meta name="robots" content="noindex,nofollow"><title>Preview privada Kareh</title></head><body><h1>Preview privada</h1><p>Contenido pendiente de aprobación.</p><ul>${articles.map((a) => `<li><a href="articles/${a.slug}.html">${escapeHtml(a.h1)}</a></li>`).join('')}</ul></body></html>`);
console.log(previewRoot);
