import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as uuid from 'uuid';
import * as AWS from 'aws-sdk';
import * as AWSXRay from "aws-xray-sdk";

import { createLogger } from '../../utils/logger'
import {TodoCRUD} from "../../utils/TodoCRUD";
import { getUserIdFromEvent } from "../../auth/utils";

const logger = createLogger('generateUploadUrl')
const XAWS = AWSXRay.captureAWS(AWS);
const bucketName = process.env.TODOITEM_S3_BUCKET_NAME;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
});

const todoCrud = new TodoCRUD();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const attachmentId = uuid.v4();

  logger.info("Generating upload URL:", {
    todoId: todoId,
    attachmentId: attachmentId
  });
  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: attachmentId,
    Expires: urlExpiration
  });
  const userId = getUserIdFromEvent(event);

  await todoCrud.updateTodoAttachmentUrl(todoId, userId, attachmentId);

  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  }
};
