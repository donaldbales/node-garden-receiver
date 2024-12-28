var express = require('express');
var router = express.Router();
const db = require("../models/garden_data");
const logger = require("../lib/logger");
const log = logger.instance;
const moduleName = 'routes/garden_data';

router.post('/garden_data', async function(req, res) {
    const methodName = 'router.post';
    log.debug({ moduleName, methodName }, `starting...`);
    const startDuration = Date.now();
    const contentType = req.get('Content-Type') || 'application/x-www-form-urlencoded';
    if (contentType === 'application/json') {
        const document = req.body;
        try {
            results = await db.insertOne(document);
            log.info({ module: __filename, method: 'router.post',
                sent: 'POST /garden_data', results, 
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
                    sent: 'POST /garden_data', results: '', 
                    duration: `${(Date.now() - startDuration) / 1000}` });
                res.status(422).json(error);
            }
            else {
                log.error({ module: __filename, method: 'router.post',
                    sent: 'POST /garden_data', error,
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
