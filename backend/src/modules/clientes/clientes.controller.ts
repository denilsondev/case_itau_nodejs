import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/cliente/create.dto';
import { UpdateClienteDto } from './dto/cliente/update.dto';
import { DepositarDto } from './dto/operacao/depositar.dto';
import { SacarDto } from './dto/operacao/sacar.dto';
import { ClienteResponseDto } from './dto/cliente/response.dto';
import { OperacaoResponseDto } from './dto/operacao/response.dto';
import { MessageResponseDto } from './dto/shared/message-response.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiOperation({summary: 'Cria um novo cliente'})
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso', type: ClienteResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createClienteDto: CreateClienteDto): Promise<ClienteResponseDto> {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes', type: [ClienteResponseDto] })
  findAll(): Promise<ClienteResponseDto[]> {
    return this.clientesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado', type: ClienteResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  findOne(@Param('id') id: string): Promise<ClienteResponseDto> {
    return this.clientesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso', type: ClienteResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto): Promise<ClienteResponseDto> {
    return this.clientesService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar cliente' })
  @ApiResponse({ status: 200, description: 'Cliente deletado com sucesso', type: MessageResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  remove(@Param('id') id: string): Promise<MessageResponseDto> {
    return this.clientesService.remove(+id);
  }

  @Post(':id/depositar')
  @ApiOperation({ summary: 'Realizar depósito na conta do cliente' })
  @ApiResponse({ status: 200, description: 'Depósito realizado com sucesso', type: OperacaoResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  depositar(@Param('id') id: string, @Body() depositarDto: DepositarDto): Promise<OperacaoResponseDto> {
    return this.clientesService.depositar(parseInt(id), depositarDto);
  }

  @Post(':id/sacar')
  @ApiOperation({ summary: 'Realizar saque na conta do cliente' })
  @ApiResponse({ status: 200, description: 'Saque realizado com sucesso', type: OperacaoResponseDto })
  @ApiResponse({ status: 400, description: 'Saldo insuficiente' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  sacar(@Param('id') id: string, @Body() sacarDto: SacarDto): Promise<OperacaoResponseDto> {
    return this.clientesService.sacar(parseInt(id), sacarDto);
  }
}
