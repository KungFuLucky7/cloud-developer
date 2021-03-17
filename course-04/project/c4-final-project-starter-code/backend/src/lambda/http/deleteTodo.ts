import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {TodoCRUD} from "../../utils/TodoCRUD";
import { getUserIdFromEvent } from "../../auth/utils";

const todoCrud = new TodoCRUD();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserIdFromEvent(event);

  await todoCrud.deleteTodo(todoId, userId);

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({})
  }
};
