import { Injectable } from '@nestjs/common';
import { BotConst } from '@shared/constants';
import { IBotContext, IContext } from '@shared/interfaces';
import { InjectBot } from 'nestjs-telegraf';
import { InlineKeyboardMarkup, ReplyKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class BotService {
    constructor(@InjectBot(BotConst.NAME) private readonly bot: IBotContext) {}

    async sendMessage(
        ctx: IContext,
        text: string,
        keyboard: { reply_markup: InlineKeyboardMarkup | ReplyKeyboardMarkup },
    ) {
        const { id: chatId } = ctx.chat;

        await this.bot.telegram.sendMessage(chatId, text, {
            parse_mode: 'HTML',
            ...keyboard,
        });
    }
}
