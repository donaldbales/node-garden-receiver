"use strict";
// notifier.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-console */
const bunyan = require("bunyan");
const changeCase = require("change-case");
const db = require("./db");
const emailer = require("./emailer");
const inspect_1 = require("./inspect");
const logger = bunyan.createLogger({ name: 'six' });
const moduleName = 'src/lib/notifier.js';
const REQUEST_MADE = 'REQUEST_MADE';
const RESPONSE_MADE = 'RESPONSE_MADE';
const RESPONSE_READ = 'RESPONSE_READ';
const RESPONSE_EXPIRED = 'RESPONSE_EXPIRED';
const sixURL = process.env.SIX_URL || 'hic-37.bounteous.com';
function fixCase(rowDataPackets) {
    const results = [];
    for (const rowDataPacket of rowDataPackets) {
        // console.log(rowDataPacket);
        const result = {};
        for (const property in rowDataPacket) {
            if (rowDataPacket.hasOwnProperty(property)) {
                // console.log(property);
                const camelCase = changeCase.camelCase(property);
                // console.log(camelCase);
                result[camelCase] = rowDataPacket[property];
            }
        }
        results.push(result);
    }
    // console.log(results);
    return results;
}
function notify(exchange) {
    return __awaiter(this, void 0, void 0, function* () {
        const methodName = 'notify';
        console.log(`${moduleName}, ${methodName}, starting...`);
        console.log(exchange);
        let conn;
        let results;
        let requestor;
        let responder;
        let notifications;
        const requestorUserId = exchange.requestorUserId.toString();
        const responderUserId = exchange.responderUserId.toString();
        const exchangeId = exchange.id.toString();
        try {
            conn = yield db.connect();
            requestor = yield db.query(conn, 'select * from USERS where ID = ?', [requestorUserId]);
            console.log(`notifier#notify requestor=${inspect_1.inspect(requestor)}`);
            requestor = fixCase(requestor.results);
            console.log(`notifier#notify requestor=${inspect_1.inspect(requestor)}`);
            requestor = requestor[0];
            console.log(`notifier#notify requestor=${inspect_1.inspect(requestor)}`);
        }
        catch (error) {
            logger.error({ moduleName, methodName, error }, 'Getting requestor');
            conn.release();
            return error;
        }
        try {
            responder = yield db.query(conn, 'select * from USERS where ID = ?', [responderUserId]);
            responder = fixCase(responder.results);
            responder = responder[0];
            console.log(`notifier#notify responder=`);
            console.log(responder);
        }
        catch (error) {
            logger.error({ moduleName, methodName, error }, 'Getting responder');
            conn.release();
            return error;
        }
        try {
            notifications = yield db.query(conn, 'select * from EXCHANGE_NOTIFICATIONS where EXCHANGE_ID = ?', [exchangeId]);
            notifications = fixCase(notifications.results);
            console.log(`notifier#notify notifications=`);
            console.log(notifications);
            conn.release();
        }
        catch (error) {
            logger.error({ moduleName, methodName, error }, 'Getting notifications');
            conn.release();
            return error;
        }
        const notificationTypes = new Set();
        for (const notification of notifications) {
            if (notification.sendStatus === 'OK') {
                if (!notificationTypes.has(notification.notificationType)) {
                    notificationTypes.add(notification.notificationType);
                }
            }
        }
        console.log(`notifier#notify noticationTypes=${inspect_1.inspect(notificationTypes)}`);
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
    });
}
exports.notify = notify;
function logNotification(exchangeId, notificationType, from, to, subject, text, sendResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        const methodName = 'logNotification';
        console.log(`notifier#logNotification: starting...`);
        let conn;
        const params = [];
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
        let results;
        try {
            conn = yield db.connect();
            results = yield db.query(conn, `
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
        }
        catch (error) {
            logger.error({ moduleName, methodName, error }, 'Logging notifications');
            conn.release();
            return error;
        }
    });
}
function notifyRequestMade(exchange, requestor, responder) {
    return __awaiter(this, void 0, void 0, function* () {
        const methodName = 'notifyRequestMade';
        logger.info({ moduleName, methodName }, 'starting...');
        const exchangeId = exchange.id.toString();
        const from = `Secure Information Exchange (SIX) <${requestor.username}>`;
        const to = responder.username;
        const subject = 'Request Made';
        let text = '';
        text += `${responder.name},\n\n`;
        text += `${requestor.name} has made a request for information. Go to ${sixURL} to respond.\n\n`;
        text += `Thank you in advance for your prompt reply.`;
        let sendResponse;
        let results;
        try {
            sendResponse = yield emailer.send(from, to, subject, text);
            results = logNotification(exchangeId, REQUEST_MADE, from, to, subject, text, sendResponse);
        }
        catch (error) {
            logger.error({ moduleName, methodName, error }, 'Logging notifications');
            return error;
        }
        return results;
    });
}
function notifyResponseMade(exchange, requestor, responder) {
    return __awaiter(this, void 0, void 0, function* () {
        const methodName = 'notifyResponseMade';
        logger.info({ moduleName, methodName }, 'starting...');
        const exchangeId = exchange.id.toString();
        const from = `Secure Information Exchange (SIX) <${responder.username}>`;
        const to = requestor.username;
        const subject = 'Response Made';
        let text = '';
        text += `${requestor.name},\n\n`;
        text += `${responder.name} has responded to your request for information. Go to ${sixURL} to view the response.\n\n`;
        text += `Thank you in advance for your prompt viewing.`;
        let sendResponse;
        let results;
        try {
            sendResponse = yield emailer.send(from, to, subject, text);
            results = logNotification(exchangeId, RESPONSE_MADE, from, to, subject, text, sendResponse);
        }
        catch (error) {
            logger.error({ moduleName, methodName, error }, 'Logging notifications');
            return error;
        }
        return results;
    });
}
function notifyResponseRead(exchange, requestor, responder) {
    return __awaiter(this, void 0, void 0, function* () {
        const methodName = 'notifyResponseRead';
        logger.info({ moduleName, methodName }, 'starting...');
        const exchangeId = exchange.id.toString();
        const from = `Secure Information Exchange (SIX) <${requestor.username}>`;
        const to = responder.username;
        const subject = 'Response Read';
        let text = '';
        text += `${responder.name},\n\n`;
        text += `${requestor.name} has viewed their request for information for which you responded.\n\n`;
        text += `Thank you again for your prompt reply.`;
        let sendResponse;
        let results;
        try {
            sendResponse = yield emailer.send(from, to, subject, text);
            results = logNotification(exchangeId, RESPONSE_READ, from, to, subject, text, sendResponse);
        }
        catch (error) {
            logger.error({ moduleName, methodName, error }, 'Logging notifications');
            return error;
        }
        return results;
    });
}
function notifyResponseExpired(exchange, requestor, responder) {
    return __awaiter(this, void 0, void 0, function* () {
        const methodName = 'notifyResponseExpired';
        logger.info({ moduleName, methodName }, 'starting...');
        const exchangeId = exchange.id.toString();
        const from = `Secure Information Exchange (SIX) <${requestor.username}>`;
        const to = responder.username;
        const subject = 'Response Expired';
        let text = '';
        text += `${responder.name},\n\n`;
        text += `Unfortunately, ${requestor.name} view their request for information in the time alloted.\n\n`;
        text += `Thank you once again for your cooperation.`;
        let sendResponse;
        let results;
        try {
            sendResponse = yield emailer.send(from, to, subject, text);
            results = logNotification(exchangeId, RESPONSE_EXPIRED, from, to, subject, text, sendResponse);
        }
        catch (error) {
            logger.error({ moduleName, methodName, error }, 'Logging notifications');
            return error;
        }
        return results;
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub3RpZmllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsY0FBYzs7Ozs7Ozs7OztBQUVkLCtCQUErQjtBQUUvQixpQ0FBaUM7QUFDakMsMENBQTBDO0FBRTFDLDJCQUEyQjtBQUMzQixxQ0FBcUM7QUFDckMsdUNBQW9DO0FBRXBDLE1BQU0sTUFBTSxHQUFRLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUN6RCxNQUFNLFVBQVUsR0FBVyxxQkFBcUIsQ0FBQztBQUVqRCxNQUFNLFlBQVksR0FBVyxjQUFjLENBQUM7QUFDNUMsTUFBTSxhQUFhLEdBQVcsZUFBZSxDQUFDO0FBQzlDLE1BQU0sYUFBYSxHQUFXLGVBQWUsQ0FBQztBQUM5QyxNQUFNLGdCQUFnQixHQUFXLGtCQUFrQixDQUFDO0FBRXBELE1BQU0sTUFBTSxHQUFZLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBa0IsSUFBSSxzQkFBc0IsQ0FBQztBQUVqRixpQkFBaUIsY0FBcUI7SUFDcEMsTUFBTSxPQUFPLEdBQVUsRUFBRSxDQUFDO0lBQzFCLEtBQUssTUFBTSxhQUFhLElBQUksY0FBYyxFQUFFO1FBQzFDLDhCQUE4QjtRQUM5QixNQUFNLE1BQU0sR0FBUSxFQUFFLENBQUM7UUFDdkIsS0FBSyxNQUFNLFFBQVEsSUFBSSxhQUFhLEVBQUU7WUFDcEMsSUFBSSxhQUFhLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUMxQyx5QkFBeUI7Z0JBQ3pCLE1BQU0sU0FBUyxHQUFXLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3pELDBCQUEwQjtnQkFDMUIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUM3QztTQUNGO1FBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FB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