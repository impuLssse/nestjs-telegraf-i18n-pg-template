import { I18nPath, I18nTranslations } from '@shared/types';
import { Injectable } from '@nestjs/common';
import { Langs } from '@shared/types';
import { I18nService } from 'nestjs-i18n';
import { IPhrase } from '@libs/shared/interfaces/phrase.interface';

/** Сервис по поиску перевода
 * * Берет переводы из `libs/locales/...`
 * */
@Injectable()
export class TranslateService {
    constructor(private readonly locales: I18nService<I18nTranslations>) {}

    /** Сервис по поиску перевода
     *  @param phrase ключ перевода
     *  @param lang название папки в `libs/locales`
     *  @param args любые аргументы, которые нужны для перевода
     *
     * @example
     * // Вернет перевод кнопки из папки 'ru' - 'назад'
     * const phrase = this.translate.findPhrase('buttons.back', 'ru');
     *
     * // Вернет приветствие из папки 'en' - 'Hello, impuLssse666!'
     * const phrase = this.translate.findPhrase('buttons.hello', 'en', { username: ctx.from.username });
     * */
    findPhrase(phrase: I18nPath, lang: Langs = 'en', args?: any): string {
        return this.locales.translate<I18nPath>(phrase, { lang, args }).toString();
    }

    findPhrases(lang: Langs = 'en', ...phrases: IPhrase[]) {
        return phrases.reduce((acc, item) => {
            const translated = this.findPhrase(item.phrase, lang, item.args);
            acc.push(translated);

            return acc;
        }, []);
    }
}
