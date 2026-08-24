const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SNAPDIR = path.join(__dirname, 'snapshots');
fs.mkdirSync(SNAPDIR, { recursive: true });
const TYPES = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.md':'text/plain','.pdf':'application/pdf','.json':'application/json'};
http.createServer((req, res) => {
  if (req.method === 'POST' && req.url.startsWith('/__snap/')) {
    const name = req.url.slice('/__snap/'.length).replace(/[^a-z0-9._-]/gi, '');
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      fs.writeFileSync(path.join(SNAPDIR, name + '.json'), body);
      res.writeHead(200, {'Access-Control-Allow-Origin':'*'}); res.end('saved ' + name);
    });
    return;
  }
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('no'); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, {'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control':'no-store'});
    res.end(buf);
  });
}).listen(8912, () => console.log('serving ' + ROOT + ' on 8912'));
