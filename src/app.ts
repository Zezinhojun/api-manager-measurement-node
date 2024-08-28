import express, { json } from 'express';
import { router } from "./routes";

export const createApp = () => {
    const app = express();
    app.use(json({ limit: '50mb' }));
    app.use('/files', express.static('images'));
    app.use("/", router);

    return app;
};