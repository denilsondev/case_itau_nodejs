import { IsNumber, IsPositive, Min } from 'class-validator';

export class DepositarDto {
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @IsPositive({ message: 'Valor deve ser positivo' })
  @Min(0.01, { message: 'Valor mínimo para depósito é R$ 0,01' })
  valor: number;
} 