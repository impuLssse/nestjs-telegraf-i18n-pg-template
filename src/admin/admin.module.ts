import { Module } from '@nestjs/common';
import { AdminScene } from './scenes';
import { ExtraModule } from '@core/extra';
import { TranslateModule } from '@core/translate';
import { SessionModule, SessionService } from '@core/session';
import { PrismaModule } from '@core/prisma';

@Module({
    imports: [ExtraModule, TranslateModule, SessionModule, PrismaModule],
    providers: [AdminScene, SessionService],
})
export class AdminModule {}
