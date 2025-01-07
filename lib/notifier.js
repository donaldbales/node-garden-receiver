"use strict";
// notifier.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notify = void 0;
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
            console.log(`notifier#notify requestor=${(0, inspect_1.inspect)(requestor)}`);
            requestor = fixCase(requestor.results);
            console.log(`notifier#notify requestor=${(0, inspect_1.inspect)(requestor)}`);
            requestor = requestor[0];
            console.log(`notifier#notify requestor=${(0, inspect_1.inspect)(requestor)}`);
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
        console.log(`notifier#notify noticationTypes=${(0, inspect_1.inspect)(notificationTypes)}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub3RpZmllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsY0FBYzs7Ozs7Ozs7Ozs7O0FBRWQsK0JBQStCO0FBRS9CLGlDQUFpQztBQUNqQywwQ0FBMEM7QUFFMUMsMkJBQTJCO0FBQzNCLHFDQUFxQztBQUNyQyx1Q0FBb0M7QUFFcEMsTUFBTSxNQUFNLEdBQVEsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQ3pELE1BQU0sVUFBVSxHQUFXLHFCQUFxQixDQUFDO0FBRWpELE1BQU0sWUFBWSxHQUFXLGNBQWMsQ0FBQztBQUM1QyxNQUFNLGFBQWEsR0FBVyxlQUFlLENBQUM7QUFDOUMsTUFBTSxhQUFhLEdBQVcsZUFBZSxDQUFDO0FBQzlDLE1BQU0sZ0JBQWdCLEdBQVcsa0JBQWtCLENBQUM7QUFFcEQsTUFBTSxNQUFNLEdBQVksT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFrQixJQUFJLHNCQUFzQixDQUFDO0FBRWpGLFNBQVMsT0FBTyxDQUFDLGNBQXFCO0lBQ3BDLE1BQU0sT0FBTyxHQUFVLEVBQUUsQ0FBQztJQUMxQixLQUFLLE1BQU0sYUFBYSxJQUFJLGNBQWMsRUFBRTtRQUMxQyw4QkFBOEI7UUFDOUIsTUFBTSxNQUFNLEdBQVEsRUFBRSxDQUFDO1FBQ3ZCLEtBQUssTUFBTSxRQUFRLElBQUksYUFBYSxFQUFFO1lBQ3BDLElBQUksYUFBYSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDMUMseUJBQXlCO2dCQUN6QixNQUFNLFNBQVMsR0FBVyxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN6RCwwQkFBMEI7Z0JBQzFCLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDN0M7U0FDRjtRQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDdEI7SUFDRCx3QkFBd0I7SUFDeEIsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQztBQUVELFNBQXNCLE1BQU0sQ0FBQyxRQUFhOztRQUN4QyxNQUFNLFVBQVUsR0FBVyxRQUFRLENBQUM7UUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsS0FBSyxVQUFVLGVBQWUsQ0FBQyxDQUFDO1FBQ3pELE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEIsSUFBSSxJQUFTLENBQUM7UUFDZCxJQUFJLE9BQVksQ0FBQztRQUNqQixJQUFJLFNBQWMsQ0FBQztRQUNuQixJQUFJLFNBQWMsQ0FBQztRQUNuQixJQUFJLGFBQWtCLENBQUM7UUFDdkIsTUFBTSxlQUFlLEdBQVcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwRSxNQUFNLGVBQWUsR0FBVyxRQUFRLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BFLE1BQU0sVUFBVSxHQUFXLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEQsSUFBSTtZQUNGLElBQUksR0FBRyxNQUFNLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMxQixTQUFTLEdBQUcsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxrQ0FBa0MsRUFBRSxDQUFFLGVBQWUsQ0FBRSxDQUFDLENBQUM7WUFDMUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsSUFBQSxpQkFBTyxFQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMvRCxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixJQUFBLGlCQUFPLEVBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQy9ELFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsSUFBQSxpQkFBTyxFQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNoRTtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUNyRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDZixPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsSUFBSTtZQUNGLFNBQVMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGtDQUFrQyxFQUFFLENBQUUsZUFBZSxDQUFFLENBQUMsQ0FBQztZQUMxRixTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3hCO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3JFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNmLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxJQUFJO1lBQ0YsYUFBYSxHQUFHLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsNERBQTRELEVBQUUsQ0FBRSxVQUFVLENBQUUsQ0FBQyxDQUFDO1lBQ25ILGFBQWEsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztZQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNoQjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUN6RSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDZixPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsTUFBTSxpQkFBaUIsR0FBZ0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNqRCxLQUFLLE1BQU0sWUFBWSxJQUFJLGFBQWEsRUFBRTtZQUN4QyxJQUFJLFlBQVksQ0FBQyxVQUFVLEtBQUssSUFBSSxFQUFFO2dCQUNwQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO29CQUN6RCxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7aUJBQ3REO2FBQ0Y7U0FDRjtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLElBQUEsaUJBQU8sRUFBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsOENBQThDLENBQUMsQ0FBQztZQUM1RCxJQUFJLFFBQVEsQ0FBQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFO2dCQUMxQyxPQUFPLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUM3RDtTQUNGO1FBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLCtDQUErQyxDQUFDLENBQUM7WUFDN0QsSUFBSSxRQUFRLENBQUMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUU7Z0JBQ3pDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQzlEO1NBQ0Y7UUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0NBQStDLENBQUMsQ0FBQztZQUM3RCxJQUFJLFFBQVEsQ0FBQyxPQUFPLElBQUksUUFBUSxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7Z0JBQ3ZELE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQzlEO1NBQ0Y7UUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLEVBQUU7WUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1lBQ2hFLElBQUksUUFBUSxDQUFDLE9BQU8sSUFBSSxRQUFRLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtnQkFDdkQsT0FBTyxHQUFHLHFCQUFxQixDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDakU7U0FDRjtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7Q0FBQTtBQWpGRCx3QkFpRkM7QUFFRCxTQUFlLGVBQWUsQ0FDNUIsVUFBa0IsRUFDbEIsZ0JBQXdCLEVBQ3hCLElBQVksRUFDWixFQUFVLEVBQ1YsT0FBZSxFQUNmLElBQVksRUFDWixZQUFpQjs7UUFDakIsTUFBTSxVQUFVLEdBQVcsaUJBQWlCLENBQUM7UUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksSUFBUyxDQUFDO1FBQ2QsTUFBTSxNQUFNLEdBQVUsRUFBRSxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksT0FBWSxDQUFDO1FBQ2pCLElBQUk7WUFDRixJQUFJLEdBQUcsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDMUIsT0FBTyxHQUFHLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBdUI5QixFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ1gsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2YsT0FBTyxPQUFPLENBQUM7U0FDaEI7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxFQUFFLHVCQUF1QixDQUFDLENBQUM7WUFDekUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2YsT0FBTyxLQUFLLENBQUM7U0FDZDtJQUNILENBQUM7Q0FBQTtBQUVELFNBQWUsaUJBQWlCLENBQUMsUUFBYSxFQUFFLFNBQWMsRUFBRSxTQUFjOztRQUM1RSxNQUFNLFVBQVUsR0FBVyxtQkFBbUIsQ0FBQztRQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sVUFBVSxHQUFXLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEQsTUFBTSxJQUFJLEdBQVcsc0NBQXNDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsQ0FBQztRQUNqRixNQUFNLEVBQUUsR0FBVyxTQUFTLENBQUMsUUFBUSxDQUFDO1FBQ3RDLE1BQU0sT0FBTyxHQUFXLGNBQWMsQ0FBQztRQUN2QyxJQUFJLElBQUksR0FBVyxFQUFFLENBQUM7UUFDdEIsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDO1FBQ2pDLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLDhDQUE4QyxNQUFNLGtCQUFrQixDQUFDO1FBQ2hHLElBQUksSUFBSSw2Q0FBNkMsQ0FBQztRQUV0RCxJQUFJLFlBQWlCLENBQUM7UUFDdEIsSUFBSSxPQUFZLENBQUM7UUFDakIsSUFBSTtZQUNGLFlBQVksR0FBRyxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0QsT0FBTyxHQUFHLGVBQWUsQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztTQUM1RjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUN6RSxPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztDQUFBO0FBRUQsU0FBZSxrQkFBa0IsQ0FBQyxRQUFhLEVBQUUsU0FBYyxFQUFFLFNBQWM7O1FBQzdFLE1BQU0sVUFBVSxHQUFXLG9CQUFvQixDQUFDO1FBQ2hELE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDdkQsTUFBTSxVQUFVLEdBQVcsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNsRCxNQUFNLElBQUksR0FBVyxzQ0FBc0MsU0FBUyxDQUFDLFFBQVEsR0FBRyxDQUFDO1FBQ2pGLE1BQU0sRUFBRSxHQUFXLFNBQVMsQ0FBQyxRQUFRLENBQUM7UUFDdEMsTUFBTSxPQUFPLEdBQVcsZUFBZSxDQUFDO1FBQ3hDLElBQUksSUFBSSxHQUFXLEVBQUUsQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUM7UUFDakMsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUkseURBQXlELE1BQU0sNEJBQTRCLENBQUM7UUFDckgsSUFBSSxJQUFJLCtDQUErQyxDQUFDO1FBRXhELElBQUksWUFBaUIsQ0FBQztRQUN0QixJQUFJLE9BQVksQ0FBQztRQUNqQixJQUFJO1lBQ0YsWUFBWSxHQUFHLE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzRCxPQUFPLEdBQUcsZUFBZSxDQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQzdGO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1lBQ3pFLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0NBQUE7QUFFRCxTQUFlLGtCQUFrQixDQUFDLFFBQWEsRUFBRSxTQUFjLEVBQUUsU0FBYzs7UUFDN0UsTUFBTSxVQUFVLEdBQVcsb0JBQW9CLENBQUM7UUFDaEQsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUN2RCxNQUFNLFVBQVUsR0FBVyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2xELE1BQU0sSUFBSSxHQUFXLHNDQUFzQyxTQUFTLENBQUMsUUFBUSxHQUFHLENBQUM7UUFDakYsTUFBTSxFQUFFLEdBQVcsU0FBUyxDQUFDLFFBQVEsQ0FBQztRQUN0QyxNQUFNLE9BQU8sR0FBVyxlQUFlLENBQUM7UUFDeEMsSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFDO1FBQ3RCLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQztRQUNqQyxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSx3RUFBd0UsQ0FBQztRQUNsRyxJQUFJLElBQUksd0NBQXdDLENBQUM7UUFFakQsSUFBSSxZQUFpQixDQUFDO1FBQ3RCLElBQUksT0FBWSxDQUFDO1FBQ2pCLElBQUk7WUFDRixZQUFZLEdBQUcsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNELE9BQU8sR0FBRyxlQUFlLENBQUMsVUFBVSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDN0Y7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxFQUFFLHVCQUF1QixDQUFDLENBQUM7WUFDekUsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7Q0FBQTtBQUVELFNBQWUscUJBQXFCLENBQUMsUUFBYSxFQUFFLFNBQWMsRUFBRSxTQUFjOztRQUNoRixNQUFNLFVBQVUsR0FBVyx1QkFBdUIsQ0FBQztRQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sVUFBVSxHQUFXLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEQsTUFBTSxJQUFJLEdBQVcsc0NBQXNDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsQ0FBQztRQUNqRixNQUFNLEVBQUUsR0FBVyxTQUFTLENBQUMsUUFBUSxDQUFDO1FBQ3RDLE1BQU0sT0FBTyxHQUFXLGtCQUFrQixDQUFDO1FBQzNDLElBQUksSUFBSSxHQUFXLEVBQUUsQ0FBQztRQUN0QixJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUM7UUFDakMsSUFBSSxJQUFJLGtCQUFrQixTQUFTLENBQUMsSUFBSSw4REFBOEQsQ0FBQztRQUN2RyxJQUFJLElBQUksNENBQTRDLENBQUM7UUFFckQsSUFBSSxZQUFpQixDQUFDO1FBQ3RCLElBQUksT0FBWSxDQUFDO1FBQ2pCLElBQUk7WUFDRixZQUFZLEdBQUcsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNELE9BQU8sR0FBRyxlQUFlLENBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztTQUNoRztRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztZQUN6RSxPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztDQUFBIn0=