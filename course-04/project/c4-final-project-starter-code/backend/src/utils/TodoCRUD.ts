import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import {TodoItem} from "../models/TodoItem";
import * as uuid from 'uuid'
import { createLogger } from './logger'
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
const logger = createLogger('todoCrud');

const bucketName = process.env.TODOITEM_S3_BUCKET_NAME;

const XAWS = AWSXRay.captureAWS(AWS);

export class TodoCRUD {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOITEM_TABLE) {
    }

    async getTodos(userId: string): Promise<TodoItem[]> {
        logger.info("Getting TODOs:", {userId: userId})

        const result = await this.docClient.query({
            TableName: this.todoTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();
        const items = result.Items

        logger.info("Retrieved TODOs:", {userId: userId})

        return items as TodoItem[]
    }

    async createTodo(userId: string, newTodo: CreateTodoRequest): Promise<string> {
        logger.info("Creating a new TODO:", {userId: userId})

        const todoId = uuid.v4();
        const newTodoWithAdditionalInfo = {
            userId: userId,
            todoId: todoId,
            createdAt: new Date().toISOString(),
            ...newTodo
        }
        logger.info("Creating the TODO object:", newTodoWithAdditionalInfo);
        await this.docClient.put({
            TableName: this.todoTable,
            Item: newTodoWithAdditionalInfo
        }).promise();

        logger.info("Created a new TODO:", {userId: userId})

        return todoId;

    }

    async deleteTodo(todoId: string, userId: string) {
        logger.info("Deleting a TODO:", {todoId: todoId});

        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId,
                "userId": userId,
            }
        }).promise();

        logger.info("Deleted a TODO:", {todoId: todoId});
    }

    async updateTodo(todoId: string, userId: string, updatedTodo: UpdateTodoRequest){
        logger.info("Updating a TODO:", {
            todoId: todoId,
            updatedTodo: updatedTodo
        });

        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId,
                "userId": userId,
            },
            UpdateExpression: "set #todoName = :name, done = :done, dueDate = :dueDate",
            ExpressionAttributeNames: {
                "#todoName": "name"
            },
            ExpressionAttributeValues: {
                ":name": updatedTodo.name,
                ":done": updatedTodo.done,
                ":dueDate": updatedTodo.dueDate
            }
        }).promise()

        logger.info("Updated a TODO:", {
            todoId: todoId,
            updatedTodo: updatedTodo
        });
    }

    async updateTodoAttachmentUrl(todoId: string, userId: string, attachmentUrl: string){

        logger.info(`Updating todoId ${todoId} with attachmentUrl ${attachmentUrl}`)

        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId,
                "userId": userId,
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${bucketName}.s3.amazonaws.com/${attachmentUrl}`
            }
        }).promise();
    }

}
