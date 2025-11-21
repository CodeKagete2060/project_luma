const path = require('path');
const fs = require('fs');
const multer = require('multer');

const UPLOAD_ROOT = process.env.STORAGE_PATH || path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOAD_ROOT)) fs.mkdirSync(UPLOAD_ROOT, { recursive: true });

function safeFilename(name) {
  return name.replace(/[^a-z0-9.\-\_]/gi, '_');
}

function makeStorage(subfolder) {
  const dir = path.join(UPLOAD_ROOT, subfolder || 'misc');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return multer.diskStorage({
    destination: function (req, file, cb) { cb(null, dir); },
    filename: function (req, file, cb) {
      const name = `${Date.now()}_${safeFilename(file.originalname)}`;
      cb(null, name);
    }
  });
}

function uploadMiddleware(opts = {}) {
  const { subfolder = 'resources', maxSize = 50 * 1024 * 1024 } = opts;
  return multer({ storage: makeStorage(subfolder), limits: { fileSize: maxSize } });
}

module.exports = { uploadMiddleware, UPLOAD_ROOT };
