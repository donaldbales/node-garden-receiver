"use strict";
// emailer.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = void 0;
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
        log.debug({ moduleName, methodName }, `transporter = ${(0, inspect_1.inspect)(transporter)}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1haWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVtYWlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGFBQWE7OztBQUViLCtCQUErQjtBQUUvQix5Q0FBeUM7QUFFekMsdUNBQW9DO0FBQ3BDLG1DQUFtQztBQUVuQyxNQUFNLEdBQUcsR0FBUSxNQUFNLENBQUMsUUFBUSxDQUFDO0FBRWpDLE1BQU0sVUFBVSxHQUFXLGlCQUFpQixDQUFDO0FBRTdDLE1BQU0sU0FBUyxHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDL0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFxQixDQUFDLENBQUMsQ0FBQyw2REFBNkQsQ0FBQztBQUVyRyxNQUFNLFNBQVMsR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBcUIsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO0FBRW5ELE1BQU0sYUFBYSxHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUF5QixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFOUMsTUFBTSxTQUFTLEdBQVcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMvQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQXFCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUU1QyxNQUFNLE9BQU8sR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBbUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBRXhDLE1BQU0sYUFBYSxHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUF5QixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFOUMsU0FBZ0IsSUFBSSxDQUFDLE9BQWUsU0FBUyxFQUFFLEtBQWEsT0FBTyxFQUFFLE9BQWUsRUFBRSxJQUFZO0lBQ2hHLE1BQU0sVUFBVSxHQUFXLE1BQU0sQ0FBQztJQUNsQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3JELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFFckMsTUFBTSxnQkFBZ0IsR0FBUTtZQUM1QixTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFDO1FBRUYsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztRQUNsQyxJQUFJLGFBQWEsSUFBSSxhQUFhLEVBQUU7WUFDbEMsZ0JBQWdCLENBQUMsSUFBSSxHQUFHO2dCQUN0QixJQUFJLEVBQUUsYUFBYTtnQkFDbkIsSUFBSSxFQUFFLGFBQWE7YUFDcEIsQ0FBQztTQUNIO1FBRUQsSUFBSSxTQUFTLEVBQUU7WUFDYixnQkFBZ0IsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1NBQ25DO1FBRUQsTUFBTSxXQUFXLEdBQVEsVUFBVSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3RFLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsaUJBQWlCLElBQUEsaUJBQU8sRUFBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFL0UsTUFBTSxXQUFXLEdBQVE7WUFDdkIsSUFBSTtZQUNKLE9BQU87WUFDUCxJQUFJO1lBQ0osRUFBRTtTQUNILENBQUM7UUFFRixXQUFXLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQVEsRUFBRSxJQUFTLEVBQUUsRUFBRTtZQUN4RCxJQUFJLEdBQUcsRUFBRTtnQkFDUCxNQUFNLEtBQUssR0FBUSxHQUFHLENBQUM7Z0JBQ3ZCLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBQ2pFLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3RCO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBQ2hFLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3RCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUExQ0Qsb0JBMENDIn0=