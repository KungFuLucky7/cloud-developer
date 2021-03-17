import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import {TodoItem} from "../models/TodoItem";
import { createLogger } from '../utils/logger'
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";

const logger = createLogger('todoCrud');
const bucketName = process.env.TODOITEM_S3_BUCKET_NAME;
const XAWS = AWSXRay.captureAWS(AWS);

export class TodoCrud {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOITEM_TABLE,
        private readonly todoTableGsi = process.env.TODOITEM_TABLE_GSI ) {
    }

    async getTodos(userId: string): Promise<TodoItem[]> {
        const result = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.todoTableGsi,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();
        const items = result.Items;

        return items as TodoItem[];
    }

    async createTodo(newTodoWithAdditionalInfo: TodoItem): Promise<TodoItem> {
        logger.info("Creating the TODO object:", newTodoWithAdditionalInfo);
        await this.docClient.put({
            TableName: this.todoTable,
            Item: newTodoWithAdditionalInfo
        }).promise();

        return newTodoWithAdditionalInfo;
    }

    async deleteTodo(todoId: string, userId: string) {
        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId,
                "userId": userId,
            }
        }).promise();
    }

    async updateTodo(todoId: string, userId: string, updatedTodo: UpdateTodoRequest) {
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
        }).promise();
    }

    async updateTodoAttachmentUrl(todoId: string, userId: string, attachmentId: string) {
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId,
                "userId": userId,
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${bucketName}.s3.amazonaws.com/${attachmentId}`
            }
        }).promise();
    }

}
