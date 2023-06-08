import { Injectable } from '@nestjs/common';
import {
    IContext,
    IButton,
    IReplyOrEditOptions,
    IReplyAlertOptions,
    IReplyOrEditWithPhotoOptions,
} from '@shared/interfaces';
import { Langs, I18nPath, ButtonsStack } from '@shared/types';
import { TranslateService } from '@core/translate';
import { Buttons, CallbackButton, Key, Keyboard, MakeFunction, MakeOptions } from 'telegram-keyboard';
import { Input } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { SessionService } from '@core/session';

/** Сервис по работе сообщениями
 * * Переводим клавиатуру и текстовые фразы на любые указанные языки в `libs/locales`
 *
 * ! ВАЖНО: методы которые начинаются с `typed` - типизированы
 * */
@Injectable()
export class ExtraService {
    constructor(private readonly translate: TranslateService, private readonly sessionService: SessionService) {}

    async tryDeleteMessege(ctx: IContext) {
        try {
            const { messageId } = ctx.session;
            await ctx.deleteMessage(messageId ? messageId : undefined);
        } catch (e) {}
    }

    /** Избавляемся от спама сообщений, путем изменения прошлого текстового сообщения */
    async replyOrEdit(ctx: IContext, lang: Langs, options: IReplyOrEditOptions) {
        const { reply_markup } = options;
        const phrase = this.translate.findPhrase(options.text, lang, options.args);

        try {
            return (await ctx.editMessageText(phrase, {
                reply_markup,
                parse_mode: 'HTML',
            })) as Message.TextMessage;
        } catch (e) {
            return (await ctx.sendMessage(phrase, { reply_markup, parse_mode: 'HTML' })) as Message.TextMessage;
        }
    }

    async replyOrEditWithPhoto(ctx: IContext, lang: Langs, options: IReplyOrEditWithPhotoOptions) {
        const { reply_markup } = options;
        const phrase = this.translate.findPhrase(options.text, lang, options.args);

        return (await ctx.sendPhoto(Input.fromURLStream(options.image), {
            caption: phrase,
            reply_markup,
            parse_mode: 'HTML',
            ...reply_markup,
        })) as Message.PhotoMessage;
    }

    /** Вывод уведомления на экран клиента */
    async replyAlert(ctx: IContext, lang: Langs, { text, args }: IReplyAlertOptions): Promise<void> {
        const translatedText = this.translate.findPhrase(text, lang, args);
        await ctx.answerCbQuery(translatedText);
    }

    /** Сохраняем отправленную нам картинку в сессию */
    async saveImage(ctx: IContext) {
        const { file_id } = ctx.update.message.photo.pop();

        const url = await ctx.telegram.getFileLink(file_id);
        this.sessionService.setImage(ctx, url);
    }

    /** Создание типизированой **инлайн** клавиатуры
     * * Пишем ключ кнопки, например в файл `libs/locales/en/buttons.json`
     * * Затем это генерируется - от `libs/shared/types/translate.types.generated.ts`
     * * Эта типизация нужна по 2-ум причинам: контракт и перевод
     *
     * @example
     * // Можно указывать строками
     * await ctx.sendMessage(enterPhrase, {
     *       ...extra.makeInlineKeyboard(['buttons.products', 'buttons.back'], 'ru'),
     *   });
     *
     * // Либо объектами интерфеса IButton
     * await ctx.sendMessage(enterPhrase, {
     *       ...extra.makeInlineKeyboard([{ text: 'buttons.products' }, { text: 'buttons.back' }], 'ru'),
     *   });
     *
     * // В два ряда
     * await ctx.sendMessage(enterPhrase, {
     *       ...extra.makeInlineKeyboard([
     *     [{ text: 'buttons.products' }, { text: 'buttons.admin' }],
     *     [{ text: 'buttons.products' }, { text: 'buttons.back' }]
     * ], 'en'),
     *   });
     *
     * // Можно совмещать
     * await ctx.sendMessage(enterPhrase, {
     *       ...extra.makeInlineKeyboard([
     *     [{ text: 'buttons.products' }, { text: 'buttons.admin' }],
     *     ['buttons.products', 'buttons.back']
     * ], 'en'),
     *   });
     */
    typedInlineKeyboard(buttons: ButtonsStack, lang: Langs, makeOptions?: Partial<MakeOptions>) {
        return this.typedKeyboard(buttons, lang, makeOptions).inline();
    }

