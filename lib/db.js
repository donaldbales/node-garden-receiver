"use strict";
// https://www.npmjs.com/package/mysql#pooling-connections
/* tslint:disable:no-console */
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
exports.query = exports.connect = void 0;
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
                log.debug({ moduleName, methodName, error }, 'error getting a connection!');
                return reject(error);
            }
            else {
                log.debug({ moduleName, methodName }, 'success getting a connection.');
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
            (() => __awaiter(this, void 0, void 0, function* () {
                let connection;
                if (pool) {
                    try {
                        connection = yield getConnection();
                        log.debug({ moduleName, methodName, connection }, 'after getting connection.');
                    }
                    catch (error) {
                        log.error({ moduleName, methodName, error }, 'after getting connection.');
                        return reject(error);
                    }
                }
                else {
                    log.debug({ moduleName, methodName }, 'no connection pool!');
                    return reject(new Error('no connection pool'));
                }
                return resolve(connection);
            }))();
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
                    log.debug({ moduleName, methodName, error }, 'error when querying the database!');
                    return reject({ error });
                }
                else {
                    log.debug({ moduleName, methodName, results, fields }, 'success when querying the database.');
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
    const connectionLimit = Number.parseInt(process.env.MYSQL_CONNECTION_LIMIT) || 3;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMERBQTBEO0FBQzFELCtCQUErQjs7Ozs7Ozs7Ozs7O0FBRS9CLCtCQUErQjtBQUUvQixtQ0FBbUM7QUFFbkMsTUFBTSxHQUFHLEdBQVEsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUVqQyxNQUFNLFVBQVUsR0FBVyxZQUFZLENBQUM7QUFFeEMsSUFBSSxJQUFTLENBQUM7QUFFZCxTQUFTLGFBQWE7SUFDcEIsTUFBTSxVQUFVLEdBQVcsZUFBZSxDQUFDO0lBQzNDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDckQsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBVSxFQUFFLFVBQWUsRUFBRSxFQUFFO1lBQ2pELElBQUksS0FBSyxFQUFFO2dCQUNULEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxFQUFFLDZCQUE2QixDQUFDLENBQUM7Z0JBQzVFLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3RCO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsK0JBQStCLENBQUMsQ0FBQztnQkFDdkUsT0FBTyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDNUI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELFNBQXNCLE9BQU87O1FBQzNCLE1BQU0sVUFBVSxHQUFXLFNBQVMsQ0FBQztRQUNyQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3JELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDVCxjQUFjLEVBQUUsQ0FBQzthQUNsQjtZQUNELENBQUMsR0FBUyxFQUFFO2dCQUNWLElBQUksVUFBZSxDQUFDO2dCQUNwQixJQUFJLElBQUksRUFBRTtvQkFDUixJQUFJO3dCQUNGLFVBQVUsR0FBRyxNQUFNLGFBQWEsRUFBRSxDQUFDO3dCQUNuQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO3FCQUNoRjtvQkFDRCxPQUFPLEtBQUssRUFBRTt3QkFDWixHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO3dCQUMxRSxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDdEI7aUJBQ0Y7cUJBQU07b0JBQ0wsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO29CQUM3RCxPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7aUJBQ2hEO2dCQUNELE9BQU8sT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQSxDQUFDLEVBQUUsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBekJELDBCQXlCQztBQUVELFNBQXNCLEtBQUssQ0FBQyxJQUFTLEVBQUUsR0FBVyxFQUFFLFNBQWdCLEVBQUU7O1FBQ3BFLE1BQU0sVUFBVSxHQUFXLE9BQU8sQ0FBQztRQUNuQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3JELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUMsS0FBVSxFQUFFLE9BQVksRUFBRSxNQUFXLEVBQUUsRUFBRTtnQkFDaEUsSUFBSSxLQUFLLEVBQUU7b0JBQ1QsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEVBQUUsbUNBQW1DLENBQUMsQ0FBQztvQkFDbEYsT0FBTyxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2lCQUMxQjtxQkFBTTtvQkFDTCxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUscUNBQXFDLENBQUMsQ0FBQztvQkFDOUYsT0FBTyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztpQkFDckM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBZEQsc0JBY0M7QUFFRCxTQUFTLGNBQWM7SUFDckIsTUFBTSxVQUFVLEdBQVcsZ0JBQWdCLENBQUM7SUFDNUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNyRCxNQUFNLGVBQWUsR0FBVyxNQUFNLENBQUMsUUFBUSxDQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQWlDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckcsTUFBTSxJQUFJLEdBQVksT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFxQixJQUFJLHFCQUFxQixDQUFDO0lBQ2pGLE1BQU0sSUFBSSxHQUFZLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBcUIsSUFBSSxLQUFLLENBQUM7SUFDakUsTUFBTSxRQUFRLEdBQVksT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUF5QixJQUFJLEtBQUssQ0FBQztJQUN6RSxNQUFNLFFBQVEsR0FBWSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQXlCLElBQUksS0FBSyxDQUFDO0lBQ3pFLE1BQU0sUUFBUSxHQUFXLEdBQUcsQ0FBQztJQUU3QixJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ2IsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSwrQ0FBK0MsQ0FBQyxDQUFDO1FBQ3ZGLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakI7SUFFRCxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUN0QixlQUFlO1FBQ2YsUUFBUTtRQUNSLElBQUk7UUFDSixRQUFRO1FBQ1IsUUFBUTtRQUNSLElBQUk7S0FDTCxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQWUsRUFBRSxFQUFFO1FBQ3JDLE1BQU0sVUFBVSxHQUFXLHlCQUF5QixDQUFDO1FBQ3JELEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsY0FBYyxVQUFVLENBQUMsUUFBUSxXQUFXLENBQUMsQ0FBQztJQUN0RixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsVUFBZSxFQUFFLEVBQUU7UUFDeEMsTUFBTSxVQUFVLEdBQVcsNEJBQTRCLENBQUM7UUFDeEQsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxjQUFjLFVBQVUsQ0FBQyxRQUFRLFlBQVksQ0FBQyxDQUFDO0lBQ3ZGLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLE1BQU0sVUFBVSxHQUFXLHlCQUF5QixDQUFDO1FBQ3JELEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsdUNBQXVDLENBQUMsQ0FBQztJQUNqRixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsVUFBZSxFQUFFLEVBQUU7UUFDckMsTUFBTSxVQUFVLEdBQVcseUJBQXlCLENBQUM7UUFDckQsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxjQUFjLFVBQVUsQ0FBQyxRQUFRLFdBQVcsQ0FBQyxDQUFDO0lBQ3RGLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyJ9