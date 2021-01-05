/// <reference types="node" />
/// <reference types="lodash" />
import * as React from 'react';
import type { CurrencyCode } from '../../utils/currency-helpers';
declare global {
    interface Window {
        bitcoinAbc: any;
    }
}
declare type ValidCoinTypes = string;
declare type ButtonStates = 'fresh' | 'pending' | 'complete' | 'expired' | 'install';
declare type CashtabBaseProps = {
    to: string;
    stepControlled?: ButtonStates;
    currency: CurrencyCode;
    price?: number;
    coinType: ValidCoinTypes;
    tokenId?: string;
    amount?: number;
    isRepeatable: boolean;
    repeatTimeout: number;
    watchAddress: boolean;
    opReturn?: string[];
    showQR: boolean;
    successFn?: Function;
    failFn?: Function;
};
interface IState {
    step: ButtonStates;
    errors: string[];
    satoshis?: number;
    coinSymbol?: string;
    coinName?: string;
    coinDecimals?: number;
    unconfirmedCount?: number;
    intervalPrice?: NodeJS.Timeout;
    intervalUnconfirmed?: NodeJS.Timeout;
    intervalTimer?: NodeJS.Timeout;
}
declare const CashtabBase: (Wrapped: React.ComponentType<any>) => {
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
        componentDidUpdate(prevProps: CashtabBaseProps, prevState: IState): void;
        render(): JSX.Element;
        context: any;
        setState<K extends "step" | "errors" | "satoshis" | "coinSymbol" | "coinName" | "coinDecimals" | "unconfirmedCount" | "intervalPrice" | "intervalUnconfirmed" | "intervalTimer">(state: IState | ((prevState: Readonly<IState>, props: Readonly<CashtabBaseProps>) => IState | Pick<IState, K> | null) | Pick<IState, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<CashtabBaseProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<CashtabBaseProps>, nextState: Readonly<IState>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<CashtabBaseProps>, prevState: Readonly<IState>): any;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<CashtabBaseProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<CashtabBaseProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<CashtabBaseProps>, nextState: Readonly<IState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<CashtabBaseProps>, nextState: Readonly<IState>, nextContext: any): void;
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
        componentDidUpdate(prevProps: CashtabBaseProps, prevState: IState): void;
        render(): JSX.Element;
        context: any;
        setState<K extends "step" | "errors" | "satoshis" | "coinSymbol" | "coinName" | "coinDecimals" | "unconfirmedCount" | "intervalPrice" | "intervalUnconfirmed" | "intervalTimer">(state: IState | ((prevState: Readonly<IState>, props: Readonly<CashtabBaseProps>) => IState | Pick<IState, K> | null) | Pick<IState, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<CashtabBaseProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<CashtabBaseProps>, nextState: Readonly<IState>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<CashtabBaseProps>, prevState: Readonly<IState>): any;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<CashtabBaseProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<CashtabBaseProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<CashtabBaseProps>, nextState: Readonly<IState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<CashtabBaseProps>, nextState: Readonly<IState>, nextContext: any): void;
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
export type { CashtabBaseProps, ButtonStates, ValidCoinTypes, IState };
export default CashtabBase;
