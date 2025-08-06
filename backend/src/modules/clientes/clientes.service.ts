import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { CreateClienteDto } from './dto/cliente/create.dto';
import { UpdateClienteDto } from './dto/cliente/update.dto';
import { DepositarDto } from './dto/operacao/depositar.dto';
import { SacarDto } from './dto/operacao/sacar.dto';
import { ClienteResponseDto } from './dto/cliente/response.dto';
import { OperacaoResponseDto } from './dto/operacao/response.dto';
import { MessageResponseDto } from './dto/shared/message-response.dto';
import { ClienteRepository } from './cliente.repository';
import { Cliente } from './entities/cliente.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ClientesService {
  constructor(private readonly clienteRepository: ClienteRepository, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async create(createClienteDto: CreateClienteDto): Promise<ClienteResponseDto> {

    const novoCliente = await this.clienteRepository.create(createClienteDto);

     // Invalidar cache de lista de clientes
    await this.cacheManager.del('clientes:all');

    // Converter Entity para DTO
    return plainToClass(ClienteResponseDto, novoCliente, { excludeExtraneousValues: true });
  }

  async findAll(): Promise<ClienteResponseDto[]> {
     // Tentar buscar do cache primeiro
    const cachedClientes = await this.cacheManager.get<Cliente[]>('clientes:all');
    if (cachedClientes) {
      return plainToClass(ClienteResponseDto, cachedClientes, { excludeExtraneousValues: true });
    }

     // Se não estiver no cache, buscar do banco
    const clientes = await this.clienteRepository.findAll();
    
    // Salvar no cache por 5 minutos
    await this.cacheManager.set('clientes:all', clientes, 300000);
    
    // Converter Entity para DTO
    return plainToClass(ClienteResponseDto, clientes, { excludeExtraneousValues: true });
  }

  async findOne(id: number): Promise<ClienteResponseDto> {
     // Tentar buscar do cache primeiro
    const cachedCliente = await this.cacheManager.get<Cliente>(`cliente:${id}`);
    if (cachedCliente) {
      return plainToClass(ClienteResponseDto, cachedCliente, { excludeExtraneousValues: true });
    }

    // Se não estiver no cache, buscar do banco
    const cliente = await this.clienteRepository.findById(id);
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    // Salvar no cache por 5 minutos
    await this.cacheManager.set(`cliente:${id}`, cliente, 300000);
    
    // Converter Entity para DTO
    return plainToClass(ClienteResponseDto, cliente, { excludeExtraneousValues: true });
  }

  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<ClienteResponseDto> {
    const cliente = await this.clienteRepository.update(id, updateClienteDto);
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    // Invalidar caches relacionados
    await this.cacheManager.del(`cliente:${id}`);
    await this.cacheManager.del('clientes:all');

    // Converter Entity para DTO
    return plainToClass(ClienteResponseDto, cliente, { excludeExtraneousValues: true });
  }

  async remove(id: number): Promise<MessageResponseDto> {
    const deleted = await this.clienteRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    /// Invalidar caches relacionados
    await this.cacheManager.del(`cliente:${id}`);
    await this.cacheManager.del('clientes:all');

    return { message: 'Cliente deletado com sucesso' };
  }

  async depositar(id: number, depositarDto: DepositarDto): Promise<OperacaoResponseDto> {

    const resultado = await this.clienteRepository.depositarComTransacao(id, depositarDto.valor);

    if (!resultado.sucesso) {
      throw new NotFoundException(resultado.mensagem);
    }

     // Invalidar caches relacionados ao cliente
    await this.cacheManager.del(`cliente:${id}`);
    await this.cacheManager.del('clientes:all');

    return { 
      message: resultado.mensagem,
      novoSaldo: resultado.novoSaldo
    };
  }

  async sacar(id: number, sacarDto: SacarDto): Promise<OperacaoResponseDto> {
    
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
      message: resultado.mensagem,
      novoSaldo: resultado.novoSaldo
    };
  }
}
