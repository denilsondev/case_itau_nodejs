import { Module } from '@nestjs/common';
import { ClientesModule } from './modules/clientes/clientes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './modules/clientes/entities/cliente.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Cliente],
      synchronize: true, // Cria tabelas automaticamente
    }),
    ClientesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { } 