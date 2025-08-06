import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/cliente/create.dto';
import { UpdateClienteDto } from './dto/cliente/update.dto';

@Injectable()
export class ClienteRepository {

  private readonly logger = new Logger(ClienteRepository.name);

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
      this.logger.warn(`Tentativa de criar cliente com email já existente: ${createClienteDto.email}`);
      throw new ConflictException('Email já está em uso');
    }

    const cliente = this.clienteRepository.create(createClienteDto);
    const savedCliente = await this.clienteRepository.save(cliente);

    this.logger.log(`Cliente criado com sucesso: ${savedCliente.id}`);

    return savedCliente;
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
    const deleted = await result.affected > 0;

    if (deleted) {
      this.logger.log(`Cliente deletado com sucesso: ID ${id}`);
    } else {
      this.logger.warn(`Tentativa de deletar cliente inexistente: ID ${id}`);
    }

    return deleted;
  }

  async depositarComTransacao(id: number, valor: number): Promise<{ sucesso: boolean; novoSaldo: number; mensagem: string }> {

    this.logger.log(`Iniciando depósito: Cliente ID ${id}, Valor R$ ${valor.toFixed(2)}`);

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
        this.logger.warn(`Cliente não encontrado para depósito: ID ${id}`);
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

      this.logger.log(`Depósito realizado com sucesso: Cliente ID ${id}, Saldo anterior R$ ${saldoAtual.toFixed(2)}, Novo saldo R$ ${novoSaldo.toFixed(2)}`);

      return { 
        sucesso: true, 
        novoSaldo, 
        mensagem: 'Depósito realizado com sucesso' 
      };


    } catch (error) {
      this.logger.error(`Erro no depósito: Cliente ID ${id}, Valor R$ ${valor.toFixed(2)}`, error.stack);
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
    
    this.logger.log(`Iniciando saque: Cliente ID ${id}, Valor R$ ${valor.toFixed(2)}`);

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
        this.logger.warn(`Cliente não encontrado para saque: ID ${id}`);
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
        this.logger.warn(`Saldo insuficiente para saque: Cliente ID ${id}, Saldo atual R$ ${saldoAtual.toFixed(2)}, Valor solicitado R$ ${valor.toFixed(2)}`);
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
      this.logger.log(`Saque realizado com sucesso: Cliente ID ${id}, Saldo anterior R$ ${saldoAtual.toFixed(2)}, Novo saldo R$ ${novoSaldo.toFixed(2)}`);

      return { 
        sucesso: true, 
        novoSaldo, 
        mensagem: 'Saque realizado com sucesso' 
      };

    } catch (error) {
      this.logger.error(`Erro no saque: Cliente ID ${id}, Valor R$ ${valor.toFixed(2)}`, error.stack);
      
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Sempre liberar o query runner
      await queryRunner.release();
      
    }
  }
  
} 