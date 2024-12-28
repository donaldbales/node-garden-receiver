// exchanges.ts

/* tslint:disable:no-console */

import * as bunyan from 'bunyan';
import * as changeCase from 'change-case';

import * as db from '../lib/db';
import { inspect } from '../lib/inspect';
import * as logger from '../lib/logger';

const log: any = logger.instance;

const moduleName: string = 'lib/garden_data';

const tableName: string = 'garden_data';

/*
 * SQL INSERT
 */
export async function insertOne(document: any): Promise<any> {
  const methodName: string = 'insertOne';
  log.debug({ moduleName, methodName }, `starting...`);

  const startDuration: number = Date.now();  
  log.debug({ moduleName, methodName, document });

  return new Promise((resolve, reject) => {
    
    let sqlColumnList: string = '';
    let sqlParamsList: string = '';
    const params: any[] = [];
    for (const property in document) {
      if ((property !== 'id') &&
          (property !== 'rev') &&
         !(document[property] instanceof Array)) {
        sqlColumnList += `${changeCase.snakeCase(property)}, \n`;
        sqlParamsList += `?, \n`;
        params.push(document[property]);
      }
    }
    const sql: string = `
      insert into ${tableName} (
             ${sqlColumnList.substring(0, sqlColumnList.length - 3)} )
      values (
             ${sqlParamsList.substring(0, sqlParamsList.length - 3)} )
      `;
    log.debug({ moduleName, methodName, sql });

    (async () => {
      let conn: any;
      try {
        conn = await db.connect();
        log.debug({ moduleName, methodName, conn }, `got database connection.`);
        const result: any = await db.query(conn, sql, params);
        log.debug({ moduleName, methodName, result }, `got database result.`);
        conn.release();
        log.debug({ moduleName, methodName }, `connection released.`);

        let results: any = document;
        results.id  = result.results.insertId;
        results.rev = 0;

        log.info({ moduleName, methodName, duration: `${(Date.now() - startDuration) / 1000}` });

        log.debug({ moduleName, methodName, results }, `returning results.`);
        return resolve(results);
      } catch (error) {
        log.error({ moduleName, methodName, error }, `got an error!`); 
        if (conn && conn.release) {
          conn.release();
        }
        log.debug({ moduleName, methodName, error }, `returning the error!`);
        return reject(error);
      }
    })();

  });
}
