"use strict";
// exchanges.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const changeCase = require("change-case");
const db = require("../lib/db");
const logger = require("../lib/logger");
const log = logger.instance;
const moduleName = 'lib/garden_data';
const tableName = 'garden_data';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FyZGVuX2RhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnYXJkZW5fZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsZUFBZTs7Ozs7Ozs7OztBQUtmLDBDQUEwQztBQUUxQyxnQ0FBZ0M7QUFFaEMsd0NBQXdDO0FBRXhDLE1BQU0sR0FBRyxHQUFRLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFFakMsTUFBTSxVQUFVLEdBQVcsaUJBQWlCLENBQUM7QUFFN0MsTUFBTSxTQUFTLEdBQVcsYUFBYSxDQUFDO0FBRXhDOztHQUVHO0FBQ0gsbUJBQWdDLFFBQWE7O1FBQzNDLE1BQU0sVUFBVSxHQUFXLFdBQVcsQ0FBQztRQUN2QyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBRXJELE1BQU0sYUFBYSxHQUFXLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN6QyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRWhELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFFckMsSUFBSSxhQUFhLEdBQVcsRUFBRSxDQUFDO1lBQy9CLElBQUksYUFBYSxHQUFXLEVBQUUsQ0FBQztZQUMvQixNQUFNLE1BQU0sR0FBVSxFQUFFLENBQUM7WUFDekIsS0FBSyxNQUFNLFFBQVEsSUFBSSxRQUFRLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDO29CQUNuQixDQUFDLFFBQVEsS0FBSyxLQUFLLENBQUM7b0JBQ3JCLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksS0FBSyxDQUFDLEVBQUU7b0JBQ3pDLGFBQWEsSUFBSSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztvQkFDekQsYUFB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