const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const mime = {
  html: 'text/html', css: 'text/css', js: 'application/javascript',
  svg: 'image/svg+xml', ico: 'image/x-icon', png: 'image/png',
  jpg: 'image/jpeg', jpeg: 'image/jpeg', woff2: 'font/woff2',
};

http.createServer((req, res) => {
  let filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath).slice(1);
  fs.access(filePath, fs.constants.F_OK, err => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
}).listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
