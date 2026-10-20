import { useEffect, useState } from "react";
import { type Task, type ProjectWithTasks, type Priority, type Filter } from "../types";
import { FilterBar } from "../components/FilterBar";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { Card } from "../components/Card";
import { Link, useParams } from "react-router";
import { NotFoundPage } from "./NotFoundPage";
import { api, ApiError } from "../api";
import { ErrorMessage } from "../components/ErrorMessage";

// Petit composant utilitaire pour le chargement
function Loading() {
  return <p>Chargement en cours…</p>;
}

// ==========================================
// 1. PAGE : LISTE DES PROJETS (/)
// ==========================================
export function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    api
      .getProjects()
      .then((data) => {
        if (!ignore) setProjects(data);
      })
      .catch(() => {
        if (!ignore) setError("Impossible de charger les projets.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section>
      <h1>Mes projets</h1>
      <ul className="project-grid">
        {projects.map((p) => {
          const done = p.tasks.filter((t) => t.status === "done").length;
          return (
            <li key={p.id}>
              <Link to={`/projects/${p.id}`} className="project-card">
                <h2>{p.name}</h2>
                <p className="muted">{p.description}</p>
                <p className="small">
                  {done} / {p.tasks.length} tâche(s) terminée(s)
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ==========================================
// 2. PAGE : DÉTAIL D'UN PROJET (/projects/:id)
// ==========================================
export function ProjectPage({ id }: { id: string }) {
  const [project, setProject] = useState<{ name: string; description: string } | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    setNotFound(false);

    Promise.all([api.getProject(id), api.getTasks(id)])
      .then(([p, t]) => {
        if (ignore) return;
        setProject(p);
        setTasks(t);
      })
      .catch((e) => {
        if (ignore) return;
        if (e instanceof ApiError && e.status === 404) {
          setNotFound(true);
        } else {
          setError("Impossible de charger le projet.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  // Ajouter une tâche
  async function add(title: string, priority: Priority) {
    try {
      const created = await api.createTask({
        projectId: id,
        title,
        status: "todo",
        priority,
      });
      setTasks((prev) => [...prev, created]);
    } catch {
      setError("La tâche n'a pas pu être ajoutée.");
    }
  }

  // Supprimer une tâche
  async function remove(taskId: string) {
    try {
      await api.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch {
      setError("La tâche n'a pas pu être supprimée.");
    }
  }

  // Modifier le statut d'une tâche (le fameux "cycle")
  async function cycle(taskId: string) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const nextStatus = task.status === "todo" ? "doing" : task.status === "doing" ? "done" : "todo";
    
    // Mise à jour optimiste (on met à jour l'écran tout de suite)
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)));
    
    try {
      await api.updateTask(taskId, { status: nextStatus });
    } catch {
      setError("Impossible de modifier le statut.");
      // En cas d'erreur, on annule la modification (rollback)
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: task.status } : t)));
    }
  }

  if (loading) return <Loading />;
  if (notFound) return <NotFoundPage />;
  if (!project) return <ErrorMessage message={error ?? "Projet indisponible."} />;

  const visible = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <section>
      <Link to="/" className="small">← Tous les projets</Link>
      <h1>{project.name}</h1>
      <p className="muted">{project.description}</p>
      
      {error && <ErrorMessage message={error} />}

      <Card
        title="Tâches"
        actions={<FilterBar value={filter} onChange={setFilter} />}
      >
        <TaskForm onAdd={add} />
        <TaskList tasks={visible} onCycle={cycle} onRemove={remove} />
      </Card>
    </section>
  );
}