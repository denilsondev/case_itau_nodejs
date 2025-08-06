import { ApiProperty } from '@nestjs/swagger';

export class OperacaoResponseDto {
  @ApiProperty({ description: 'Mensagem de confirmação da operação' })
  message: string;

  @ApiProperty({ description: 'Novo saldo após a operação', example: 1500.75 })
  novoSaldo: number;
} 