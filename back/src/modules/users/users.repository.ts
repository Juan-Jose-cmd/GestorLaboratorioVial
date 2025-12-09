import { AppDataSource } from "../../infra/db/data-source";
import { RolUsuario, User } from "./user.entity";
import { Repository } from "typeorm";

export class UserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async create(data: { 
        name: string; 
        email: string; 
        password: string; 
        rol: RolUsuario 
    }): Promise<User> {
        const user = this.repository.create(data);
        return await this.repository.save(user);
    }

    async findAll(): Promise<User[]> {
        return await this.repository.find({
            where: { activo: true },
            order: { name: 'ASC' }
        });
    }

    async findById(id: string): Promise<User | null> {
        return await this.repository.findOne({
            where: { id }
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.repository.findOne({
            where: { email }
        });
    }

    async findByRol(rol: RolUsuario): Promise<User[]> {
        return await this.repository.find({
            where: { rol, activo: true }
        });
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        await this.repository.update(id, data);
        return await this.findById(id);
    }

    async softDelete(id: string): Promise<void> {
        await this.repository.update(id, { activo: false });
    }

    async countByRol(rol: RolUsuario): Promise<number> {
        return await this.repository.count({
            where: { rol, activo: true }
        });
    }
}
