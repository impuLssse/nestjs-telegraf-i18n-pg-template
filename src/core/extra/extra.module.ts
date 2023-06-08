import { Module } from '@nestjs/common';
import { ExtraService } from './extra.service';
import { TranslateModule } from '@core/translate';
import { SessionModule } from '@core/session';

@Module({
    imports: [TranslateModule, SessionModule],
    providers: [ExtraService],
    exports: [ExtraService],
})
export class ExtraModule {}
