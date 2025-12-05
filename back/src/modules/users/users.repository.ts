import { AppDataSource } from "../../infra/db/data-source";
import { RolUsuario, User } from "./user.entity";

const repository = AppDataSource.getRepository(User);

export class UserRepository {

    static async create(data: { name: string; email: string; password: string; rol: RolUsuario }) {
        const user = repository.create(data);

        return await repository.save(user);
    };

    static findAll() {
        return repository.find();
    };

    static findByEmail(email: string) {
        return repository.findOne({
            where: {
                email,
            }
        });
    };

    static findById(id: string) {
        return repository.findOne({
            where: {
                id,
            }
            });
    };

    static async update(id: string, data: { name: string; email: string; password: string; rol: RolUsuario }) {
        await repository.update({ id }, data);
        return this.findById(id);
    };
};

