import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'postgres',// localhost if out container, postgres in container
    port: 5432,
    database: 'mydatabase',
    username: 'myuser',
    password: 'mypassword',
    logging: false,
})

export default sequelize;