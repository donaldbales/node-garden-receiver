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
        if (!pool) {
            initializePool();
        }
        let connection;
        if (pool) {
            connection = yield getConnection();
        }
        else {
            throw new Error('no connection pool');
        }
        return connection;
    });
}
exports.connect = connect;
function query(conn, sql, params = []) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMERBQTBEO0FBQzFELCtCQUErQjs7Ozs7Ozs7OztBQUUvQiwrQkFBK0I7QUFFL0IsbUNBQW1DO0FBRW5DLE1BQU0sR0FBRyxHQUFRLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFFakMsTUFBTSxVQUFVLEdBQVcsWUFBWSxDQUFDO0FBRXhDLElBQUksSUFBUyxDQUFDO0FBRWQ7SUFDRSxNQUFNLFVBQVUsR0FBVyxlQUFlLENBQUM7SUFDM0MsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNyRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3JDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFVLEVBQUUsVUFBZSxFQUFFLEVBQUU7WUFDakQsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdEI7aUJBQU07Z0JBQ0wsT0FBTyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDNUI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEOztRQUNFLE1BQU0sVUFBVSxHQUFXLFNBQVMsQ0FBQztRQUNyQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxjQUFjLEVBQUUsQ0FBQztTQUNsQjtRQUNELElBQUksVUFBZSxDQUFDO1FBQ3BCLElBQUksSUFBSSxFQUFFO1lBQ1IsVUFBVSxHQUFHLE1BQU0sYUFBYSxFQUFFLENBQUM7U0FDcEM7YUFBTTtZQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENB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