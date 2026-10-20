import { Link } from "react-router";

export function AboutPage() {
  return (
    <main className="app" style={{ padding: "2rem" }}>
      <h1>À propos de TaskFlow</h1>
      <p>
        TaskFlow est une application de gestion de tâches construite avec React,
        TypeScript et Vite. Elle permet de créer, filtrer et suivre l'avancement
        de vos tâches.
      </p>
      <p>
        Les tâches sont sauvegardées dans le <code>localStorage</code> de votre
        navigateur.
      </p>
      <Link to="/">← Retour à l'accueil</Link>
    </main>
  );
}