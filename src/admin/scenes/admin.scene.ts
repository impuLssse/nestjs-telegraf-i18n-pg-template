import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@libs/shared/decorators';
import { IContext } from '@libs/shared/interfaces';
import { SceneEnter } from 'nestjs-telegraf';

@SceneContract('scenes.admin')
export class AdminScene {
    constructor(private readonly extra: ExtraService) {}

    @SceneEnter()
    async enter(ctx: IContext) {
        const { extra } = this;
        const { lang } = ctx.session;

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.admin',
        });
    }
}
