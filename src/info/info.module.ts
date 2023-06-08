import { Module } from '@nestjs/common';
import { InfoScene } from './info.scene';
import { ExtraModule } from '@core/extra';

@Module({
    imports: [ExtraModule],
    providers: [InfoScene],
    exports: [InfoScene],
})
export class InfoModule {}
