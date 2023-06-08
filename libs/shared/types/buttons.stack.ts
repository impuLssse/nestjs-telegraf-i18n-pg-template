import { I18nPath } from '@shared/types';
import { IButton } from '@shared/interfaces';

export type ButtonsStack = IButton[] | IButton[][] | I18nPath[] | I18nPath[][] | (IButton[] | I18nPath[])[];
