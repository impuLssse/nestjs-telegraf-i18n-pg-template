import { Module, NotFoundException } from '@nestjs/common';
import { I18nModule, I18nJsonLoader, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { TranslateService } from './translate.service';

@Module({
    imports: [
        I18nModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                fallbackLanguage: config.get<string>('FALLBACK_LANGUAGE'),
                fallbacks: {
                    'en-*': 'en',
                    'ru-*': 'ru',
                },
                loaderOptions: {
                    path: join(__dirname, '../libs/locales/'),
                    watch: true,
                    includeSubfolders: true,
                },
                typesOutputPath: join(__dirname, '../libs/shared/types/translate.types.generated.ts'),
                catch(onrejected) {
                    throw new NotFoundException(onrejected);
                },
            }),
            loader: I18nJsonLoader,
            inject: [ConfigService],
            resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
        }),
    ],
    providers: [TranslateService],
    exports: [TranslateService],
})
export class TranslateModule {}
