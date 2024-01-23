"use client";

import { Todo, getRandomColour, load, merge, save } from "@/lib/utils";
import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable,
    OnDragEndResponder,
} from "@hello-pangea/dnd";
import { Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useDebounce } from "use-debounce";

export const Lists = () => {
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        if (todos.length == 0) setTodos(load());
    }, [todos]);

    const newTodoRef = useRef<HTMLInputElement>(null);

    const addTodo = (todo: Todo) => {
        setTodos([...todos, todo]);
    };

    const removeTodo = (id: number) => {
        todos.splice(todos.indexOf(todos.find((todo) => todo.id === id)!), 1);
        setTodos([...todos]);
        save(todos);
    };

    const onDragEnd: OnDragEndResponder = (result: DropResult) => {
        if (!result.destination) return;

        const todo = todos.find(
            (todo) => todo.id === Number(result.draggableId),
        );
        if (!todo) return;

        todo.done = result.destination.droppableId === "done";

        const currentIndex = todos.indexOf(todo);
        todos.splice(currentIndex, 1);

        let newIndex = todos.indexOf(
            todos.filter((t) => t.done === todo.done)[result.destination.index],
        );
        if (newIndex === -1) newIndex = todos.length;

        todos.splice(newIndex, 0, todo);
        setTodos([...todos]);
        save(todos);
    };

    return (
        <div className="flex w-full flex-col items-center justify-between gap-8">
            <div className="flex w-full gap-2">
                <DragDropContext onDragEnd={onDragEnd}>
                    <TodoList
                        todos={todos.filter((todo) => !todo.done)}
                        type="todo"
                        save={() => save(todos)}
                        removeTodo={removeTodo}
                    />
                    <TodoList
                        todos={todos.filter((todo) => todo.done)}
                        type="done"
                        save={() => save(todos)}
                        removeTodo={removeTodo}
                    />
                </DragDropContext>
            </div>
            {todos.length == 0 && (
                <div className="flex flex-grow flex-col items-center justify-center gap-2">
                    <h1 className="text-2xl font-bold text-stone-700">
                        No todos yet!
                    </h1>
                    <p className="text-stone-500">
                        Add a new todo to get started.
                    </p>
                </div>
            )}
            <form
                className="mb-2 w-full rounded-lg border border-dashed border-stone-300"
                onSubmit={(e) => {
                    e.preventDefault();

                    const text = newTodoRef.current?.value || "";
                    if (!text) return;

                    addTodo({
                        id: Math.floor(Math.random() * 0xffffff),
                        text: text,
                        repeat: "never",
                        lastCreated: new Date(),
                        done: false,
                        colour: getRandomColour(),
                    });

                    if (newTodoRef.current) newTodoRef.current.value = "";
                }}
            >
                <input
                    className="w-full rounded-lg p-4 outline-none"
                    placeholder="New todo..."
                    ref={newTodoRef}
                />
            </form>
        </div>
    );
};

export const TodoList = ({
    todos,
    type,
    save,
    removeTodo,
}: {
    todos: Todo[];
    type: "todo" | "done";
    save: () => void;
    removeTodo: (id: number) => void;
}) => {
    return (
        <div className="flex flex-grow basis-0 flex-col items-center gap-4">
            <h1 className="text-2xl font-bold text-stone-700">
                {type} {type === "todo" ? "(◡︵◡)" : "(⌐■_■)"}
            </h1>
            <Droppable droppableId={type}>
                {(provided) => (
                    <>
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="flex w-full flex-grow flex-col items-center"
                        >
                            {todos.map((todo, index) => (
                                <TodoCard
                                    key={todo.id}
                                    index={index}
                                    todo={todo}
                                    save={save}
                                    removeTodo={() => removeTodo(todo.id)}
                                />
                            ))}

                            {provided.placeholder}
                        </div>
                    </>
                )}
            </Droppable>
        </div>
    );
};

export const TodoCard = ({
    index,
    todo,
    save,
    removeTodo,
}: {
    index: number;
    todo: Todo;
    save: () => void;
    removeTodo: () => void;
}) => {
    const [text, setText] = useState(todo.text);
    const [textDebounced] = useDebounce(text, 500);

    const textRef = useRef<HTMLHeadingElement>(null);
    const onTextChange = (e: ContentEditableEvent) => {
        todo.text = e.target.value;
        setText(e.target.value);
    };

    useEffect(() => {
        save();
    }, [textDebounced, save]);

    return (
        <Draggable draggableId={todo.id.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className={merge(
                        "mb-2 flex w-full flex-col gap-4 rounded-lg border-4 border-transparent p-4",
                        todo.colour,
                        snapshot.isDragging && "border-black/10 shadow-lg",
                    )}
                >
                    <ContentEditable
                        className="text-white outline-none"
                        innerRef={textRef}
                        html={todo.text}
                        onChange={onTextChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                textRef.current?.blur();
                            }
                        }}
                        tagName="h1"
                    />
                    <div className="flex justify-end gap-2 text-white/80 transition-colors">
                        <Trash
                            onClick={removeTodo}
                            size={20}
                            className="cursor-pointer hover:text-white"
                        />
                    </div>
                </div>
            )}
        </Draggable>
    );
};
