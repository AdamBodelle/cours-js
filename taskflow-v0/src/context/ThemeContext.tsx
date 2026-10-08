import { useEffect, createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";


type Theme = "light" | "dark";
type ThemeContextValue = { theme: Theme; toggleTheme: () => void };
// 1. Créer le contexte (null = « pas de fournisseur au-dessus »)
const ThemeContext = createContext<ThemeContextValue | null>(null);
// 2. Le fournisseur : possède l'état et le partage
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useLocalStorage<Theme>(
        "taskflow-theme",
        "light",
    );
    function toggleTheme() {
        setTheme((current) => (current === "light" ? "dark" : "light"));
    }
    // Appliquer le thème à toute la page (data-theme sur <html>)
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === null) {
        throw new Error(
            "useTheme doit être utilisé à l'intérieur de <ThemeProvider>",
        );
    }
    return context;
}
// ---- components/ThemeToggle.tsx ----
export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <button type="button" onClick={toggleTheme}>
            {theme === "light" ? "Mode sombre" : "Mode clair"}
        </button>
    );
}