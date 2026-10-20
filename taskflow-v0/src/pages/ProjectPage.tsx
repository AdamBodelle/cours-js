import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api, ApiError } from "../api";
import { type Task, type Priority, type Filter } from "../types";
import { NotFoundPage } from "./NotFoundPage";
import { ErrorMessage } from "../components/ErrorMessage";
import { Card } from "../components/Card";
import { FilterBar } from "../components/FilterBar";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";

// Petit composant utilitaire pour le chargement
function Loading() {
    return <p>Chargement du projet…</p>;
}

type Props = {
    id: string;
};

export function ProjectPage({ id }: Props) {
    // 1. Déclaration de TOUS les états
    const [project, setProject] = useState<{ name: string; description: string } | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<Filter>("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);

    // 2. Chargement des données
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

    // 3. Actions (ajout, suppression, cycle)
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

    async function remove(taskId: string) {
        try {
            await api.deleteTask(taskId);
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
        } catch {
            setError("La tâche n'a pas pu être supprimée.");
        }
    }

    async function cycle(taskId: string) {
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        const nextStatus = 
            task.status === "todo" ? "doing" : 
            task.status === "doing" ? "done" : "todo";
        
        // Mise à jour optimiste
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)));
        
        try {
            await api.updateTask(taskId, { status: nextStatus });
        } catch {
            setError("Impossible de modifier le statut.");
            // Rollback en cas d'erreur
            setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: task.status } : t)));
        }
    }

    // 4. Rendu conditionnel
    if (loading) return <Loading />;
    if (notFound) return <NotFoundPage />;
    if (!project) return <ErrorMessage message={error ?? "Projet indisponible."} />;

    const visible = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

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