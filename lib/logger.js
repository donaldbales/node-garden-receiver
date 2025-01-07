"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = void 0;
const bunyan = require("bunyan");
const logLevel = process.env.LOG_LEVEL || 'info';
const levelFromName = bunyan.levelFromName;
const level = levelFromName[logLevel];
const name = 'node-garden-receiver';
exports.instance = bunyan.createLogger({ level, name, stream: process.stdout });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUFpQztBQUVqQyxNQUFNLFFBQVEsR0FBWSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQW9CLElBQUksTUFBTSxDQUFDO0FBQ3JFLE1BQU0sYUFBYSxHQUFRLE1BQU0sQ0FBQyxhQUFhLENBQUM7QUFDaEQsTUFBTSxLQUFLLEdBQVcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sSUFBSSxHQUFXLHNCQUFzQixDQUFDO0FBQy9CLFFBQUEsUUFBUSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyJ9