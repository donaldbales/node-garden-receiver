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
        let conn;
        try {
            conn = yield db.connect();
            const result = yield db.query(conn, sql, params);
            conn.release();
            let results = document;
            results.id = result.results.insertId;
            results.rev = 0;
            log.info({ moduleName, methodName, duration: `${(Date.now() - startDuration) / 1000}` });
            return results;
        }
        catch (error) {
            log.error({ moduleName, methodName, error });
            if (conn && conn.release) {
                conn.release();
            }
            return error;
        }
    });
}
exports.insertOne = insertOne;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FyZGVuX2RhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnYXJkZW5fZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsZUFBZTs7Ozs7Ozs7OztBQUtmLDBDQUEwQztBQUUxQyxnQ0FBZ0M7QUFFaEMsd0NBQXdDO0FBRXhDLE1BQU0sR0FBRyxHQUFRLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFFakMsTUFBTSxVQUFVLEdBQVcsaUJBQWlCLENBQUM7QUFFN0MsTUFBTSxTQUFTLEdBQVcsYUFBYSxDQUFDO0FBRXhDOztHQUVHO0FBQ0gsbUJBQWdDLFFBQWE7O1FBQzNDLE1BQU0sVUFBVSxHQUFXLFdBQVcsQ0FBQztRQUN2QyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBRXJELE1BQU0sYUFBYSxHQUFXLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN6QyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRWhELElBQUksYUFBYSxHQUFXLEVBQUUsQ0FBQztRQUMvQixJQUFJLGFBQWEsR0FBVyxFQUFFLENBQUM7UUFDL0IsTUFBTSxNQUFNLEdBQVUsRUFBRSxDQUFDO1FBQ3pCLEtBQUssTUFBTSxRQUFRLElBQUksUUFBUSxFQUFFO1lBQy9CLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDO2dCQUNuQixDQUFDLFFBQVEsS0FBSyxLQUFLLENBQUM7Z0JBQ3JCLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksS0FBSyxDQUFDLEVBQUU7Z0JBQ3pDLGFBQWEsSUFBSSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDekQsYUFBYSxJQUFJLE9BQU8sQ0FBQztnQkFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzthQUNqQztTQUNGO1FBQ0QsTUFBTSxHQUFHLEdBQVc7a0JBQ0osU0FBUzthQUNkLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOzthQUVwRCxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztLQUM1RCxDQUFDO1FBQ0osR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUUzQyxJQUFJLElBQVMsQ0FBQztRQUNkLElBQUk7WUFDRixJQUFJLEdBQUcsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDMUIsTUFBTSxNQUFNLEdBQVEsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRWYsSUFBSSxPQUFPLEdBQVEsUUFBUSxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxFQUFFLEdBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDdEMsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFFaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsYUFBYSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRXpGLE9BQU8sT0FBTyxDQUFDO1NBQ2hCO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQzdDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUNoQjtZQUNELE9BQU8sS0FBSyxDQUFDO1NBQ2Q7SUFDSCxDQUFDO0NBQUE7QUEvQ0QsOEJBK0NDIn0=