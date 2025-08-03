import { NestFactory } from "@nestjs/core";
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";


async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true, // Remove propriedades não decoradas
        forbidNonWhitelisted: true, // Rejeita requisições com propriedades extras
        transform: true, // Transforma automaticamente tipos
    }));

    app.enableCors();

    app.setGlobalPrefix('api');

    const port = process.env.PORT || 8080;
    await app.listen(port);

    console.log(`Aplicação rodando na porta: ${port}`);
    console.log(`API disponivel em: http://localhost:${port}/api`);

}

bootstrap();