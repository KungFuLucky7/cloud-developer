import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { TodoItem } from "../models/TodoItem";
import { TodoCrud } from "../dataLayer/todoCrud";
import { createLogger } from "../utils/logger";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const logger = createLogger('todoLogic');
const todoCrud = new TodoCrud();

export async function getTodoItems (userId: string): Promise<TodoItem[]> {
    logger.info("Getting TODOs:", {userId: userId});
    const items = await todoCrud.getTodos(userId);
    logger.info("Retrieved TODOs:", {userId: userId});

    return items as TodoItem[];
}

export async function createTodoItem (newTodo: CreateTodoRequest, userId: string): Promise<TodoItem> {
    logger.info("Creating a new TODO:", {userId: userId});
    const todoId = uuid.v4();
    const newTodoWithAdditionalInfo = {
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        done: ((newTodo.hasOwnProperty("done")) ? newTodo["done"] : false),
        ...newTodo
    };
    const createdTodoItem = await todoCrud.createTodo(newTodoWithAdditionalInfo);
    logger.info("Created a new TODO:", {userId: userId});

    return createdTodoItem;
}

export async function deleteTodoItem (todoId: string, userId: string) {
    logger.info("Deleting a TODO:", {todoId: todoId});
    await todoCrud.deleteTodo(todoId, userId);
    logger.info("Deleted a TODO:", {todoId: todoId});
}

export async function updateTodoItem (todoId: string, userId: string, updatedTodo: UpdateTodoRequest) {
    logger.info("Updating a TODO:", {
        todoId: todoId,
        updatedTodo: updatedTodo
    });
    await todoCrud.updateTodo(todoId, userId, updatedTodo);
    logger.info("Updated a TODO:", {
        todoId: todoId,
        updatedTodo: updatedTodo
    });
}

export async function updateTodoItemAttachmentUrl (todoId: string, userId: string, attachmentUrl: string) {
    logger.info(`Updating todoId ${todoId} with attachmentUrl ${attachmentUrl}`);
    await todoCrud.updateTodoAttachmentUrl(todoId, userId, attachmentUrl);
}
