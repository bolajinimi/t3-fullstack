import {z} from "zod";

export const todoInput = z
.string({
    required_error: "Please enter a todo item",
}).min(1).max(50);