    /** Создание типизированой клавиатуры */
    typedKeyboard(buttons: ButtonsStack, lang: Langs, makeOptions?: Partial<MakeOptions>) {
        const parsedButtons = this.toTypedKeyboard(buttons, lang, makeOptions as MakeOptions);
        return Keyboard.make(parsedButtons as CallbackButton[], makeOptions as MakeOptions);
    }

    /** Создание нетипизированной обычной инлайн клавиатуры */
    simpleInlineKeyboard(buttons: Buttons, template?: string, makeOptions?: Partial<MakeOptions>) {
        return this.simpleKeyboard(buttons, template, makeOptions).inline();
    }

    /** Создание нетипизированной обычной клавиатуры */
    simpleKeyboard(buttons: Buttons, template?: string, makeOptions?: Partial<MakeOptions>) {
        if (template) {
            const buttonsFromFactory = this.factoryCallbackData(buttons, template);
            return Keyboard.make(buttonsFromFactory, makeOptions as MakeOptions);
        }
        return Keyboard.make(buttons, makeOptions as MakeOptions);
    }

    /**
     * ! **Очень важно в конце вызвать метод inline(), иначе нихуя работать не будет**
     * @example
     * const nav = extra.typedKeyboard(['buttons.back'], lang);
     * const categories = extra.simpleKeyboard([arrayDataFromDatabase]);
     *
     * const full = extra.combineKeyboard(nav, categories).inline();
     */
    combineKeyboard(...keyboards: Keyboard[]) {
        return Keyboard.combine(...keyboards);
    }

    removeKeyboard() {
        return Keyboard.remove();
    }

    /** Складываем template + callback_data
     * * Нужно чтобы динамически ловить текст кнопок, которые пришли из БД
     * * Например, для получения имен товаров (пришли с БД, добавим шаблон к строке, чтобы потом точно определить к чему это относится)
     */
    private factoryCallbackData(buttons: Buttons, template?: string) {
        return buttons.map((button: any) => {
            if (typeof button == 'string') {
                return Key.callback(button, template + button);
            }

            if (Array.isArray(button)) {
                return button.map((button) => Key.callback(button, template + button));
            }
        }) as CallbackButton[];
    }

    /** Превращаем массив нетипизированных строк в массив CallbackButton */
    private toTypedKeyboard(buttons: ButtonsStack, lang: Langs, makeOptions?: MakeOptions) {
        return buttons.map((buttons: I18nPath | I18nPath[] | IButton | IButton[]) => {
            if (typeof buttons == 'string') {
                return this.toCallbackButton({ text: buttons as I18nPath }, lang);
            }

            if (Array.isArray(buttons)) {
                return buttons
                    .map((button: string | IButton) =>
                        typeof button == 'string' ? this.toCallbackButton({ text: button as I18nPath }, lang) : button,
                    )
                    .map((button) => this.toCallbackButton(button as IButton, lang));
            }

            if (typeof buttons == 'object') {
                return this.toCallbackButton(buttons, lang);
            }
        });
    }

    /** Превращаем кнопку в CallbackButton */
    private toCallbackButton(button: IButton, lang: Langs): CallbackButton {
        const translatedText = this.translate.findPhrase(button.text, lang, button.args);

        return {
            text: translatedText,
            callback_data: button.callback_data ? button.callback_data : button.text,
            hide: button.hide ? button.hide : false,
        };
    }
}
