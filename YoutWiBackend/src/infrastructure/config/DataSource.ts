import { DataSource } from 'typeorm';
import { UserEntity } from '../entity/UserEntity'; // Verifica que la ruta a tu entidad sea correcta
import 'dotenv/config'; // Asegúrate de importar dotenv al inicio del archivo

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? "", 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [UserEntity],
    synchronize: true,
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });
