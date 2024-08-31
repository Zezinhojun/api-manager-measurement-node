import express, { json } from 'express';

import { router } from './routes';

export const createApp = () => {
    const app = express();
    app.use(json());
    app.use('/files', express.static('images'));
    app.use('/', router);

    return app;
};
