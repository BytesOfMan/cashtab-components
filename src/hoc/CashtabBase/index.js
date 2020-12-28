/*
Note

For whatever reason, `npm run storybook-build` will error out if this file is renamed to index.ts to fix the 
ts errors below

Possibly invites stricter checks

TODO correct issue by fixing all other lint bugs and seeing if this can be renamed to .ts
*/

import CashtabBase from './CashtabBase';

import type {
    ButtonStates,
    CashtabBaseProps,
    ValidCoinTypes,
} from './CashtabBase';

export type { ButtonStates, CashtabBaseProps, ValidCoinTypes };

export default CashtabBase;
