import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteRepository } from './cliente.repository';
import { Cliente } from './interfaces/cliente.interface';
import { DepositarDto } from './dto/depositar.dto';
import { SacarDto } from './dto/sacar.dto';


@Injectable()
export class ClientesService {

  constructor(private readonly clienteRepository: ClienteRepository) { }


  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    return this.clienteRepository.create(createClienteDto);
  }

  findAll() {
    return this.clienteRepository.findAll();
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findById(id);
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.clienteRepository.update(id, updateClienteDto);
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return cliente;
  }

  async remove(id: number): Promise<{ message: string }> {
    const deleted = await this.clienteRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return { message: 'Cliente deletado com sucesso' };
  }

  async depositar(id: number, depositarDto: DepositarDto): Promise<{ saldo: number; message: string }> {

    const cliente = await this.findOne(id);

    if (!depositarDto.valor) {
      throw new Error('Valor para depósito deve ser maior que zero');
    }

    const novoSaldo = (cliente.saldo || 0) + depositarDto.valor;
    cliente.saldo = novoSaldo;
    await this.clienteRepository.updateSaldo(id, novoSaldo);

    return {
      saldo: novoSaldo,
      message: `Depósito de R$ ${depositarDto.valor} realizado com sucesso.`
    };
  }

  async sacar(id: number, sacarDto: SacarDto): Promise<{ saldo: number; message: string }> {
    const cliente = await this.findOne(id);

    if (sacarDto.valor <= 0) {
      throw new Error('Valor para saque deve ser maior que zero');
    }

    const saldoAtual = cliente.saldo || 0;
    if (sacarDto.valor > saldoAtual) {
      throw new Error('Saldo insuficiente para realizar o saque');
    }

    const novoSaldo = saldoAtual - sacarDto.valor;
    await this.clienteRepository.updateSaldo(id, novoSaldo);

    return {
      saldo: novoSaldo,
      message: 'Saque realizado com sucesso'
    };
  }


}
