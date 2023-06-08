import { NestFactory } from '@nestjs/core';
import { BotModule } from './bot.module';

async function bootstrap() {
    const app = await NestFactory.create(BotModule);
    await app.listen(3000);
}
bootstrap();
