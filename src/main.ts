import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );
    //Config Service
    const configService: ConfigService = app.get(ConfigService);
    //Set port with environment variable
    const port: number = configService.get<number>('PORT');

    const config = new DocumentBuilder()
        .setTitle('NestJS API Tasks')
        .setDescription('The NestJS API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    app.enableCors({ origin: true, credentials: true });
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    await app.listen(port, () => {
        console.log(
            'Running server at',
            configService.get<string>('BASE_URL') + ':' + port, //Set base URL with environment variable
        );
    });
}
bootstrap();
