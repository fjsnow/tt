import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const merge = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

export type Todo = {
    id: number;
    text: string;
    repeat: "never" | "daily" | "weekly" | "monthly" | "yearly";
    lastCreated: Date;
    done: boolean;
    colour: string;
};

export const getRandomColour = () => {
    const colours = [
        "bg-red-500",
        "bg-yellow-500",
        "bg-green-500",
        "bg-blue-500",
        "bg-indigo-500",
        "bg-purple-500",
        "bg-pink-500",
    ];

    return colours[Math.floor(Math.random() * colours.length)];
};

export const load = (): Todo[] => {
    const serialized = localStorage.getItem("todos");
    if (!serialized) return [];

    return JSON.parse(serialized);
};

export const save = (todos: Todo[]) => {
    const serialized = JSON.stringify(todos);
    localStorage.setItem("todos", serialized);
};
