import mysql from "mysql";

export class Database {
    private connection: mysql.Connection;

    constructor() {
        this.connection = mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "",
            database: "test"
        });
        this.connection.connect();
        this.connection.query("FLUSH TABLES");
    }

    query(sql: string, values?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, values, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });
    }
}