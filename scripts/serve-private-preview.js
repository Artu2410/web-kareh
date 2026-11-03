const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const root = path.join(os.tmpdir(), 'kareh-private-content-preview');
if (!fs.existsSync(root)) throw new Error('Run: node scripts/create-private-preview.js');
const allowed = new Set(['.html', '.css', '.js', '.png', '.txt']);
http.createServer((request, response) => {
  let relative; try { relative = decodeURIComponent((request.url || '/').split('?')[0]); } catch { relative = ''; }
  const target = path.resolve(root, relative === '/' ? 'index.html' : `.${relative}`);
  if (!target.startsWith(`${root}${path.sep}`) || !allowed.has(path.extname(target)) || !fs.existsSync(target) || fs.statSync(target).isDirectory()) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow' }); return response.end('Not found');
  }
  const type = target.endsWith('.css') ? 'text/css' : target.endsWith('.js') ? 'application/javascript' : target.endsWith('.png') ? 'image/png' : target.endsWith('.txt') ? 'text/plain; charset=utf-8' : 'text/html; charset=utf-8';
  response.writeHead(200, { 'Content-Type': type, 'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet', 'Cache-Control': 'no-store' }); fs.createReadStream(target).pipe(response);
}).listen(4173, '127.0.0.1', () => console.log('http://127.0.0.1:4173 (Ctrl+C to stop)'));
