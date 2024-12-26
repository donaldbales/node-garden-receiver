"use strict";
// emailer.ts
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-console */
const nodemailer = require("nodemailer");
const inspect_1 = require("./inspect");
const logger = require("./logger");
const log = logger.instance;
const moduleName = 'src/lib/emailer';
const emailFrom = process.env.EMAIL_FROM ?
    process.env.EMAIL_FROM : 'Secure Information Exchange (SIX) <don.bales@bounteous.com>';
const emailHost = process.env.EMAIL_HOST ?
    process.env.EMAIL_HOST : 'localhost';
const emailPassword = process.env.EMAIL_PASSWORD ?
    process.env.EMAIL_PASSWORD : '';
const emailPort = process.env.EMAIL_PORT ?
    process.env.EMAIL_PORT : '25';
const emailTo = process.env.EMAIL_TO ?
    process.env.EMAIL_TO : '';
const emailUsername = process.env.EMAIL_USERNAME ?
    process.env.EMAIL_USERNAME : '';
function send(from = emailFrom, to = emailTo, subject, text) {
    const methodName = 'send';
    log.debug({ moduleName, methodName }, 'starting...');
    return new Promise((resolve, reject) => {
        const transportOptions = {
            ignoreTLS: true
        };
        transportOptions.host = emailHost;
        if (emailUsername && emailPassword) {
            transportOptions.auth = {
                pass: emailPassword,
                user: emailUsername
            };
        }
        if (emailPort) {
            transportOptions.port = emailPort;
        }
        const transporter = nodemailer.createTransport(transportOptions);
        log.debug({ moduleName, methodName }, `transporter = ${inspect_1.inspect(transporter)}`);
        const mailOptions = {
            from,
            subject,
            text,
            to
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                const error = err;
                log.error({ moduleName, methodName, error }, 'calling sendMail');
                return reject(error);
            }
            else {
                log.debug({ moduleName, methodName, info }, 'calling sendMail');
                return resolve(info);
            }
        });
    });
}
exports.send = send;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1haWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVtYWlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGFBQWE7O0FBRWIsK0JBQStCO0FBRS9CLHlDQUF5QztBQUV6Qyx1Q0FBb0M7QUFDcEMsbUNBQW1DO0FBRW5DLE1BQU0sR0FBRyxHQUFRLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFFakMsTUFBTSxVQUFVLEdBQVcsaUJBQWlCLENBQUM7QUFFN0MsTUFBTSxTQUFTLEdBQVcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMvQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQXFCLENBQUMsQ0FBQyxDQUFDLDZEQUE2RCxDQUFDO0FBRXJHLE1BQU0sU0FBUyxHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDL0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFxQixDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFFbkQsTUFBTSxhQUFhLEdBQVcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQXlCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUU5QyxNQUFNLFNBQVMsR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBcUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBRTVDLE1BQU0sT0FBTyxHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFtQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFeEMsTUFBTSxhQUFhLEdBQVcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQXlCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUU5QyxjQUFxQixPQUFlLFNBQVMsRUFBRSxLQUFhLE9BQU8sRUFBRSxPQUFlLEVBQUUsSUFBWTtJQUNoRyxNQUFNLFVBQVUsR0FBVyxNQUFNLENBQUM7SUFDbEMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNyRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBRXJDLE1BQU0sZ0JBQWdCLEdBQVE7WUFDNUIsU0FBUyxFQUFFLElBQUk7U0FDaEIsQ0FBQztRQUVGLGdCQUFnQixDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7UUFDbEMsSUFBSSxhQUFhLElBQUksYUFBYSxFQUFFO1lBQ2xDLGdCQUFnQixDQUFDLElBQUksR0FBRztnQkFDdEIsSUFBSSxFQUFFLGFBQWE7Z0JBQ25CLElBQUksRUFBRSxhQUFhO2FBQ3BCLENBQUM7U0FDSDtRQUVELElBQUksU0FBUyxFQUFFO1lBQ2IsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztTQUNuQztRQUVELE1BQU0sV0FBVyxHQUFRLFVBQVUsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN0RSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFFLGlCQUFpQixpQkFBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUUvRSxNQUFNLFdBQVcsR0FBUTtZQUN2QixJQUFJO1lBQ0osT0FBTztZQUNQLElBQUk7WUFDSixFQUFFO1NBQ0gsQ0FBQztRQUVGLFdBQVcsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBUSxFQUFFLElBQVMsRUFBRSxFQUFFO1lBQ3hELElBQUksR0FBRyxFQUFFO2dCQUNQLE1BQU0sS0FBSyxHQUFRLEdBQUcsQ0FBQztnQkFDdkIsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFDakUsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdEI7aUJBQU07Z0JBQ0wsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFDaEUsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDdEI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTFDRCxvQkEwQ0MifQ==