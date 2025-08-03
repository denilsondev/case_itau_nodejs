import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteRepository {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>
  ) {}

  async findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find();
  }

  async findById(id: number): Promise<Cliente | null> {
    return this.clienteRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    return this.clienteRepository.findOne({ where: { email } });
  }

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    // Verificar se email já existe
    const existingCliente = await this.findByEmail(createClienteDto.email);
    if (existingCliente) {
      throw new ConflictException('Email já está em uso');
    }

    const cliente = this.clienteRepository.create(createClienteDto);
    return this.clienteRepository.save(cliente);
  }

  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente | null> {
    const cliente = await this.findById(id);
    if (!cliente) {
      return null;
    }

    // Se está tentando atualizar o email, verificar se já existe
    if (updateClienteDto.email && updateClienteDto.email !== cliente.email) {
      const existingCliente = await this.findByEmail(updateClienteDto.email);
      if (existingCliente) {
        throw new ConflictException('Email já está em uso');
      }
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