import { type PropsWithChildren } from 'react';
import { HeroUINativeProvider } from 'heroui-native';

export function UiProvider({ children }: PropsWithChildren) {
  return <HeroUINativeProvider config={{ devInfo: { stylingPrinciples: false } }}>{children}</HeroUINativeProvider>;
}
