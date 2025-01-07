"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZnVjYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9ic2Z1Y2F0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWlDO0FBR2pDLG1DQUFtQztBQUVuQyxNQUFNLEdBQUcsR0FBUSxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ2pDLE1BQU0sU0FBUyxHQUFXLGFBQWEsQ0FBQztBQUV4QyxTQUFnQixPQUFPLENBQUMsSUFBWTtJQUNsQyxNQUFNLFFBQVEsR0FBVyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELCtEQUErRDtJQUUvRCxNQUFNLEVBQUUsR0FBVyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLG1EQUFtRDtJQUVuRCxNQUFNLEdBQUcsR0FBUSxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDekQsOENBQThDO0lBRTlDLE1BQU0sTUFBTSxHQUFRLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM5RCxvREFBb0Q7SUFFcEQsSUFBSSxTQUFTLEdBQVcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzNELFNBQVMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLDBEQUEwRDtJQUUxRCxPQUFPLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxTQUFTLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO0FBQ3hFLENBQUM7QUFsQkQsMEJBa0JDO0FBRUQsU0FBZ0IsT0FBTyxDQUFDLFNBQWlCO0lBQ3ZDLE1BQU0sUUFBUSxHQUFXLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDcEUsK0RBQStEO0lBRS9ELE1BQU0sRUFBRSxHQUFXLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVELG1EQUFtRDtJQUVuRCxNQUFNLElBQUksR0FBVyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLHVDQUF1QztJQUV2QyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDcEQsOENBQThDO0lBRTlDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzdELHdEQUF3RDtJQUV4RCxJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckQsU0FBUyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsaURBQWlEO0lBRWpELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFyQkQsMEJBcUJDO0FBQ0Q7Ozs7Ozs7Ozs7O0VBV0UifQ==