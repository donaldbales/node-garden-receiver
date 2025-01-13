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
const db = require("../models/shed_data");
const logger = require("../lib/logger");
const express = require("express");
const log = logger.instance;
const moduleName = 'routes/shed_data';
const router = express.Router();
router.post('/shed_data', function (req, res, next) {
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
                    sent: 'POST /shed_data', results,
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
                        sent: 'POST /shed_data', results: '',
                        duration: `${(Date.now() - startDuration) / 1000}` });
                    res.status(422).json(error);
                }
                else {
                    log.error({ module: __filename, method: 'router.post',
                        sent: 'POST /shed_data', error,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlZF9kYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2hlZF9kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUEsMENBQTBDO0FBQzFDLHdDQUF3QztBQUN4QyxtQ0FBbUM7QUFFbkMsTUFBTSxHQUFHLEdBQVEsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUVqQyxNQUFNLFVBQVUsR0FBVyxrQkFBa0IsQ0FBQztBQUU5QyxNQUFNLE1BQU0sR0FBVyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBZSxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUNwRixNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUM7UUFDakMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNyRCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDakMsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxtQ0FBbUMsQ0FBQztRQUNuRixJQUFJLFdBQVcsS0FBSyxrQkFBa0IsRUFBRTtZQUNwQyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQzFCLElBQUk7Z0JBQ0EsTUFBTSxPQUFPLEdBQVEsTUFBTSxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNsRCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsYUFBYTtvQkFDaEQsSUFBSSxFQUFFLGlCQUFpQixFQUFFLE9BQU87b0JBQ2hDLFFBQVEsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLGFBQWEsQ0FBQyxHQUFHLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDMUQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzlCLE9BQU87YUFDVjtZQUNELE9BQU8sS0FBSyxFQUFFO2dCQUNWLElBQUksS0FBSztvQkFDTCxLQUFLLENBQUMsS0FBSztvQkFDWCxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUk7b0JBQ2hCLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLGNBQWMsRUFBRTtvQkFDckMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGFBQWE7d0JBQ2hELElBQUksRUFBRSxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsRUFBRTt3QkFDcEMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsYUFBYSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUMxRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDL0I7cUJBQ0k7b0JBQ0QsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGFBQWE7d0JBQ2pELElBQUksRUFBRSxpQkFBaUIsRUFBRSxLQUFLO3dCQUM5QixRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxhQUFhLENBQUMsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQzFELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUMvQjtnQkFDRCxPQUFPO2FBQ1Y7U0FDSjthQUNJO1lBQ0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUIsT0FBTyxJQUFJLEVBQUUsQ0FBQztTQUNqQjtJQUNMLENBQUM7Q0FBQSxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyJ9