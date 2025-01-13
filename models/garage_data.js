"use strict";
// garage_data.ts
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
exports.insertOne = void 0;
const changeCase = require("change-case");
const db = require("../lib/db");
const logger = require("../lib/logger");
const log = logger.instance;
const moduleName = 'models/garage_data';
const tableName = 'garage_data';
/*
 * SQL INSERT
 */
function insertOne(document) {
    return __awaiter(this, void 0, void 0, function* () {
        const methodName = 'insertOne';
        log.debug({ moduleName, methodName }, `starting...`);
        const startDuration = Date.now();
        log.debug({ moduleName, methodName, document });
        return new Promise((resolve, reject) => {
            let sqlColumnList = '';
            let sqlParamsList = '';
            const params = [];
            for (const property in document) {
                if ((property !== 'id') &&
                    (property !== 'rev') &&
                    !(document[property] instanceof Array)) {
                    sqlColumnList += `${changeCase.snakeCase(property)}, \n`;
                    sqlParamsList += `?, \n`;
                    params.push(document[property]);
                }
            }
            const sql = `
      insert into ${tableName} (
             ${sqlColumnList.substring(0, sqlColumnList.length - 3)} )
      values (
             ${sqlParamsList.substring(0, sqlParamsList.length - 3)} )
      `;
            log.debug({ moduleName, methodName, sql });
            (() => __awaiter(this, void 0, void 0, function* () {
                let conn;
                try {
                    conn = yield db.connect();
                    log.debug({ moduleName, methodName, conn }, `got database connection.`);
                    const result = yield db.query(conn, sql, params);
                    log.debug({ moduleName, methodName, result }, `got database result.`);
                    conn.release();
                    log.debug({ moduleName, methodName }, `connection released.`);
                    let results = document;
                    results.id = result.results.insertId;
                    results.rev = 0;
                    log.info({ moduleName, methodName, duration: `${(Date.now() - startDuration) / 1000}` });
                    log.debug({ moduleName, methodName, results }, `returning results.`);
                    return resolve(results);
                }
                catch (error) {
                    log.error({ moduleName, methodName, error }, `got an error!`);
                    if (conn && conn.release) {
                        conn.release();
                    }
                    log.debug({ moduleName, methodName, error }, `returning the error!`);
                    return reject(error);
                }
            }))();
        });
    });
}
exports.insertOne = insertOne;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FyYWdlX2RhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnYXJhZ2VfZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUJBQWlCOzs7Ozs7Ozs7Ozs7QUFLakIsMENBQTBDO0FBRTFDLGdDQUFnQztBQUVoQyx3Q0FBd0M7QUFFeEMsTUFBTSxHQUFHLEdBQVEsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUVqQyxNQUFNLFVBQVUsR0FBVyxvQkFBb0IsQ0FBQztBQUVoRCxNQUFNLFNBQVMsR0FBVyxhQUFhLENBQUM7QUFFeEM7O0dBRUc7QUFDSCxTQUFzQixTQUFTLENBQUMsUUFBYTs7UUFDM0MsTUFBTSxVQUFVLEdBQVcsV0FBVyxDQUFDO1FBQ3ZDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFFckQsTUFBTSxhQUFhLEdBQVcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3pDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFFaEQsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUVyQyxJQUFJLGFBQWEsR0FBVyxFQUFFLENBQUM7WUFDL0IsSUFBSSxhQUFhLEdBQVcsRUFBRSxDQUFDO1lBQy9CLE1BQU0sTUFBTSxHQUFVLEVBQUUsQ0FBQztZQUN6QixLQUFLLE1BQU0sUUFBUSxJQUFJLFFBQVEsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUM7b0JBQ25CLENBQUMsUUFBUSxLQUFLLEtBQUssQ0FBQztvQkFDckIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxLQUFLLENBQUMsRUFBRTtvQkFDekMsYUFBYSxJQUFJLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxD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