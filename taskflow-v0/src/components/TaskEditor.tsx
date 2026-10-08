import { useEffect, useRef, useState, useMemo } from "react";
import { type Task } from "../types";

type Props = {
    task: Task;
    onCycle: (id: string) => void;
    onRemove: (id: string) => void;
}

function countWords(str: string) {
  return str.trim().split(/\s+/).length;
}

function TaskEditor({ task }: Props) {
    const [title, setTitle] = useState(task.title); // case 1
    const [saving, setSaving] = useState(false); // case 2
    const inputRef = useRef<HTMLInputElement>(null); // case 3
    useEffect(() => { // case 4
        inputRef.current?.focus();
    }, []);
    const words = useMemo( // case 5
        () => countWords(title), [title]);
    return (
        <form>
            <input ref={inputRef} value={title}
                onChange={(e) => setTitle(e.target.value)} />
            <small>{words} mots</small>
            <button disabled={saving}>Enregistrer</button>
        </form>
    );
}