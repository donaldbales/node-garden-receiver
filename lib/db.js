"use strict";
// https://www.npmjs.com/package/mysql#pooling-connections
/* tslint:disable:no-console */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
const logger = require("./logger");
const log = logger.instance;
const moduleName = 'src/lib/db';
let pool;
function getConnection() {
    const methodName = 'getConnection';
    log.debug({ moduleName, methodName }, 'starting...');
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) {
                return reject(error);
            }
            else {
                return resolve(connection);
            }
        });
    });
}
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        const methodName = 'connect';
        log.debug({ moduleName, methodName }, 'starting...');
        return new Promise((resolve, reject) => {
            if (!pool) {
                initializePool();
            }
            () => __awaiter(this, void 0, void 0, function* () {
                let connection;
                if (pool) {
                    connection = yield getConnection();
                }
                else {
                    return reject(new Error('no connection pool'));
                }
                return resolve(connection);
            });
        });
    });
}
exports.connect = connect;
function query(conn, sql, params = []) {
    return __awaiter(this, void 0, void 0, function* () {
        const methodName = 'query';
        log.debug({ moduleName, methodName }, 'starting...');
        return new Promise((resolve, reject) => {
            conn.query(sql, params, (error, results, fields) => {
                if (error) {
                    return reject({ error });
                }
                else {
                    return resolve({ results, fields });
                }
            });
        });
    });
}
exports.query = query;
function initializePool() {
    const methodName = 'initializePool';
    log.debug({ moduleName, methodName }, 'starting...');
    const connectionLimit = Number.parseInt(process.env.MYSQL_CONNECTION_LIMIT) || 30;
    const host = process.env.MYSQL_HOST || 'raspberrypi-5-mysql';
    const user = process.env.MYSQL_USER || 'don';
    const password = process.env.MYSQL_PASSWORD || 'don';
    const database = process.env.MYSQL_DATABASE || 'don';
    const timezone = 'Z';
    if (!password) {
        log.fatal({ moduleName, methodName }, 'No MySQL password specified (MYSQL_PASSWORD).');
        process.exit(1);
    }
    pool = mysql.createPool({
        connectionLimit,
        database,
        host,
        password,
        timezone,
        user
    });
    pool.on('acquire', (connection) => {
        const methodName = 'initializePoolOnAcquire';
        log.debug({ moduleName, methodName }, `Connection ${connection.threadId} acquired`);
    });
    pool.on('connection', (connection) => {
        const methodName = 'initializePoolOnConnection';
        log.debug({ moduleName, methodName }, `Connection ${connection.threadId} connected`);
    });
    pool.on('enqueue', () => {
        const methodName = 'initializePoolOnEnqueue';
        log.debug({ moduleName, methodName }, 'Waiting for available connection slot');
    });
    pool.on('release', (connection) => {
        const methodName = 'initializePoolOnRelease';
        log.debug({ moduleName, methodName }, `Connection ${connection.threadId} released`);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMERBQTBEO0FBQzFELCtCQUErQjs7Ozs7Ozs7OztBQUUvQiwrQkFBK0I7QUFFL0IsbUNBQW1DO0FBRW5DLE1BQU0sR0FBRyxHQUFRLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFFakMsTUFBTSxVQUFVLEdBQVcsWUFBWSxDQUFDO0FBRXhDLElBQUksSUFBUyxDQUFDO0FBRWQ7SUFDRSxNQUFNLFVBQVUsR0FBVyxlQUFlLENBQUM7SUFDM0MsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNyRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3JDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFVLEVBQUUsVUFBZSxFQUFFLEVBQUU7WUFDakQsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdEI7aUJBQU07Z0JBQ0wsT0FBTyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDNUI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEOztRQUNFLE1BQU0sVUFBVSxHQUFXLFNBQVMsQ0FBQztRQUNyQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3JELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDVCxjQUFjLEVBQUUsQ0FBQzthQUNsQjtZQUNELEdBQVMsRUFBRTtnQkFDVCxJQUFJLFVBQWUsQ0FBQztnQkFDcEIsSUFBSSxJQUFJLEVBQUU7b0JBQ1IsVUFBVSxHQUFHLE1BQU0sYUFBYSxFQUFFLENBQUM7aUJBQ3BDO3FCQUFNO29CQUNMLE9BQU8sTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztpQkFDaEQ7Z0JBQ0QsT0FBTyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFBLENBQUE7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQWpCRCwwQkFpQkM7QUFFRCxlQUE0QixJQUFTLEVBQUUsR0FBVyxFQUFFLFNBQWdCLEVBQUU7O1FBQ3BFLE1BQU0sVUFBVSxHQUFXLE9BQU8sQ0FBQztRQUNuQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3JELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUMsS0FBVSxFQUFFLE9BQVksRUFBRSxNQUFXLEVBQUUsRUFBRTtnQkFDaEUsSUFBSSxLQUFLLEVBQUU7b0JBQ1QsT0FBTyxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2lCQUMxQjtxQkFBTTtvQkFDTCxPQUFPLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO2lCQUNyQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFaRCxzQkFZQztBQUVEO0lBQ0UsTUFBTSxVQUFVLEdBQVcsZ0JBQWdCLENBQUM7SUFDNUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNyRCxNQUFNLGVBQWUsR0FBVyxNQUFNLENBQUMsUUFBUSxDQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQWlDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdEcsTUFBTSxJQUFJLEdBQVksT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFxQixJQUFJLHFCQUFxQixDQUFDO0lBQ2pGLE1BQU0sSUFBSSxHQUFZLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBcUIsSUFBSSxLQUFLLENBQUM7SUFDakUsTUFBTSxRQUFRLEdBQVksT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUF5QixJQUFJLEtBQUssQ0FBQztJQUN6RSxNQUFNLFFBQVEsR0FBWSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQXlCLElBQUksS0FBSyxDQUFDO0lBQ3pFLE1BQU0sUUFBUSxHQUFXLEdBQUcsQ0FBQztJQUU3QixJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ2IsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSwrQ0FBK0MsQ0FBQyxDQUFDO1FBQ3ZGLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakI7SUFFRCxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUN0QixlQUFlO1FBQ2YsUUFBUTtRQUNSLElBQUk7UUFDSixRQUFRO1FBQ1IsUUFBUTtRQUNSLElBQUk7S0FDTCxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQWUsRUFBRSxFQUFFO1FBQ3JDLE1BQU0sVUFBVSxHQUFXLHlCQUF5QixDQUFDO1FBQ3JELEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsY0FBYyxVQUFVLENBQUMsUUFBUSxXQUFXLENBQUMsQ0FBQztJQUN0RixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsVUFBZSxFQUFFLEVBQUU7UUFDeEMsTUFBTSxVQUFVLEdBQVcsNEJBQTRCLENBQUM7UUFDeEQsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxjQUFjLFVBQVUsQ0FBQyxRQUFRLFlBQVksQ0FBQyxDQUFDO0lBQ3ZGLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLE1BQU0sVUFBVSxHQUFXLHlCQUF5QixDQUFDO1FBQ3JELEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsdUNBQXVDLENBQUMsQ0FBQztJQUNqRixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsVUFBZSxFQUFFLEVBQUU7UUFDckMsTUFBTSxVQUFVLEdBQVcseUJBQXlCLENBQUM7UUFDckQsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxjQUFjLFVBQVUsQ0FBQyxRQUFRLFdBQVcsQ0FBQyxDQUFDO0lBQ3RGLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyJ9