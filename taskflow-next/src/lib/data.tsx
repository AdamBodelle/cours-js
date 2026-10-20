import db from "../../db.json";
import type { ProjectWithTasks, Task } from "./types";
// Ce fichier n'est utilisé QUE par des composants serveur :
// les données ne passent jamais par une API publique.
// Dans un vrai projet : une base de données (PostgreSQL…).
const tasks = db.tasks as Task[];
// Simule le temps de réponse d'une base de données
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
export async function getProjects(): Promise<ProjectWithTasks[]> {
    await wait(600);
    return db.projects.map((p) => ({
        ...p,
        tasks: tasks.filter((t) => t.projectId === p.id),
    }));
}
export async function getProject(
    id: string,
): Promise<ProjectWithTasks | null> {
    await wait(600);
    const project = db.projects.find((p) => p.id === id);
    if (!project) return null;
    return { ...project, tasks: tasks.filter((t) => t.projectId === id) };
}