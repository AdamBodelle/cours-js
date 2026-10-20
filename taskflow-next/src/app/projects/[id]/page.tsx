import Link from "next/link";
import { notFound } from "next/navigation";
import { TaskBoard } from "@/components/TaskBoard";
import { getProject } from "@/lib/data";
type Props = { params: Promise<{ id: string }> };
// Dossier [id] : une page pour chaque projet (/projects/app-bde…)
export default async function ProjectPage({ params }: Props) {
    const { id } = await params; // la partie variable de l'adresse
    const project = await getProject(id);
    if (!project) notFound(); // affiche app/not-found.tsx
    return (
        <section>
            <Link href="/" className="small">
                ← Tous les projets
            </Link>
            <h1>{project.name}</h1>
            <p className="muted">{project.description}</p>
            <TaskBoard tasks={project.tasks} />
        </section>
    );
}