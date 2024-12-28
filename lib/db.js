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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMERBQTBEO0FBQzFELCtCQUErQjs7Ozs7Ozs7OztBQUUvQiwrQkFBK0I7QUFFL0IsbUNBQW1DO0FBRW5DLE1BQU0sR0FBRyxHQUFRLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFFakMsTUFBTSxVQUFVLEdBQVcsWUFBWSxDQUFDO0FBRXhDLElBQUksSUFBUyxDQUFDO0FBRWQ7SUFDRSxNQUFNLFVBQVUsR0FBVyxlQUFlLENBQUM7SUFDM0MsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNyRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3JDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFVLEVBQUUsVUFBZSxFQUFFLEVBQUU7WUFDakQsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztnQkFDNUUsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdEI7aUJBQU07Z0JBQ0wsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO2dCQUN2RSxPQUFPLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUM1QjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQ7O1FBQ0UsTUFBTSxVQUFVLEdBQVcsU0FBUyxDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDckQsT0FBTyxJQUFJ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