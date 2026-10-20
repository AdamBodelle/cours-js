import { useEffect, useRef, useState, useMemo } from "react";
import { type Task, type ProjectWithTasks, type Priority } from "../types";
import { FilterBar } from "../components/FilterBar";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { Card } from "../components/Card";
import { Link } from "react-router";
import { NotFoundPage } from "./NotFoundPage";
import { api, ApiError } from "../api";


export function ProjectsPage() {
    // Les trois états d'un chargement : en cours, erreur, données
    const [projects, setProjects] = useState<ProjectWithTasks[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        let ignore = false; // true si la page est quittée avant
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
    }, []); // [] : une seule fois, à l'arrivée sur la pag
    if (loading) return <Loading />;
    if (error) return <ErrorMessage message={error} />;
    // …
    <ul className="project-grid">
        {projects.map((p) => {
            const done = p.tasks.filter(
                (t) => t.status === "done",
            ).length;
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

    useEffect(() => {
        let ignore = false;
        Promise.all([api.getProject(id), api.getTasks(id)])
            .then(([p, t]) => {
                if (ignore) return;
                setProject(p);
                setTasks(t);
            })
            .catch((e) => {
                if (ignore) return;
                if (e instanceof ApiError && e.status === 404)
                    setNotFound(true);
                else setError("Impossible de charger le projet.");
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });
        return () => {
            ignore = true;
        };
    }, [id]);

    // Modifier : l'API d'abord, PUIS l'état avec la réponse
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
    // …
    async function remove(taskId: string) {
        try {
            await api.deleteTask(taskId);
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
        } catch {
            setError("La tâche n'a pas pu être supprimée.");
        }
    }

    if (loading) return <Loading />;
    if (notFound) return <NotFoundPage />;
    if (!project)
        return <ErrorMessage message={error ?? "Projet indisponible."} />;
    const visible =
        filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
    return (
        <section>
            <Link to="/" className="small">
                ← Tous les projets
            </Link>
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