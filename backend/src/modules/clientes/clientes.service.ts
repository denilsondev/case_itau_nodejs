import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { DepositarDto } from './dto/depositar.dto';
import { SacarDto } from './dto/sacar.dto';
import { ClienteRepository } from './cliente.repository';
import { Cliente } from './entities/cliente.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ClientesService {
  constructor(private readonly clienteRepository: ClienteRepository, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {

    const novoCliente = await this.clienteRepository.create(createClienteDto);

     // Invalidar cache de lista de clientes
    await this.cacheManager.del('clientes:all');

    return novoCliente;
  }

  async findAll(): Promise<Cliente[]> {
     // Tentar buscar do cache primeiro
    const cachedClientes = await this.cacheManager.get<Cliente[]>('clientes:all');
    if (cachedClientes) {
      return cachedClientes;
    }

     // Se não estiver no cache, buscar do banco
    const clientes = await this.clienteRepository.findAll();
    
    // Salvar no cache por 5 minutos
    await this.cacheManager.set('clientes:all', clientes, 300000);
    
    return clientes;
  }

  async findOne(id: number): Promise<Cliente> {
     // Tentar buscar do cache primeiro
    const cachedCliente = await this.cacheManager.get<Cliente>(`cliente:${id}`);
    if (cachedCliente) {
      return cachedCliente;
    }

    // Se não estiver no cache, buscar do banco
    const cliente = await this.clienteRepository.findById(id);
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    // Salvar no cache por 5 minutos
    await this.cacheManager.set(`cliente:${id}`, cliente, 300000);
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.clienteRepository.update(id, updateClienteDto);
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    // Invalidar caches relacionados
    await this.cacheManager.del(`cliente:${id}`);
    await this.cacheManager.del('clientes:all');

    return cliente;
  }

  async remove(id: number): Promise<{ message: string }> {
    const deleted = await this.clienteRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    /// Invalidar caches relacionados
    await this.cacheManager.del(`cliente:${id}`);
    await this.cacheManager.del('clientes:all');

    return { message: 'Cliente deletado com sucesso' };
  }

  async depositar(id: number, depositarDto: DepositarDto): Promise<{ saldo: number; message: string }> {

    const resultado = await this.clienteRepository.depositarComTransacao(id, depositarDto.valor);

    if (!resultado.sucesso) {
      throw new NotFoundException(resultado.mensagem);
    }

     // Invalidar caches relacionados ao cliente
    await this.cacheManager.del(`cliente:${id}`);
    await this.cacheManager.del('clientes:all');

    return { 
      saldo: resultado.novoSaldo, 
      message: resultado.mensagem 
    };
  }

  async sacar(id: number, sacarDto: SacarDto): Promise<{ saldo: number; message: string }> {
    
    const resultado = await this.clienteRepository.sacarComTransacao(id, sacarDto.valor);

    if (!resultado.sucesso) {
      if (resultado.mensagem.includes('Saldo insuficiente')) {
        throw new BadRequestException(resultado.mensagem);
      } else {
        throw new NotFoundException(resultado.mensagem);
      }
    }

     // Invalidar caches relacionados ao cliente
    await this.cacheManager.del(`cliente:${id}`);
    await this.cacheManager.del('clientes:all');

    return { 
      saldo: resultado.novoSaldo, 
      message: resultado.mensagem 
    };
  }
}
