const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendText(res, statusCode, text) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(text);
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (error.code === 'ENOENT') {
        sendText(res, 404, 'File not found');
        return;
      }

      sendText(res, 500, 'Failed to read file');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function resolveRequestPath(urlPath) {
  if (urlPath === '/') {
    return path.join(ROOT_DIR, 'index.html');
  }

  const normalizedPath = path.normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, '');
  return path.join(ROOT_DIR, normalizedPath);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET') {
    sendText(res, 405, 'Method not allowed');
    return;
  }

  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  const filePath = resolveRequestPath(url.pathname);

  if (!filePath.startsWith(ROOT_DIR)) {
    sendText(res, 403, 'Forbidden');
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error) {
      sendText(res, 404, 'File not found');
      return;
    }

    if (stats.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      sendFile(res, indexPath);
      return;
    }

    sendFile(res, filePath);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server started: http://${HOST}:${PORT}`);
  console.log(`Main page: http://${HOST}:${PORT}/`);
  console.log(`Match page example: http://${HOST}:${PORT}/match.html?id=1234567890`);
});
