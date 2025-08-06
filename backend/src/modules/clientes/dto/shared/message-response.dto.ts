import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ description: 'Mensagem de resposta da operação' })
  message: string;
} 