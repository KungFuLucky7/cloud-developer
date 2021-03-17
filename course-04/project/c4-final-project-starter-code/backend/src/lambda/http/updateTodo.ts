import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import {TodoCRUD} from "../../utils/TodoCRUD";
import { getUserIdFromEvent } from "../../auth/utils";

const todoCrud = new TodoCRUD();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserIdFromEvent(event);
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
  await todoCrud.updateTodo(todoId, userId, updatedTodo);

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({})
  }
};

