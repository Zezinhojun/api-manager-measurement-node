import { createApp } from './app';
import sequelize from './database/sequelize/sequelize-instance';

const PORT = process.env.PORT ?? 3000;
const app = createApp();

async function initialize() {
    console.log('Attempting to connect to the database...');
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ force: true });
        console.log('Database synced successfully.');
        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

initialize();
