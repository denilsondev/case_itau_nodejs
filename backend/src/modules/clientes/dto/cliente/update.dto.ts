import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create.dto';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {}
