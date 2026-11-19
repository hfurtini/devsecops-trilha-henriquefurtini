const express = require("express");
const router = express.Router();
const { execFile } = require("child_process");
const net = require("net");

const HOSTNAME_REGEX = /^(?!-)[a-zA-Z0-9-]{1,63}(?:\.[a-zA-Z0-9-]{1,63})*$/;

function isValidHost(host) {
  if (typeof host !== "string" || host.length === 0 || host.length > 253) {
    return false;
  }
  return net.isIP(host) !== 0 || HOSTNAME_REGEX.test(host);
}

function executePing(targetHost, callback) {
  execFile("ping", ["-c", "2", targetHost], { timeout: 5000 }, callback);
}

// GET /api/ping?host=<endereço> - diagnóstico de rede
router.get("/ping", (req, res) => {
  const { host } = req.query;
  if (!host) return res.status(400).json({ error: "Parâmetro 'host' é obrigatório" });

  if (!isValidHost(host)) {
    return res.status(400).json({ error: "Parâmetro 'host' inválido" });
  }

  executePing(host, (error, stdout, stderr) => {
    if (error) return res.status(500).json({ error: "Falha ao executar ping", details: stderr });
    res.json({ host, output: stdout });
  });
});

module.exports = router;