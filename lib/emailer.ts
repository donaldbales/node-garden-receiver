// emailer.ts

/* tslint:disable:no-console */

import * as nodemailer from 'nodemailer';

import { inspect } from './inspect';
import * as logger from './logger';

const log: any = logger.instance;

const moduleName: string = 'src/lib/emailer';

const emailFrom: string = process.env.EMAIL_FROM ?
  (process.env.EMAIL_FROM as string) : 'Secure Information Exchange (SIX) <don.bales@bounteous.com>';

const emailHost: string = process.env.EMAIL_HOST ?
  (process.env.EMAIL_HOST as string) : 'localhost';

const emailPassword: string = process.env.EMAIL_PASSWORD ?
  (process.env.EMAIL_PASSWORD as string) : '';

const emailPort: string = process.env.EMAIL_PORT ?
  (process.env.EMAIL_PORT as string) : '25';

const emailTo: string = process.env.EMAIL_TO ?
  (process.env.EMAIL_TO as string) : '';

const emailUsername: string = process.env.EMAIL_USERNAME ?
  (process.env.EMAIL_USERNAME as string) : '';

export function send(from: string = emailFrom, to: string = emailTo, subject: string, text: string): Promise<any> {
  const methodName: string = 'send';
  log.debug({ moduleName, methodName }, 'starting...');
  return new Promise((resolve, reject) => {
    
    const transportOptions: any = {
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

    const transporter: any = nodemailer.createTransport(transportOptions);
    log.debug({ moduleName, methodName }, `transporter = ${inspect(transporter)}`);

    const mailOptions: any = {
      from,
      subject,
      text,
      to
    };

    transporter.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        const error: any = err;
        log.error({ moduleName, methodName, error }, 'calling sendMail');
        return reject(error);
      } else {
        log.debug({ moduleName, methodName, info }, 'calling sendMail');
        return resolve(info);
      }
    });
  });
}
