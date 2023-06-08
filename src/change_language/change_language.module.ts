import { Module } from '@nestjs/common';
import { ExtraModule } from '@core/extra';
import { TranslateModule } from '@core/translate';
import { ChangeLanguageScene } from './change_language.scene';

@Module({
    imports: [ExtraModule, TranslateModule],
    providers: [ChangeLanguageScene],
    exports: [ChangeLanguageScene],
})
export class ChangeLanguageModule {}
