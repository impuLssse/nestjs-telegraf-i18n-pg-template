import { I18nPath } from '@shared/types';
import { Scene } from 'nestjs-telegraf';

export function SceneContract(sceneId: I18nPath): ClassDecorator {
    return Scene(sceneId as string);
}
