import { useEffect, useState } from 'react';

export type Task = {
    id: string;
    title: string;
    completed: boolean;
};

// Shared task list + listeners (acts like a small global store)
let tasksState: Task[] = [];
let listeners: (() => void)[] = [];

// Notify all subscribed components
const emitChange = () => {
    listeners.forEach(listener => listener());
};

// Update store and trigger refresh
const updateTasks = (newTasks: Task[]) => {
    tasksState = newTasks;
    emitChange();
};

export const useTasks = () => {
    // Local state stays in sync with the shared store
    const [tasks, setTasks] = useState<Task[]>(tasksState);

    useEffect(() => {
        // Each hook instance listens for store updates
        const listener = () => {
            setTasks(tasksState);
        };

        listeners.push(listener);

        // Remove listener when component unmounts
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }, []);

    // Add a new task
    const addTask = (title: string) => {
        if (title.trim() === "") return;
        const task: Task = {
            id: Date.now().toString(),
            title: title,
            completed: false,
        };
        updateTasks([...tasksState, task]);
    };

    // Toggle completed state
    const toggleTask = (id: string) => {
        const newTasks = tasksState.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        updateTasks(newTasks);
    };

    // Remove task
    const deleteTask = (id: string) => {
        const newTasks = tasksState.filter((task) => task.id !== id);
        updateTasks(newTasks);
    };

    // First three uncompleted tasks (used for a priority list)
    const getTopTasks = (): Task[] => {
        return tasksState
            .filter(task => !task.completed)
            .sort((a, b) => parseInt(a.id) - parseInt(b.id))
            .slice(0, 3);
    };

    // Completion percentage
    const getProgress = (): number => {
        const totalCount = tasksState.length;
        if (totalCount === 0) return 0;

        const completedCount = tasksState.filter(t => t.completed).length;
        return Math.round((completedCount / totalCount) * 100);
    };

    return {
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        getTopTasks,
        getProgress
    };
};
