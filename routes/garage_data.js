"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("../models/garage_data");
const logger = require("../lib/logger");
const express = require("express");
const log = logger.instance;
const moduleName = 'routes/garage_data';
const router = express.Router();
router.post('/garage_data', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const methodName = 'router.post';
        log.debug({ moduleName, methodName }, `starting...`);
        const startDuration = Date.now();
        const contentType = req.get('Content-Type') || 'application/x-www-form-urlencoded';
        if (contentType === 'application/json') {
            const document = req.body;
            try {
                const results = yield db.insertOne(document);
                log.info({ module: __filename, method: 'router.post',
                    sent: 'POST /garage_data', results,
                    duration: `${(Date.now() - startDuration) / 1000}` });
                res.status(201).json(results);
                return;
            }
            catch (error) {
                if (error &&
                    error.error &&
                    error.error.code &&
                    error.error.code === 'ER_DUP_ENTRY') {
                    log.info({ module: __filename, method: 'router.post',
                        sent: 'POST /garage_data', results: '',
                        duration: `${(Date.now() - startDuration) / 1000}` });
                    res.status(422).json(error);
                }
                else {
                    log.error({ module: __filename, method: 'router.post',
                        sent: 'POST /garage_data', error,
                        duration: `${(Date.now() - startDuration) / 1000}` });
                    res.status(500).json(error);
                }
                return;
            }
        }
        else {
            res.status(404).send(' ');
            return next();
        }
    });
});
module.exports = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FyYWdlX2RhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnYXJhZ2VfZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLDRDQUE0QztBQUM1Qyx3Q0FBd0M7QUFDeEMsbUNBQW1DO0FBRW5DLE1BQU0sR0FBRyxHQUFRLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFFakMsTUFBTSxVQUFVLEdBQVcsb0JBQW9CLENBQUM7QUFFaEQsTUFBTSxNQUFNLEdBQVcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRXhDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFVBQWUsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7UUFDdEYsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDO1FBQ2pDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDckQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2pDLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksbUNBQW1DLENBQUM7UUFDbkYsSUFBSSxXQUFXLEtBQUssa0JBQWtCLEVBQUU7WUFDcEMsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUMxQixJQUFJO2dCQUNBLE1BQU0sT0FBTyxHQUFRLE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDbEQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGFBQWE7b0JBQ2hELElBQUksRUFBRSxtQkFBbUIsRUFBRSxPQUFPO29CQUNsQyxRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxhQUFhLENBQUMsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzFELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM5QixPQUFPO2FBQ1Y7WUFDRCxPQUFPLEtBQUssRUFBRTtnQkFDVixJQUFJLEtBQUs7b0JBQ0wsS0FBSyxDQUFDLEtBQUs7b0JBQ1gsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJO29CQUNoQixLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxjQUFjLEVBQUU7b0JBQ3JDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxhQUFhO3dCQUNoRCxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsT0FBTyxFQUFFLEVBQUU7d0JBQ3RDLFFBQVEsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLGFBQWEsQ0FBQyxHQUFHLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDMUQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQy9CO3FCQUNJO29CQUNELEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxhQUFhO3dCQUNqRCxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsS0FBSzt3QkFDaEMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsYUFBYSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUMxRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDL0I7Z0JBQ0QsT0FBTzthQUNWO1NBQ0o7YUFDSTtZQUNELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFCLE9BQU8sSUFBSSxFQUFFLENBQUM7U0FDakI7SUFDTCxDQUFDO0NBQUEsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMifQ==