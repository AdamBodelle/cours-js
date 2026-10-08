import { useState, useEffect } from 'react'
import './App.css'

import { nextStatus, type Filter, type Priority, type Task, type Status } from "./types";
import { FilterBar } from "./components/FilterBar";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { Card } from "./components/Card";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { ThemeToggle } from "./components/ThemeToggle";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { FocusTimer } from "./components/FocusTimer.tsx";

const INITIAL_TASKS: Task[] = [
  { id: "t1", title: "Installer Node.js 22", status: "done", priority: 1 },
  { id: "t2", title: "Lire la doc useState", status: "done", priority: 2 },
  { id: "t3", title: "Terminer le TP1", status: "done", priority: 1 },
]

const next = (s: Status): Status =>
  s === "todo" ? "doing" : s === "doing" ? "done" : "todo";

export default function App() {
  return (
    <ThemeProvider>
      <Board />
    </ThemeProvider>
  );
}

function Board() {
  // Tâches sauvegardées dans le navigateur (hook personnalisé)
  const [tasks, setTasks] = useLocalStorage<Task[]>(
    "taskflow-tasks",
    [],
  );
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
  const remaining = tasks.filter((t) => t.status !== "done").length;
  // Synchroniser le titre de l'onglet avec les tâches restantes
  useEffect(() => {
    document.title =
      remaining > 0 ? `(${remaining}) TaskFlow` : "TaskFlow";
  }, [remaining]);

  function add(title: string, priority: Priority) {
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, status: "todo", priority },
    ]);
  }

  const cycle = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: next(t.status) } : t))
    );

  const remove = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <main className="app">
      <h1>
        TaskFlow <small>{remaining} restante(s)</small>
      </h1>
      <ThemeToggle />
      <Card title='Timer'>
        <FocusTimer />
      </Card>
      <TaskForm onAdd={add} />
      <FilterBar value={filter} onChange={setFilter} />
      <TaskList tasks={visible} onCycle={cycle} onRemove={remove} />
    </main>
  );
}

