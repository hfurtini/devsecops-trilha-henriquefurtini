const express = require("express");
const cookieParser = require("cookie-parser");
const { doubleCsrf } = require("csrf-csrf");
const _ = require("lodash");

const tasksRouter = require("./routes/tasks");
const networkRouter = require("./routes/network");
const filesRouter = require("./routes/files");

const app = express();
const PORT = process.env.PORT || 3000;

const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || "saci-devsecops-csrf-default-secret",
  cookieName: "x-csrf-token",
  cookieOptions: {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(doubleCsrfProtection);

// Healthcheck - usado pelo Render para saber se a aplicação está no ar.
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: generateToken(req, res) });
});

app.get("/", (req, res) => {
  res.json({
    message: "SACI DevSecOps - API de Tarefas (código-base da trilha)",
    endpoints: _.uniq([
      "GET  /health",
      "GET  /api/csrf-token",
      "GET  /api/tasks",
      "GET  /api/tasks/:id",
      "POST /api/tasks",
      "PATCH /api/tasks/:id",
      "DELETE /api/tasks/:id",
      "GET  /api/tasks/filter?expr=...",
      "GET  /api/ping?host=...",
      "GET  /api/files/:filename",
    ]),
  });
});

app.use("/api/tasks", tasksRouter);
app.use("/api", networkRouter); // expõe GET /api/ping
app.use("/api/files", filesRouter);

app.listen(PORT, () => {
  console.log(`API de tarefas rodando na porta ${PORT}`);
});

module.exports = app;