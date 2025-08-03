import { Injectable } from '@nestjs/common';
import { Cliente } from './interfaces/cliente.interface';
import * as sqlite3 from 'sqlite3';

@Injectable()
export class ClienteRepository {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(':memory:');
    this.initializeDatabase();
  }

  private initializeDatabase() {
    this.db.serialize(() => {
        this.db.run(`CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            saldo FLOAT DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    })
  }

  async findAll(): Promise<Cliente[] | null>{
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM clientes';
        this.db.all(query, [], (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows as Cliente[])
            }
        })
    })
  }


  async findById(id: number): Promise<Cliente | null> {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM clientes WHERE id = ?';
        this.db.get(query, [id], (err, row) => {
            if(err) {
                reject(err);
            } else {
                resolve(row as Cliente)
            }
        })
    })
    
  }

   async create(cliente: Partial<Cliente>): Promise<Cliente> {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO clientes(nome, email, saldo) VALUES(?, ?, ?)';
      this.db.run(query, [cliente.nome, cliente.email, cliente.saldo || 0], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...cliente } as Cliente);
        }
      });
    });
  }

  async update(id: number, cliente: Partial<Cliente>): Promise<Cliente | null> {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE clientes SET nome = ?, email = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?';
      this.db.run(query, [cliente.nome, cliente.email, id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          resolve(null);
        } else {
          resolve({ id, ...cliente } as Cliente);
        }
      });
    });
  }

  async delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM clientes WHERE id = ?';
      this.db.run(query, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  async updateSaldo(id: number, novoSaldo: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE clientes SET saldo = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?';
      this.db.run(query, [novoSaldo, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }








  
} 