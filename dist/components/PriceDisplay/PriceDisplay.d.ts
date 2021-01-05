import * as React from 'react';
import type { ValidCoinTypes } from '../../hoc/CashtabBase';
declare type Props = {
    price?: string;
    symbol: string;
    coinType?: ValidCoinTypes;
    preSymbol?: string;
    name?: string;
};
declare class PriceDisplay extends React.PureComponent<Props> {
    render(): JSX.Element;
}
export default PriceDisplay;
