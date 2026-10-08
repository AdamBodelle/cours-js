import { useTheme } from "../context/ThemeContext.tsx";
export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <button type="button" onClick={toggleTheme}>
            {theme === "light" ? "Mode sombre" : "Mode clair"}
        </button>
    );
}