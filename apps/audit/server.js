const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const port = process.env.PORT || 3001;
const app = next({ dev: false });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  createServer((req, res) => handle(req, res, parse(req.url, true))).listen(port, () => {
    console.log(`> audit.thebhtlabs.com running on port ${port}`);
  });
});
