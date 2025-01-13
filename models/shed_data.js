"use strict";
// shed_data.ts
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
const moduleName = 'models/shed_data';
const tableName = 'shed_data';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZF9kYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2hlZF9kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxlQUFlOzs7Ozs7Ozs7Ozs7QUFLZiwwQ0FBMEM7QUFFMUMsZ0NBQWdDO0FBRWhDLHdDQUF3QztBQUV4QyxNQUFNLEdBQUcsR0FBUSxNQUFNLENBQUMsUUFBUSxDQUFDO0FBRWpDLE1BQU0sVUFBVSxHQUFXLGtCQUFrQixDQUFDO0FBRTlDLE1BQU0sU0FBUyxHQUFXLFdBQVcsQ0FBQztBQUV0Qzs7R0FFRztBQUNILFNBQXNCLFNBQVMsQ0FBQyxRQUFhOztRQUMzQyxNQUFNLFVBQVUsR0FBVyxXQUFXLENBQUM7UUFDdkMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUVyRCxNQUFNLGFBQWEsR0FBVyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDekMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUVoRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBRXJDLElBQUksYUFBYSxHQUFXLEVBQUUsQ0FBQztZQUMvQixJQUFJLGFBQWEsR0FBVyxFQUFFLENBQUM7WUFDL0IsTUFBTSxNQUFNLEdBQVUsRUFBRSxDQUFDO1lBQ3pCLEtBQUssTUFBTSxRQUFRLElBQUksUUFBUSxFQUFFO2dCQUMvQixJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQztvQkFDbkIsQ0FBQyxRQUFRLEtBQUssS0FBSyxDQUFDO29CQUNyQixDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEtBQUssQ0FBQyxFQUFFO29CQUN6QyxhQUFhLElBQUksR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7b0JBQ3pELGFBQWEsSUFBSSxPQUFPLENBQUM7b0JBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7aUJBQ2pDO2FBQ0Y7WUFDRCxNQUFNLEdBQUcsR0FBVztvQkFDSixTQUFTO2VBQ2QsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7O2VBRXBELGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO09BQzVELENBQUM7WUFDSixHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRTNDLENBQUMsR0FBUyxFQUFFO2dCQUNWLElBQUksSUFBUyxDQUFDO2dCQUNkLElBQUk7b0JBQ0YsSUFBSSxHQUFHLE1BQU0sRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUMxQixHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO29CQUN4RSxNQUFNLE1BQU0sR0FBUSxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDdEQsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztvQkFDdEUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNmLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztvQkFFOUQsSUFBSSxPQUFPLEdBQVEsUUFBUSxDQUFDO29CQUM1QixPQUFPLENBQUMsRUFBRSxHQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO29CQUN0QyxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFFaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsYUFBYSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUV6RixHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO29CQUNyRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDekI7Z0JBQUMsT0FBTyxLQUFLLEVBQUU7b0JBQ2QsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEVBQUUsZUFBZSxDQUFDLENBQUM7b0JBQzlELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7d0JBQ3hCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztxQkFDaEI7b0JBQ0QsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztvQkFDckUsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3RCO1lBQ0gsQ0FBQyxDQUFBLENBQUMsRUFBRSxDQUFDO1FBRVAsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQUE7QUExREQsOEJBMERDIn0=