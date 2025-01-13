import * as Logger from 'bunyan';
import { Application, NextFunction, Request, Response, Router } from 'express';
import * as db from '../models/garage_data';
import * as logger from '../lib/logger';
import * as express from 'express';

const log: any = logger.instance;

const moduleName: string = 'routes/garage_data';

const router: Router = express.Router();

router.post('/garage_data', async function(req: Request, res: Response, next: NextFunction) {
    const methodName = 'router.post';
    log.debug({ moduleName, methodName }, `starting...`);
    const startDuration = Date.now();
    const contentType = req.get('Content-Type') || 'application/x-www-form-urlencoded';
    if (contentType === 'application/json') {
        const document = req.body;
        try {
            const results: any = await db.insertOne(document);
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

module.exports = router;
