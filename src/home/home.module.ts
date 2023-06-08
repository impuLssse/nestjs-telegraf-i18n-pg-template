import { Module } from '@nestjs/common';
import { HomeScene } from './home.scene';
import { ExtraModule } from '@core/extra';
import { TranslateModule } from '@core/translate';

@Module({
    imports: [ExtraModule, TranslateModule],
    providers: [HomeScene],
    exports: [HomeScene],
})
export class HomeModule {}
