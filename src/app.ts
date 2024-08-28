import express, { json } from 'express';
import { router } from "./routes";

export const createApp = () => {
    const app = express();
    app.use(json());
    app.use("/", router);


    return app;
};