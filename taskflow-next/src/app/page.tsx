import { getProjects } from "@/lib/data";
import type { Metadata } from "next";
import Link from "next/link";
// Le dossier app/about donne l'adresse /about
export default async function ProjectsPage() {
  const projects = await getProjects(); // pas de useEffect
  // …
  return (
    <section>
      <h1>Projets</h1>
      <ul className="project-grid">
        {projects.map((p) => {
          const done = p.tasks.filter((t) => t.status === "done");
          return (
            <li key={p.id}>
              <Link href={`/projects/${p.id}`} className="project-card">
                <h2>{p.name}</h2>
                <p className="muted">{p.description}</p>
                <p className="small">
                  {done.length} / {p.tasks.length} tâche(s) terminée(s)
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
