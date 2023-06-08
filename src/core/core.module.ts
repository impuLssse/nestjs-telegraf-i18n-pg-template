import { Module } from '@nestjs/common';
import { TranslateModule, TranslateService } from './translate';
import { PrismaModule, PrismaService } from './prisma';
import { ExtraModule, ExtraService } from './extra';
import { SessionModule, SessionService } from './session';

@Module({
    imports: [TranslateModule, PrismaModule, ExtraModule, SessionModule],
    providers: [TranslateService, PrismaService, ExtraService, SessionService],
})
export class CoreModule {}
