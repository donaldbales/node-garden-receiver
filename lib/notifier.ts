// notifier.ts

/* tslint:disable:no-console */

import * as bunyan from 'bunyan';
import * as changeCase from 'change-case';

import * as db from './db';
import * as emailer from './emailer';
import { inspect } from './inspect';

const logger: any = bunyan.createLogger({ name: 'six' });
const moduleName: string = 'src/lib/notifier.js';

const REQUEST_MADE: string = 'REQUEST_MADE';
const RESPONSE_MADE: string = 'RESPONSE_MADE';
const RESPONSE_READ: string = 'RESPONSE_READ';
const RESPONSE_EXPIRED: string = 'RESPONSE_EXPIRED';

const sixURL: string = (process.env.SIX_URL as string) || 'hic-37.bounteous.com';

function fixCase(rowDataPackets: any[]): any[] {
  const results: any[] = [];
  for (const rowDataPacket of rowDataPackets) {
    // console.log(rowDataPacket);
    const result: any = {};
    for (const property in rowDataPacket) {
      if (rowDataPacket.hasOwnProperty(property)) {
        // console.log(property);
        const camelCase: string = changeCase.camelCase(property);
        // console.log(camelCase);
        result[camelCase] = rowDataPacket[property];
      }
    }
    results.push(result);
  }
  // console.log(results);
  return results;
}

export async function notify(exchange: any): Promise<any> {
  const methodName: string = 'notify';
  console.log(`${moduleName}, ${methodName}, starting...`);
  console.log(exchange);
  let conn: any;
  let results: any;
  let requestor: any;
  let responder: any;
  let notifications: any;
  const requestorUserId: string = exchange.requestorUserId.toString();
  const responderUserId: string = exchange.responderUserId.toString();
  const exchangeId: string = exchange.id.toString();
  try {
    conn = await db.connect();
    requestor = await db.query(conn, 'select * from USERS where ID = ?', [ requestorUserId ]);
    console.log(`notifier#notify requestor=${inspect(requestor)}`);    
    requestor = fixCase(requestor.results);
    console.log(`notifier#notify requestor=${inspect(requestor)}`);
    requestor = requestor[0];
    console.log(`notifier#notify requestor=${inspect(requestor)}`);
  } catch (error) {
    logger.error({ moduleName, methodName, error }, 'Getting requestor');
    conn.release();
    return error;
  }
  try {
    responder = await db.query(conn, 'select * from USERS where ID = ?', [ responderUserId ]);
    responder = fixCase(responder.results);
    responder = responder[0];
    console.log(`notifier#notify responder=`);
    console.log(responder);
  } catch (error) {
    logger.error({ moduleName, methodName, error }, 'Getting responder');
    conn.release();
    return error;
  }
  try {
    notifications = await db.query(conn, 'select * from EXCHANGE_NOTIFICATIONS where EXCHANGE_ID = ?', [ exchangeId ]);
    notifications = fixCase(notifications.results);
    console.log(`notifier#notify notifications=`);
    console.log(notifications);
    conn.release();
  } catch (error) {
    logger.error({ moduleName, methodName, error }, 'Getting notifications');
    conn.release();
    return error;
  }
  const notificationTypes: Set<string> = new Set();
  for (const notification of notifications) {
    if (notification.sendStatus === 'OK') {
      if (!notificationTypes.has(notification.notificationType)) {
        notificationTypes.add(notification.notificationType);
      }
    }
  }
  console.log(`notifier#notify noticationTypes=${inspect(notificationTypes)}`);
  if (!notificationTypes.has(REQUEST_MADE)) {
    console.log(`notifier#notify noticationType: REQUEST_MADE`);
    if (exchange.request && !exchange.response) {
      results = notifyRequestMade(exchange, requestor, responder);
    }
  }
  if (!notificationTypes.has(RESPONSE_MADE)) {
    console.log(`notifier#notify noticationType: RESPONSE_MADE`);
    if (exchange.request && exchange.response) {
      results = notifyResponseMade(exchange, requestor, responder);
    }
  }
  if (!notificationTypes.has(RESPONSE_READ)) {
    console.log(`notifier#notify noticationType: RESPONSE_READ`);
    if (exchange.request && exchange.response === 'Deleted') {
      results = notifyResponseRead(exchange, requestor, responder);
    }
  }
  if (!notificationTypes.has(RESPONSE_EXPIRED)) {
    console.log(`notifier#notify noticationType: RESPONSE_EXPIRED`);
    if (exchange.request && exchange.response === 'Expired') {
      results = notifyResponseExpired(exchange, requestor, responder);
    }
  }
  return results;
} 

