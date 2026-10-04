import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';

import { CONTENT_MAX_WIDTH, ContentContainer, TABLET_BREAKPOINT } from './ContentContainer';

describe('ContentContainer', () => {
  it('keeps TABLET_BREAKPOINT equal to --breakpoint-tablet in global.css', () => {
    const css = fs.readFileSync(path.join(__dirname, '..', 'global.css'), 'utf8');
    const declared = css.match(/--breakpoint-tablet:\s*(\d+)px/);

    expect(declared).not.toBeNull();
    expect(Number(declared?.[1])).toBe(TABLET_BREAKPOINT);
  });

  it('caps its width at CONTENT_MAX_WIDTH', async () => {
    await render(
      <ContentContainer>
        <Text>content</Text>
      </ContentContainer>,
    );

    expect(screen.toJSON()?.props.className).toContain(`max-w-[${CONTENT_MAX_WIDTH}px]`);
  });
});
