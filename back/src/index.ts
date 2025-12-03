import { server } from "./server";
import { AppDataSource } from "./infra/db/data-source";
import { PORT } from "./infra/db/envs";
import 'reflect-metadata';

const start = async () => {
    try{
        await AppDataSource.initialize();
        console.info('Conectado a la base de datos correctamente');

        server.listen(PORT, () => {
            console.info(`Servidor corriendo en el puerto: https://localhost:${PORT}`)
        });
    } catch (error) {
        console.error('Error iniciando el servidor:', error);
    }
};

start();
