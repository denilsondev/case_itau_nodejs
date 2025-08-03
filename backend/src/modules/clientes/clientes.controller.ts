import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { DepositarDto } from './dto/depositar.dto';
import { SacarDto } from './dto/sacar.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiOperation({summary: 'Cria um novo cliente'})
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os clientes' })
  findAll() {
    return this.clientesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cliente' })
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar cliente' })
  remove(@Param('id') id: string) {
    return this.clientesService.remove(+id);
  }

  @Post(':id/depositar')
  @ApiTags('operacoes')
  @ApiOperation({ summary: 'Realizar depósito na conta do cliente' })
  depositar(@Param('id') id: string, @Body() depositarDto: DepositarDto) {
    return this.clientesService.depositar(parseInt(id), depositarDto);
  }

  @Post(':id/sacar')
  @ApiTags('operacoes')
  @ApiOperation({ summary: 'Realizar saque na conta do cliente' })
  sacar(@Param('id') id: string, @Body() sacarDto: SacarDto) {
    return this.clientesService.sacar(parseInt(id), sacarDto);
  }
}
