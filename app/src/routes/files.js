const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const UPLOADS_DIR = path.resolve(__dirname, "..", "..", "uploads");

// GET /api/files/:filename - lê e devolve o conteúdo de um arquivo da pasta uploads/
router.get("/:filename", (req, res) => {
  fs.readdir(UPLOADS_DIR, (dirErr, files) => {
    if (dirErr) return res.status(500).json({ error: "Erro ao acessar diretório" });

    const allowedPaths = new Map(
      files.map((entry) => [entry, path.join(UPLOADS_DIR, entry)])
    );

    const safeFilePath = allowedPaths.get(req.params.filename);
    if (!safeFilePath) return res.status(404).json({ error: "Arquivo não encontrado" });

    fs.readFile(safeFilePath, "utf8", (err, data) => {
      if (err) return res.status(404).json({ error: "Arquivo não encontrado" });
      res.type("text/plain").send(data);
    });
  });
});

module.exports = router;