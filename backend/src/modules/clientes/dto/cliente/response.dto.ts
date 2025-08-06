import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ClienteResponseDto {
  @Expose()
  @ApiProperty({ description: 'ID único do cliente' })
  id: number;

  @Expose()
  @ApiProperty({ description: 'Nome completo do cliente' })
  nome: string;

  @Expose()
  @ApiProperty({ description: 'Email do cliente' })
  email: string;

  @Expose()
  @ApiProperty({ description: 'Saldo atual da conta', example: 1000.50 })
  saldo: number;

  @Expose()
  @ApiProperty({ description: 'Data de criação da conta' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'Data da última atualização' })
  updatedAt: Date;
} 