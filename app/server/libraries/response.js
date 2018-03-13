const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

class Response {
  constructor (res) {
    this.res = res;
    this.errorRes = {'error': 'ok'};
  }

  returnJson (code, data) {
    this.res.writeHead(code, {'Content-Type': 'application/json'});
    this.res.write(data);
    this.res.end();
  }

  returnView (path) {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        this.returnJson(400, JSON.stringify(this.errorRes));
      } else {
        this.res.writeHead(200, {'Content-Type': 'text/html'});
        this.res.write(data);
        this.res.end();
      }
    });
  }

  returnAssets (uriPath) {
    let filePath = './dist' + uriPath;
    let fileExtension = path.extname(filePath);
    let fileMineType = mime.lookup(fileExtension);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        this.returnJson(400, JSON.stringify(this.errorRes));
      } else {
        this.res.writeHead(200, {'Content-Type': fileMineType});
        this.res.write(data);
        this.res.end();
      }
    });
  }

  returnLibrary (uriPath) {
    let filePath = './node_modules' + uriPath.replace('/lib', '');
    let fileExtension = path.extname(filePath);
    let fileMineType = mime.lookup(fileExtension);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        this.returnJson(400, JSON.stringify(this.errorRes));
      } else {
        this.res.writeHead(200, {'Content-Type': fileMineType});
        this.res.write(data);
        this.res.end();
      }
    });
  }
}

module.exports = Response;
