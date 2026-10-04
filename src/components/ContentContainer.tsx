import React from 'react';
import { useWindowDimensions, View } from 'react-native';

type ContentContainerProps = {
  children: React.ReactNode;
};

export const TABLET_BREAKPOINT = 700;
export const CONTENT_MAX_WIDTH = 860;

export function useIsTablet(): boolean {
  const { width } = useWindowDimensions();
  return width >= TABLET_BREAKPOINT;
}

export const ContentContainer: React.FC<ContentContainerProps> = ({ children }) => (
  <View className="tablet:max-w-[860px] w-full self-center">{children}</View>
);
