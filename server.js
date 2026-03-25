const http = require('http');//all this ai
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = '127.0.0.1';
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (error.code === 'ENOENT') {
        sendJson(res, 404, { error: 'File not found' });
        return;
      }

      sendJson(res, 500, { error: 'Failed to read file' });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function resolveStaticPath(urlPath) {
  const requestedPath = urlPath === '/' ? '/index.html' : urlPath;
  const normalizedPath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, '');
  return path.join(ROOT_DIR, normalizedPath);
}

async function handleRefresh(req, res, accountId) {
  if (!/^\d+$/.test(accountId)) {
    sendJson(res, 400, { error: 'account_id must contain only digits' });
    return;
  }

  try {
    const apiResponse = await fetch(`https://api.opendota.com/api/players/${accountId}/refresh`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      }
    });

    const text = await apiResponse.text();
    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    sendJson(res, apiResponse.status, data);
  } catch (error) {
    sendJson(res, 500, {
      error: 'Failed to reach OpenDota',
      details: error.message
    });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (req.method === 'POST' && url.pathname.startsWith('/api/refresh/')) {
    const accountId = url.pathname.split('/').pop();
    await handleRefresh(req, res, accountId);
    return;
  }

  if (req.method === 'GET') {
    const filePath = resolveStaticPath(url.pathname);

    if (!filePath.startsWith(ROOT_DIR)) {
      sendJson(res, 403, { error: 'Forbidden' });
      return;
    }

    sendFile(res, filePath);
    return;
  }

  sendJson(res, 405, { error: 'Method not allowed' });
});

server.listen(PORT, HOST, () => {
  console.log(`Server started at http://${HOST}:${PORT}`);
  console.log(`Refresh endpoint: POST http://${HOST}:${PORT}/api/refresh/<account_id>`);
});
