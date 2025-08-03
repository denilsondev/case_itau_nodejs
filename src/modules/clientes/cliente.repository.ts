import { Injectable } from '@nestjs/common';

import * as sqlite3 from 'sqlite3';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteRepository {

  constructor(@InjectRepository(Cliente) private clienteRepository: Repository<Cliente>) {
   
  }


  async findAll(): Promise<Cliente[] | null>{
    return this.clienteRepository.find();
  }


  async findById(id: number): Promise<Cliente | null> {
    return this.clienteRepository.findOne({ where: { id } });
    
  }

   async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const cliente = this.clienteRepository.create(createClienteDto);
    return this.clienteRepository.save(cliente);
  }

  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente | null> {
    const cliente = await this.findById(id);
    if (!cliente) {
      return null;
    }
    
    Object.assign(cliente, updateClienteDto);
    return this.clienteRepository.save(cliente);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.clienteRepository.delete(id);
    return result.affected > 0;
  }


   async updateSaldo(id: number, novoSaldo: number): Promise<boolean> {
    const result = await this.clienteRepository.update(id, { saldo: novoSaldo });
    return result.affected > 0;
  }
} 