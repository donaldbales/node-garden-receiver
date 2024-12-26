import * as crypto from 'crypto';

import { inspect } from './inspect';
import * as logger from './logger';

const log: any = logger.instance;
const algorithm: string = 'aes-128-cbc';

export function encrypt(data: string): string {
  const password: Buffer = crypto.randomBytes(16);
  // console.log('encrypt password=' + password.toString('hex'));

  const iv: Buffer = crypto.randomBytes(16);
  // console.log('encrypt iv=' + iv.toString('hex'));

  const key: any = crypto.scryptSync(password, 'salt', 16);
  // console.log('encrypt key=' + inspect(key));

  const cipher: any = crypto.createCipheriv(algorithm, key, iv);
  // console.log('encrypt cipher=' + inspect(cipher));

  let encrypted: string = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // console.log('encrypt encrypted=' + inspect(encrypted));

  return `${password.toString('hex')}${encrypted}${iv.toString('hex')}`;
}

export function decrypt(encrypted: string): string { 
  const password: Buffer = Buffer.from(encrypted.slice(0, 32), 'hex');
  // console.log('decrypt password=' + password.toString('hex'));

  const iv: Buffer = Buffer.from(encrypted.slice(-32), 'hex');
  // console.log('decrypt iv=' + iv.toString('hex'));

  const data: string = encrypted.slice(32, -32);
  // console.log('decrypt data=' + data);

  const key = crypto.scryptSync(password, 'salt', 16);
  // console.log('decrypt key=' + inspect(key));

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  // console.log('decrypt decipher=' + inspect(decipher));

  let decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  // console.log('decrypt decrypted=' + decrypted);

  return decrypted;
}
/*
export function test() {
  const data: string = 'My secret!';
  console.log('test data=' + data);
  const encrypted = encrypt(data);
  console.log('test encrypted=' + encrypted);
  const decrypted = decrypt(encrypted);
  console.log('test decrypted=' + decrypted);
}

test();
*/
