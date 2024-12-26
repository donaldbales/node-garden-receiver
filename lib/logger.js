"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require("bunyan");
const logLevel = process.env.LOG_LEVEL || 'info';
const levelFromName = bunyan.levelFromName;
const level = levelFromName[logLevel];
const name = 'node-garden-receiver';
exports.instance = bunyan.createLogger({ level, name, stream: process.stdout });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQWlDO0FBRWpDLE1BQU0sUUFBUSxHQUFZLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBb0IsSUFBSSxNQUFNLENBQUM7QUFDckUsTUFBTSxhQUFhLEdBQVEsTUFBTSxDQUFDLGFBQWEsQ0FBQztBQUNoRCxNQUFNLEtBQUssR0FBVyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUMsTUFBTSxJQUFJLEdBQVcsc0JBQXNCLENBQUM7QUFDL0IsUUFBQSxRQUFRLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDIn0=