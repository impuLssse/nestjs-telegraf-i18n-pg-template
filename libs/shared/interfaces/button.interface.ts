import { I18nPath } from '../types';

export interface IButton {
    text: I18nPath;
    callback_data?: string;
    args?: any;
    hide?: boolean;
}
