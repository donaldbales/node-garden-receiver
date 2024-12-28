import * as bunyan from 'bunyan';

const logLevel: string = (process.env.LOG_LEVEL as string) || 'debug';
const levelFromName: any = bunyan.levelFromName;
const level: number = levelFromName[logLevel]; 
const name: string = 'node-garden-receiver';
export const instance = bunyan.createLogger({ level, name, stream: process.stdout });
