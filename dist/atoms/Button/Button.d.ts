import * as React from 'react';
import type { ButtonStates } from '../../hoc/CashtabBase';
declare type Props = {
    step: ButtonStates;
    children: React.ReactNode;
    onClick?: Function;
};
declare class Button extends React.PureComponent<Props> {
    render(): JSX.Element;
}
export default Button;
