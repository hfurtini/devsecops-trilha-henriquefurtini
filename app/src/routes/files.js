const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const UPLOADS_DIR = path.resolve(__dirname, "..", "..", "uploads");
const SAFE_FILENAME_REGEX = /^[a-zA-Z0-9._-]+$/;

// GET /api/files/:filename - lê e devolve o conteúdo de um arquivo da pasta uploads/
router.get("/:filename", (req, res) => {
  const safeName = path.basename(req.params.filename);

  if (safeName !== req.params.filename || !SAFE_FILENAME_REGEX.test(safeName)) {
    return res.status(400).json({ error: "Nome de arquivo inválido" });
  }

  const filePath = path.resolve(UPLOADS_DIR, safeName);
  if (!filePath.startsWith(UPLOADS_DIR + path.sep)) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(404).json({ error: "Arquivo não encontrado" });
    res.type("text/plain").send(data);
  });
});

module.exports = router;