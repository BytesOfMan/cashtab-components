import * as React from 'react';
import type { ButtonStates } from '../../hoc/CashtabBase';
declare type Props = {
    step: ButtonStates;
    children: React.ReactNode;
    toAddress: string;
    amountSatoshis?: number;
    sizeQR: number;
    onClick?: Function;
};
declare class ButtonQR extends React.PureComponent<Props> {
    static defaultProps: {
        sizeQR: number;
    };
    render(): JSX.Element;
}
export default ButtonQR;
