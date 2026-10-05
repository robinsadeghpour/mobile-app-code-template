import fs from 'node:fs';
import path from 'node:path';

import { TABLET_BREAKPOINT } from './useIsTablet';

describe('TABLET_BREAKPOINT', () => {
  it('equals --breakpoint-tablet in global.css', () => {
    const css = fs.readFileSync(path.join(__dirname, '..', 'global.css'), 'utf8');

    expect(Number(css.match(/--breakpoint-tablet:\s*(\d+)px/)?.[1])).toBe(TABLET_BREAKPOINT);
  });
});
