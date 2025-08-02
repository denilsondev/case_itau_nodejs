import { Module } from '@nestjs/common';
import { ClientesModule } from './modules/clientes/clientes.module';

@Module({
  imports: [ClientesModule],
  controllers: [],
  providers: [],
})
export class AppModule {} 