const express = require("express");
const router = express.Router();
const db = require("../db");

const ALLOWED_FIELDS = ["id", "title", "owner", "completed"];

function matchTaskExpression(task, expr) {
  const trimmed = String(expr).trim();
  const match = trimmed.match(/^([a-zA-Z]+)\s*(==|!=|contains)\s*(.+)$/);

  if (!match) {
    throw new Error("Formato esperado: <campo> <==|!=|contains> <valor>");
  }

  const [, field, operator, rawValue] = match;
  if (!ALLOWED_FIELDS.includes(field)) {
    throw new Error(`Campo não permitido: ${field}`);
  }

  const cleanValue = rawValue.replace(/^['"]|['"]$/g, "").trim();
  const taskVal = task[field];

  if (operator === "==") {
    return String(taskVal).toLowerCase() === cleanValue.toLowerCase();
  }
  if (operator === "!=") {
    return String(taskVal).toLowerCase() !== cleanValue.toLowerCase();
  }
  return String(taskVal ?? "").toLowerCase().includes(cleanValue.toLowerCase());
}

// GET /api/tasks - lista todas as tarefas
router.get("/", (req, res) => {
  res.json(db.listTasks());
});

// GET /api/tasks/filter?expr=<expressão> - filtro avançado de tarefas
router.get("/filter", (req, res) => {
  const { expr } = req.query;
  if (!expr) return res.status(400).json({ error: "Parâmetro 'expr' é obrigatório" });
  try {
    const tasks = db.listTasks();
    const result = tasks.filter((t) => matchTaskExpression(t, expr));
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: "Expressão inválida", details: err.message });
  }
});

// GET /api/tasks/:id - busca uma tarefa pelo id
router.get("/:id", (req, res) => {
  const task = db.getTask(req.params.id);
  if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });
  res.json(task);
});

// POST /api/tasks - cria uma nova tarefa
router.post("/", (req, res) => {
  const { title, owner } = req.body;
  if (!title) return res.status(400).json({ error: "Campo 'title' é obrigatório" });
  const task = db.createTask({ title, owner });
  res.status(201).json(task);
});

// PATCH /api/tasks/:id - atualiza uma tarefa (ex: marcar como concluída)
router.patch("/:id", (req, res) => {
  const task = db.updateTask(req.params.id, req.body);
  if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });
  res.json(task);
});

// DELETE /api/tasks/:id - remove uma tarefa
router.delete("/:id", (req, res) => {
  const ok = db.deleteTask(req.params.id);
  if (!ok) return res.status(404).json({ error: "Tarefa não encontrada" });
  res.status(204).end();
});

module.exports = router;