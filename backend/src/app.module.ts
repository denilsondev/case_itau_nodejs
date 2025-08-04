import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './modules/clientes/entities/cliente.entity';
import { ClientesModule } from './modules/clientes/clientes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'case_itau_user',
      password: process.env.DB_PASSWORD || 'case_itau_pass',
      database: process.env.DB_DATABASE || 'case_itau_db',
      entities: [Cliente],
      synchronize: true, // Cria tabelas automaticamente
      logging: process.env.NODE_ENV === 'development', // Log só em desenvolvimento
    }),
    ClientesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 