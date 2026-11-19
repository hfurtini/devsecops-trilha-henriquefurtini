const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const UPLOADS_DIR = path.resolve(__dirname, "..", "..", "uploads");

function getSafeUploadPath(requestedName, callback) {
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) return callback(err, null);

    const match = files.find((name) => name === requestedName);
    if (!match) return callback(null, null);

    callback(null, path.join(UPLOADS_DIR, match));
  });
}

// GET /api/files/:filename - lê e devolve o conteúdo de um arquivo da pasta uploads/
router.get("/:filename", (req, res) => {
  getSafeUploadPath(req.params.filename, (dirErr, filePath) => {
    if (dirErr) return res.status(500).json({ error: "Erro ao acessar diretório" });
    if (!filePath) return res.status(404).json({ error: "Arquivo não encontrado" });

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) return res.status(404).json({ error: "Arquivo não encontrado" });
      res.type("text/plain").send(data);
    });
  });
});

module.exports = router;