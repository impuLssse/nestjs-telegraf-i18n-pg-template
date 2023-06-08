import { I18nPath } from '@shared/types';
import { Action } from 'nestjs-telegraf';

export function ActionContract(callback_data: I18nPath | I18nPath[]): MethodDecorator {
    return Action(callback_data as string[]);
}
