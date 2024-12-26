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

  let conn: any;
  try {
    conn = await db.connect();
    const result: any = await db.query(conn, sql, params);
    conn.release();

    let results: any = document;
    results.id  = result.results.insertId;
    results.rev = 0;

    log.info({ moduleName, methodName, duration: `${(Date.now() - startDuration) / 1000}` });

    return results;
  } catch (error) {
    log.error({ moduleName, methodName, error }); 
    if (conn && conn.release) {
      conn.release();
    }
    return error;
  }
}
