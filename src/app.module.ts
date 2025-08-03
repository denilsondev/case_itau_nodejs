import { Module } from '@nestjs/common';
import { ClientesModule } from './modules/clientes/clientes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './modules/clientes/entities/cliente.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'case_itau_user',
      password: 'case_itau_pass',
      database: 'case_itau_db',
      entities: [Cliente],
      synchronize: true, // Cria tabelas automaticamente
      logging: true, // Log das queries SQL
    }),
    ClientesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { } 