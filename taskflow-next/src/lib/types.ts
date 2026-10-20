export type Status = "todo" | "doing" | "done";
export const MAX_TITLE = 80;
export type Priority = 1 | 2 | 3;
export type Task = { id: string; projectId: string, title: string; status: Status; priority: Priority};
export type Project = { id: string; name: string; description: string };
export type Filter = "all" | Status;

export const STATUS_LABEL: Record<Status, string> = {
    todo: "A faire",
    doing: "En cours",
    done: "Terminée",
}

export const nextStatus = (s: Status): Status =>
    s === "todo" ? "doing" : s === "doing" ? "done" : "todo";

export type NewProject = Omit<Project, "id">;
export type NewTask = Omit<Task, "id">;
// Projet avec ses tâches (réponse de /projects?_embed=tasks)
export type ProjectWithTasks = Project & { tasks: Task[] }