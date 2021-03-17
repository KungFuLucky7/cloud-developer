import { decode } from 'jsonwebtoken'

import { JwtToken } from './JwtToken'
import {APIGatewayProxyEvent} from "aws-lambda";

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function getUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtToken
  return decodedJwt.sub
}

export function getUserIdFromEvent(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization;
  const jwtToken = authorization.split(' ')[1];
  return getUserId(jwtToken);
}
