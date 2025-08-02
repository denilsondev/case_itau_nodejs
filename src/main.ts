import { NestFactory } from "@nestjs/core";
import { AppModule } from './app.module';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    app.setGlobalPrefix('api');

    const port = process.env.PORT || 8080;
    await app.listen(port);

    console.log(`Aplicação rodando na porta: ${port}`);
    console.log(`API disponivel em: http://localhost:${port}/api`);

}

bootstrap();