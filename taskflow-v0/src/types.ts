export type Status = "todo" | "doing" | "done";
export const MAX_TITLE = 80;
export type Priority = 1 | 2 | 3;
export type Task = { id: string; title: string; status: Status; priority: Priority};
export type Filter = "all" | Status;

export const STATUS_LABEL: Record<Status, string> = {
    todo: "A faire",
    doing: "En cours",
    done: "Terminée",
}

export const nextStatus = (s: Status): Status =>
    s === "todo" ? "doing" : s === "doing" ? "done" : "todo";