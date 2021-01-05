/// <reference types="lodash" />
import * as React from 'react';
import type { ButtonStates, CashtabBaseProps } from '../../hoc/CashtabBase';
declare type CashtabButtonProps = CashtabBaseProps & {
    text?: string;
    showAmount?: boolean;
    showBorder?: boolean;
    showQR?: boolean;
    coinSymbol: string;
    coinDecimals?: number;
    coinName?: string;
    handleClick: Function;
    step: ButtonStates;
};
export type { CashtabButtonProps };
declare const _default: {
    new (props: CashtabBaseProps | Readonly<CashtabBaseProps>): {
        state: {
            step: ButtonStates;
            satoshis: undefined;
            coinSymbol: undefined;
            coinDecimals: undefined;
            coinName: undefined;
            unconfirmedCount: undefined;
            intervalPrice: undefined;
            intervalUnconfirmed: undefined;
            intervalTimer: undefined;
            errors: never[];
        };
        addError: (error: string) => void;
        startRepeatable: () => void;
        paymentSendSuccess: () => void;
        getCashTabProviderStatus: () => boolean;
        handleClick: () => void;
        updateSatoshisFiat: import("lodash").DebouncedFunc<() => Promise<void>>;
        setupSatoshisFiat: () => void;
        setupWatchAddress: () => Promise<void>;
        setupCoinMeta: () => Promise<void>;
        confirmCashTabProviderStatus: () => void;
        componentDidMount(): Promise<void>;
        componentWillUnmount(): void;
        componentDidUpdate(prevProps: CashtabBaseProps, prevState: import("../../hoc/CashtabBase/CashtabBase").IState): void;
        render(): JSX.Element;
        context: any;
        setState<K extends "coinSymbol" | "coinDecimals" | "coinName" | "step" | "errors" | "satoshis" | "unconfirmedCount" | "intervalPrice" | "intervalUnconfirmed" | "intervalTimer">(state: import("../../hoc/CashtabBase/CashtabBase").IState | ((prevState: Readonly<import("../../hoc/CashtabBase/CashtabBase").IState>, props: Readonly<CashtabBaseProps>) => import("../../hoc/CashtabBase/CashtabBase").IState | Pick<import("../../hoc/CashtabBase/CashtabBase").IState, K> | null) | Pick<import("../../hoc/CashtabBase/CashtabBase").IState, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<CashtabBaseProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<CashtabBaseProps>, nextState: Readonly<import("../../hoc/CashtabBase/CashtabBase").IState>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<CashtabBaseProps>, prevState: Readonly<import("../../hoc/CashtabBase/CashtabBase").IState>): any;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<CashtabBaseProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<CashtabBaseProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<CashtabBaseProps>, nextState: Readonly<import("../../hoc/CashtabBase/CashtabBase").IState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<CashtabBaseProps>, nextState: Readonly<import("../../hoc/CashtabBase/CashtabBase").IState>, nextContext: any): void;
    };
    new (props: CashtabBaseProps, context: any): {
        state: {
            step: ButtonStates;
            satoshis: undefined;
            coinSymbol: undefined;
            coinDecimals: undefined;
            coinName: undefined;
            unconfirmedCount: undefined;
            intervalPrice: undefined;
            intervalUnconfirmed: undefined;
            intervalTimer: undefined;
            errors: never[];
        };
        addError: (error: string) => void;
        startRepeatable: () => void;
        paymentSendSuccess: () => void;
        getCashTabProviderStatus: () => boolean;
        handleClick: () => void;
        updateSatoshisFiat: import("lodash").DebouncedFunc<() => Promise<void>>;
        setupSatoshisFiat: () => void;
        setupWatchAddress: () => Promise<void>;
        setupCoinMeta: () => Promise<void>;
        confirmCashTabProviderStatus: () => void;
        componentDidMount(): Promise<void>;
        componentWillUnmount(): void;
        componentDidUpdate(prevProps: CashtabBaseProps, prevState: import("../../hoc/CashtabBase/CashtabBase").IState): void;
        render(): JSX.Element;
        context: any;
        setState<K extends "coinSymbol" | "coinDecimals" | "coinName" | "step" | "errors" | "satoshis" | "unconfirmedCount" | "intervalPrice" | "intervalUnconfirmed" | "intervalTimer">(state: import("../../hoc/CashtabBase/CashtabBase").IState | ((prevState: Readonly<import("../../hoc/CashtabBase/CashtabBase").IState>, props: Readonly<CashtabBaseProps>) => import("../../hoc/CashtabBase/CashtabBase").IState | Pick<import("../../hoc/CashtabBase/CashtabBase").IState, K> | null) | Pick<import("../../hoc/CashtabBase/CashtabBase").IState, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<CashtabBaseProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<CashtabBaseProps>, nextState: Readonly<import("../../hoc/CashtabBase/CashtabBase").IState>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<CashtabBaseProps>, prevState: Readonly<import("../../hoc/CashtabBase/CashtabBase").IState>): any;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<CashtabBaseProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<CashtabBaseProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<CashtabBaseProps>, nextState: Readonly<import("../../hoc/CashtabBase/CashtabBase").IState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<CashtabBaseProps>, nextState: Readonly<import("../../hoc/CashtabBase/CashtabBase").IState>, nextContext: any): void;
    };
    defaultProps: {
        currency: string;
        coinType: string;
        isRepeatable: boolean;
        watchAddress: boolean;
        showQR: boolean;
        repeatTimeout: number;
    };
    contextType?: React.Context<any> | undefined;
};
export default _default;
