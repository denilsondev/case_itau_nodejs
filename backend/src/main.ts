import { NestFactory } from "@nestjs/core";
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { GlobalExceptionFilter } from "./shared/filters/global-exception.filters";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";


async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true, // Remove propriedades não decoradas
        forbidNonWhitelisted: true, // Rejeita requisições com propriedades extras
        transform: true, // Transforma automaticamente tipos
    }));

    // Habilitar exception filter global
    app.useGlobalFilters(new GlobalExceptionFilter());

    app.enableCors();

    app.setGlobalPrefix('api');

    // Configuração do Swagger
    const config = new DocumentBuilder()
        .setTitle('API de Clientes')
        .setDescription('API para gerenciamento de clientes bancários')
        .setVersion('1.0')
        .addTag('clientes', 'Operações relacionadas a clientes')
        .addTag('operacoes', 'Operações bancárias (depósito e saque)')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    const port = process.env.PORT || 8080;
    await app.listen(port);

    console.log(`Aplicação rodando na porta: ${port}`);
    console.log(`API disponivel em: http://localhost:${port}/api`);
    console.log(`Documentação Swagger em: http://localhost:${port}/docs`);


}

bootstrap();