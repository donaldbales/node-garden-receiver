var express = require('express');
var router = express.Router();
const db = require("../models/garden_data");
const logger = require("../lib/logger");
const log = logger.instance;
const moduleName = 'routes/garden_data';

router.post('/garden_data', async function(req, res, next) {
    const methodName = 'router.post';
    log.info({ moduleName, methodName }, `starting...`);
    const startDuration = Date.now();
    const contentType = req.get('Content-Type') || 'application/x-www-form-urlencoded';
    if (contentType === 'application/json') {
        const document = req.body;
        try {
            results = await db.insertOne(document);
            log.info({ module: __filename, method: 'router.post',
                sent: 'POST /garden_data', results, 
                duration: `${(Date.now() - startDuration) / 1000}` });
            
            if (!results.error) {
                log.info({ module: __filename, method: 'router.post',
                    sent: 'POST /garden_data', results, 
                    duration: `${(Date.now() - startDuration) / 1000}` });
                res.status(201).json(results);
            }
            else if (results.error &&
                     results.error.code &&
                     results.error.code === 'ER_DUP_ENTRY') {
                res.status(422).json(results);
            }
            else {
                res.status(500).json(results);
            }
            return next();
        }
        catch (error) {
            log.error({ module: __filename, method: 'router.post',
                sent: 'POST /garden_data', error,
                duration: `${(Date.now() - startDuration) / 1000}` });
            if (error &&
                error.code &&
                error.code === 'ER_DUP_ENTRY') {
                res.status(422).json(error);
            }
            else {
                res.status(500).json(error);
            }
            return next();
        }
    }
    else {
        res.status(404).send(' ');
        return next();
    }
});

module.exports = router;
