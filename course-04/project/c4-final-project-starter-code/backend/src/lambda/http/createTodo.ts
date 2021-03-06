import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import {getUserIdFromEvent} from "../../auth/utils";
import {createTodoItem} from "../../businessLogic/todoLogic";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userId = getUserIdFromEvent(event);
  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  const createdTodoItem = await createTodoItem(newTodo, userId);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: createdTodoItem
    })
  };
};
