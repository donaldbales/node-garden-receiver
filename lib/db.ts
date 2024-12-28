// https://www.npmjs.com/package/mysql#pooling-connections
/* tslint:disable:no-console */

import * as mysql from 'mysql';

import * as logger from './logger';

const log: any = logger.instance;

const moduleName: string = 'src/lib/db';

let pool: any;

function getConnection(): Promise<any> {
  const methodName: string = 'getConnection';
  log.debug({ moduleName, methodName }, 'starting...');
  return new Promise((resolve, reject) => {
    pool.getConnection((error: any, connection: any) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(connection);
      }
    });
  });
}

export async function connect(): Promise<any> {
  const methodName: string = 'connect';
  log.debug({ moduleName, methodName }, 'starting...');
  return new Promise((resolve, reject) => {
    if (!pool) {
      initializePool();
    }
    async () => {
      let connection: any;
      if (pool) {
        connection = await getConnection();
      } else {
        return reject(new Error('no connection pool'));
      }
      return resolve(connection);
    }
  });
}

export async function query(conn: any, sql: string, params: any[] = []): Promise<any> {
  const methodName: string = 'query';
  log.debug({ moduleName, methodName }, 'starting...');
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (error: any, results: any, fields: any) => {
      if (error) {
        return reject({ error });
      } else {
        return resolve({ results, fields });
      }
    });
  });
}

function initializePool() {
  const methodName: string = 'initializePool';
  log.debug({ moduleName, methodName }, 'starting...');
  const connectionLimit: number = Number.parseInt((process.env.MYSQL_CONNECTION_LIMIT as string)) || 30;
  const host: string = (process.env.MYSQL_HOST as string) || 'raspberrypi-5-mysql';
  const user: string = (process.env.MYSQL_USER as string) || 'don';
  const password: string = (process.env.MYSQL_PASSWORD as string) || 'don';
  const database: string = (process.env.MYSQL_DATABASE as string) || 'don';
  const timezone: string = 'Z';
  
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

  pool.on('acquire', (connection: any) => {
    const methodName: string = 'initializePoolOnAcquire';
    log.debug({ moduleName, methodName }, `Connection ${connection.threadId} acquired`);
  });

  pool.on('connection', (connection: any) => {
    const methodName: string = 'initializePoolOnConnection';
    log.debug({ moduleName, methodName }, `Connection ${connection.threadId} connected`);
  });

  pool.on('enqueue', () => {
    const methodName: string = 'initializePoolOnEnqueue';
    log.debug({ moduleName, methodName }, 'Waiting for available connection slot');
  });

  pool.on('release', (connection: any) => {
    const methodName: string = 'initializePoolOnRelease';
    log.debug({ moduleName, methodName }, `Connection ${connection.threadId} released`);
  });
}
