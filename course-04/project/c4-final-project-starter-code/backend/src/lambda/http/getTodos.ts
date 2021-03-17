import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUserIdFromEvent} from "../../auth/utils";
import {TodoCRUD} from "../../utils/TodoCRUD";

const todoCrud = new TodoCRUD();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId = getUserIdFromEvent(event);

    const todos = await todoCrud.getTodos(userId);

    // Send results
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            items: todos
        })
    }
};
