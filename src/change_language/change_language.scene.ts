import { ExtraService } from '@core/extra';
import { IContext } from '@libs/shared/interfaces';
import { Langs } from '@libs/shared/types';
import { ActionContract, SceneContract } from '@shared/decorators';
import { SceneEnter } from 'nestjs-telegraf';

@SceneContract('scenes.change_language')
export class ChangeLanguageScene {
    constructor(private readonly extra: ExtraService) {}

    @SceneEnter()
    async enter(ctx: IContext) {
        const { extra } = this;
        const { lang } = ctx.session;

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.change_language',
            ...extra.typedInlineKeyboard([['languages.en', 'languages.ru'], ['buttons.back']], lang),
        });
    }

    @ActionContract(['languages.ru', 'languages.en'])
    async switchLanguage(ctx: IContext) {
        const langFromCallback: Langs = ctx.callbackQuery.data.split('.')[1] as Langs;
        const langFromSession: Langs = ctx.session.lang;

        if (ctx.session.lang === langFromCallback) {
            await this.extra.replyAlert(ctx, langFromSession, {
                text: 'alerts.language_already_exists',
                args: { lang: langFromSession },
            });
            return;
        }

        ctx.session.lang = langFromCallback;

        await ctx.scene.reenter();
    }

    @ActionContract('buttons.back')
    async back(ctx: IContext) {
        await ctx.scene.enter('scenes.home');
    }
}
