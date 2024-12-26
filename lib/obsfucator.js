"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const logger = require("./logger");
const log = logger.instance;
const algorithm = 'aes-128-cbc';
function encrypt(data) {
    const password = crypto.randomBytes(16);
    // console.log('encrypt password=' + password.toString('hex'));
    const iv = crypto.randomBytes(16);
    // console.log('encrypt iv=' + iv.toString('hex'));
    const key = crypto.scryptSync(password, 'salt', 16);
    // console.log('encrypt key=' + inspect(key));
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    // console.log('encrypt cipher=' + inspect(cipher));
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // console.log('encrypt encrypted=' + inspect(encrypted));
    return `${password.toString('hex')}${encrypted}${iv.toString('hex')}`;
}
exports.encrypt = encrypt;
function decrypt(encrypted) {
    const password = Buffer.from(encrypted.slice(0, 32), 'hex');
    // console.log('decrypt password=' + password.toString('hex'));
    const iv = Buffer.from(encrypted.slice(-32), 'hex');
    // console.log('decrypt iv=' + iv.toString('hex'));
    const data = encrypted.slice(32, -32);
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
exports.decrypt = decrypt;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZnVjYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9ic2Z1Y2F0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFHakMsbUNBQW1DO0FBRW5DLE1BQU0sR0FBRyxHQUFRLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDakMsTUFBTSxTQUFTLEdBQVcsYUFBYSxDQUFDO0FBRXhDLGlCQUF3QixJQUFZO0lBQ2xDLE1BQU0sUUFBUSxHQUFXLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEQsK0RBQStEO0lBRS9ELE1BQU0sRUFBRSxHQUFXLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDMUMsbURBQW1EO0lBRW5ELE1BQU0sR0FBRyxHQUFRLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN6RCw4Q0FBOEM7SUFFOUMsTUFBTSxNQUFNLEdBQVEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzlELG9EQUFvRDtJQUVwRCxJQUFJLFNBQVMsR0FBVyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDM0QsU0FBUyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsMERBQTBEO0lBRTFELE9BQU8sR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLFNBQVMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7QUFDeEUsQ0FBQztBQWxCRCwwQkFrQkM7QUFFRCxpQkFBd0IsU0FBaUI7SUFDdkMsTUFBTSxRQUFRLEdBQVcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNwRSwrREFBK0Q7SUFFL0QsTUFBTSxFQUFFLEdBQVcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDNUQsbURBQW1EO0lBRW5ELE1BQU0sSUFBSSxHQUFXLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDOUMsdUNBQXVDO0lBRXZDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNwRCw4Q0FBOEM7SUFFOUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDN0Qsd0RBQXdEO0lBRXhELElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNyRCxTQUFTLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxpREFBaUQ7SUFFakQsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQXJCRCwwQkFxQkM7QUFDRDs7Ozs7Ozs7Ozs7RUFXRSJ9