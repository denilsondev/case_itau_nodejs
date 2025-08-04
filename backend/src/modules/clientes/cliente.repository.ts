import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteRepository {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    private dataSource: DataSource
  ) { }

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

  async depositarComTransacao(id: number, valor: number): Promise<{ sucesso: boolean; novoSaldo: number; mensagem: string }> {

    console.log('=== DEPÓSITO DEBUG ===');
    console.log('ID do cliente:', id);
    console.log('Valor recebido:', valor);
    console.log('Tipo do valor:', typeof valor);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      //Buscar cliente com lock (for UPDATE)
      const cliente = await queryRunner.manager.findOne(Cliente, {
        where: { id },
        lock : { mode: 'pessimistic_write' }
      });

      if (!cliente) {
        await queryRunner.rollbackTransaction();
        return { 
          sucesso: false, 
          novoSaldo: 0, 
          mensagem: 'Cliente não encontrado' 
        };
      }

      const saldoAtual = cliente.saldo || 0;
      const novoSaldo = saldoAtual + valor;

       // Atualizar saldo
      await queryRunner.manager.update(Cliente, id, { saldo: novoSaldo });

      // Commit da transação
      await queryRunner.commitTransaction();

      return { 
        sucesso: true, 
        novoSaldo, 
        mensagem: 'Depósito realizado com sucesso' 
      };


    } catch (error) {

      // Rollback em caso de erro
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {

      // Sempre liberar o query runner
      await queryRunner.release();
    }
  }

  async sacarComTransacao(
    id: number, 
    valor: number
  ): Promise<{ sucesso: boolean; novoSaldo: number; mensagem: string }> {
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buscar cliente com lock (FOR UPDATE)
      const cliente = await queryRunner.manager.findOne(Cliente, {
        where: { id },
        lock: { mode: 'pessimistic_write' }
      });

      if (!cliente) {
        await queryRunner.rollbackTransaction();
        return { 
          sucesso: false, 
          novoSaldo: 0, 
          mensagem: 'Cliente não encontrado' 
        };
      }

      const saldoAtual = cliente.saldo || 0;
      
      // Validar se tem saldo suficiente
      if (valor > saldoAtual) {
        await queryRunner.rollbackTransaction();
        return { 
          sucesso: false, 
          novoSaldo: saldoAtual, 
          mensagem: 'Saldo insuficiente para realizar o saque' 
        };
      }

      const novoSaldo = saldoAtual - valor;

      // Atualizar saldo
      await queryRunner.manager.update(Cliente, id, { saldo: novoSaldo });

      // Commit da transação
      await queryRunner.commitTransaction();

      return { 
        sucesso: true, 
        novoSaldo, 
        mensagem: 'Saque realizado com sucesso' 
      };

    } catch (error) {
      // Rollback em caso de erro
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Sempre liberar o query runner
      await queryRunner.release();
    }
  }
  
} 