import { DataSource } from "typeorm";
import { User } from "../entities/User";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "uba",
    synchronize: true,
    logging: true,
    entities: [User],
    subscribers: [],
    migrations: [],
});