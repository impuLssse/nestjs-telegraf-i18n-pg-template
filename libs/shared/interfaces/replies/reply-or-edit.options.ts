import { I18nPath } from '../../types';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

export interface IReplyOrEditOptions {
    text: I18nPath;
    args?: any;
    reply_markup?: InlineKeyboardMarkup;
}
