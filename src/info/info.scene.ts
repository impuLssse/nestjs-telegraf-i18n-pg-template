import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@libs/shared/decorators';
import { IContext } from '@libs/shared/interfaces';
import { SceneEnter } from 'nestjs-telegraf';

@SceneContract('scenes.faq')
export class InfoScene {
    constructor(private readonly extra: ExtraService) {}

    @SceneEnter()
    async enter(ctx: IContext) {
        const { extra } = this;
        const { lang } = ctx.session;

        await extra.replyOrEdit(ctx, ctx.session.lang, {
            text: 'phrases.faq',
            ...extra.typedInlineKeyboard([['buttons.back']], lang),
        });
    }

    @ActionContract('buttons.back')
    async back(ctx: IContext) {
        await ctx.scene.enter('scenes.home');
    }
}