async function logNotification(
  exchangeId: string,
  notificationType: string,
  from: string,
  to: string,
  subject: string,
  text: string,
  sendResponse: any): Promise<any> {
  const methodName: string = 'logNotification';
  console.log(`notifier#logNotification: starting...`); 
  let conn: any;
  const params: any[] = [];
  params.push(exchangeId);
  params.push(notificationType);
  params.push(from);
  params.push(to);
  params.push(subject);
  params.push(text);
  params.push(sendResponse);
  params.push((sendResponse.response && sendResponse.response.indexOf(' Ok') > -1) ? 'OK' : 'FAILED');
  params.push(new Date().toISOString());
  params.push(new Date().toISOString());
  let results: any;
  try {
    conn = await db.connect();
    results = await db.query(conn, `
      insert into EXCHANGE_NOTIFICATIONS (
             EXCHANGE_ID,
             NOTIFICATION_TYPE,
             EMAIL_FROM,
             EMAIL_TO,
             EMAIL_SUBJECT,
             EMAIL_BODY,
             SEND_RESPONSE,
             SEND_STATUS,
             CREATED_AT,
             UPDATED_AT )
      values (
             ?,
             ?,
             ?,
             ?,
             ?,
             ?,
             ?,
             ?,
             ?,
             ? )
    `, params);
    conn.release();
    return results;
  } catch (error) {
    logger.error({ moduleName, methodName, error }, 'Logging notifications');
    conn.release();
    return error;    
  }
}

async function notifyRequestMade(exchange: any, requestor: any, responder: any): Promise<any> {
  const methodName: string = 'notifyRequestMade';
  logger.info({ moduleName, methodName }, 'starting...');
  const exchangeId: string = exchange.id.toString();
  const from: string = `Secure Information Exchange (SIX) <${requestor.username}>`;
  const to: string = responder.username;
  const subject: string = 'Request Made';
  let text: string = '';
  text += `${responder.name},\n\n`;
  text += `${requestor.name} has made a request for information. Go to ${sixURL} to respond.\n\n`;
  text += `Thank you in advance for your prompt reply.`;
  
  let sendResponse: any;
  let results: any;
  try {
    sendResponse = await emailer.send(from, to, subject, text);
    results = logNotification(exchangeId, REQUEST_MADE, from, to, subject, text, sendResponse);
  } catch (error) {
    logger.error({ moduleName, methodName, error }, 'Logging notifications');
    return error;    
  }
  return results;
}

async function notifyResponseMade(exchange: any, requestor: any, responder: any): Promise<any> {
  const methodName: string = 'notifyResponseMade';
  logger.info({ moduleName, methodName }, 'starting...');
  const exchangeId: string = exchange.id.toString();
  const from: string = `Secure Information Exchange (SIX) <${responder.username}>`;
  const to: string = requestor.username;
  const subject: string = 'Response Made';
  let text: string = '';
  text += `${requestor.name},\n\n`;
  text += `${responder.name} has responded to your request for information. Go to ${sixURL} to view the response.\n\n`;
  text += `Thank you in advance for your prompt viewing.`;
  
  let sendResponse: any;
  let results: any;
  try {
    sendResponse = await emailer.send(from, to, subject, text);
    results = logNotification(exchangeId, RESPONSE_MADE, from, to, subject, text, sendResponse);
  } catch (error) {
    logger.error({ moduleName, methodName, error }, 'Logging notifications');
    return error;    
  }
  return results;
}

async function notifyResponseRead(exchange: any, requestor: any, responder: any): Promise<any> {
  const methodName: string = 'notifyResponseRead';
  logger.info({ moduleName, methodName }, 'starting...');
  const exchangeId: string = exchange.id.toString();
  const from: string = `Secure Information Exchange (SIX) <${requestor.username}>`;
  const to: string = responder.username;
  const subject: string = 'Response Read';
  let text: string = '';
  text += `${responder.name},\n\n`;
  text += `${requestor.name} has viewed their request for information for which you responded.\n\n`;
  text += `Thank you again for your prompt reply.`;
  
  let sendResponse: any;
  let results: any;
  try {
    sendResponse = await emailer.send(from, to, subject, text);
    results = logNotification(exchangeId, RESPONSE_READ, from, to, subject, text, sendResponse);
  } catch (error) {
    logger.error({ moduleName, methodName, error }, 'Logging notifications');
    return error;    
  }
  return results;
}

async function notifyResponseExpired(exchange: any, requestor: any, responder: any): Promise<any> {
  const methodName: string = 'notifyResponseExpired';
  logger.info({ moduleName, methodName }, 'starting...');
  const exchangeId: string = exchange.id.toString();
  const from: string = `Secure Information Exchange (SIX) <${requestor.username}>`;
  const to: string = responder.username;
  const subject: string = 'Response Expired';
  let text: string = '';
  text += `${responder.name},\n\n`;
  text += `Unfortunately, ${requestor.name} view their request for information in the time alloted.\n\n`;
  text += `Thank you once again for your cooperation.`;
  
  let sendResponse: any;
  let results: any;
  try {
    sendResponse = await emailer.send(from, to, subject, text);
    results = logNotification(exchangeId, RESPONSE_EXPIRED, from, to, subject, text, sendResponse);
  } catch (error) {
    logger.error({ moduleName, methodName, error }, 'Logging notifications');
    return error;    
  }
  return results;
}
