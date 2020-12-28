import * as React from 'react';

import debounce from 'lodash/debounce';
import BigNumber from 'bignumber.js';

import {
    fiatToSatoshis,
    bchToFiat,
    adjustAmount,
    getAddressUnconfirmed,
    getTokenInfo,
} from '../../utils/cashtab-helpers';

import Ticker from '../../atoms/Ticker'

import bitcoincomLink from 'bitcoincom-link';

import type { CurrencyCode } from '../../utils/currency-helpers';
// Note: seems like there is a type bug in bitcoincomLink
// Even if not, you are not using it here, so no worries
const {
    sendAssets,
    payInvoice,
} = bitcoincomLink;

const getCashTabProviderStatus = () => {
    console.log(`getCashTabProviderStatus`)
    console.log(window.bitcoinAbc)
    if (
                    window &&
                    window.bitcoinAbc &&
                    window.bitcoinAbc === 'cashtab'
    ) {
        return true;
    }
    return false;
        

}

declare global {
    interface Window {
        bitcoinAbc: any;
    }
}

interface sendParamsArr {
    to: string;
    protocol: ValidCoinTypes;
    value?: string;
    assetId?: string;
    opReturn?: string[];
}

const SECOND = 1000;

const PRICE_UPDATE_INTERVAL = 60 * SECOND;
const REPEAT_TIMEOUT = 4 * SECOND;
const URI_CHECK_INTERVAL = 10 * SECOND;

// Whitelist of valid coinType.
type ValidCoinTypes = string;

// TODO - Login/Install are Cashtab (login to be removed) states, others are payment states.  Separate them to be independent
type ButtonStates =
    | 'fresh'
    | 'pending'
    | 'complete'
    | 'expired'
    | 'login'
    | 'install';

interface invoiceInfoOutputsObjs {
    token_id: string;
    send_amounts: string;
}

interface invoiceInfoObj {
    fiatTotal?: number;
    currency?: string;
    outputs?: Array<invoiceInfoOutputsObjs>;
}

type CashtabBaseProps = {
    to: string;
    stepControlled?: ButtonStates;

    // Both present to price in fiat equivalent
    currency: CurrencyCode;
    price?: number;

    // Both present to price in coinType absolute amount
    coinType: ValidCoinTypes;
    tokenId?: string;
    amount?: number;

    isRepeatable: boolean;
    repeatTimeout: number;
    watchAddress: boolean;

    opReturn?: string[];
    showQR: boolean; // Intent to show QR.  Only show if amount is BCH or fiat as OP_RETURN and SLP do not work with QR

    // Support for BIP070 Invoices
    paymentRequestUrl?: string;

    successFn?: Function;
    failFn?: Function;
};

interface IState {
    step: ButtonStates;
    errors: string[];

    satoshis?: number; // Used when converting fiat to BCH
    invoiceFiat?: number; // Used to show USD cost of a BCH BIP70 invoice

    coinSymbol?: string;
    coinName?: string;
    coinDecimals?: number;
    unconfirmedCount?: number;
    invoiceInfo?: invoiceInfoObj;
    invoiceTimeLeftSeconds?: number;

    intervalPrice?: NodeJS.Timeout;
    intervalInvoicePrice?: NodeJS.Timeout;
    intervalLogin?: NodeJS.Timeout;
    intervalUnconfirmed?: NodeJS.Timeout;
    intervalTimer?: NodeJS.Timeout;

    websocketInvoice?: WebSocket;
}

const CashtabBase = (Wrapped: React.ComponentType<any>) => {
    return class extends React.Component<CashtabBaseProps, IState> {
        static defaultProps = {
            currency: 'USD',
            coinType: Ticker.coinSymbol,

            isRepeatable: false,
            watchAddress: false,
            showQR: true,
            repeatTimeout: REPEAT_TIMEOUT,
        };

        state = {
            step: 'fresh' as ButtonStates,

            satoshis: undefined,
            coinSymbol: undefined,
            coinDecimals: undefined,
            coinName: undefined,

            unconfirmedCount: undefined,
            invoiceInfo: undefined,
            invoiceFiat: undefined,
            invoiceTimeLeftSeconds: undefined,

            intervalPrice: undefined,
            intervalInvoicePrice: undefined,
            intervalLogin: undefined,
            intervalUnconfirmed: undefined,
            intervalTimer: undefined,
            errors: [],

            websocketInvoice: undefined,
        };

        addError = (error: string) => {
            const { errors } = this.state;
            this.setState({ errors: [...errors, error] });
        };

        startRepeatable = () => {
            const { repeatTimeout } = this.props;
            setTimeout(() => this.setState({ step: 'fresh' }), repeatTimeout);
        };

        paymentSendSuccess = () => {
            const { isRepeatable } = this.props;
            const {
                intervalUnconfirmed,
                unconfirmedCount,
                intervalTimer,
            } = this.state;

            let unconfirmedCountInt;

            if (typeof unconfirmedCount === 'undefined') {
                unconfirmedCountInt = 0;
            } else {
                unconfirmedCountInt = unconfirmedCount;
            }

            this.setState({
                step: 'complete',
                unconfirmedCount: unconfirmedCountInt
                    ? unconfirmedCountInt + 1
                    : 1,
            });

            if (isRepeatable) {
                this.startRepeatable();
            } else {
                intervalUnconfirmed && clearInterval(intervalUnconfirmed);
            }
            // If invoice is paid, clear timer, and set secondsLeft to null to hide clock
            intervalTimer && clearInterval(intervalTimer);
            this.setState({ invoiceTimeLeftSeconds: undefined });
        };

        invoiceExpired = () => {
            const { intervalTimer } = this.state;
            this.setState({
                step: 'expired',
            });
            intervalTimer && clearInterval(intervalTimer);
            this.setState({ invoiceTimeLeftSeconds: undefined });
        };

        handleClick = () => {
            const {
                amount,
                price,
                to,
                successFn,
                failFn,
                opReturn,
                coinType,
                tokenId,
                paymentRequestUrl,
            } = this.props;

            const { satoshis } = this.state;

            // Satoshis might not set be set during server rendering
            if (!amount && !satoshis && !paymentRequestUrl) {
                return;
            }

            if (
                window &&
                window.bitcoinAbc &&
                window.bitcoinAbc === 'cashtab'
            ) {
                console.log(`Cash tab present, dispatching msg`);
                console.log(`Amount here is`, amount)
                console.log(`satoshis here`, satoshis)
                return window.postMessage(
                    {
                        type: 'FROM_PAGE',
                        text: 'CashTab',
                        txInfo: {
                            address: to,
                            value: typeof satoshis !== 'undefined' ? satoshis/1e8 : amount,
                        },
                    },
                    '*',
                );
            }

            

            const walletProviderStatus = getCashTabProviderStatus();            

            if (
                typeof window === `undefined` ||
                (!walletProviderStatus)
            ) {
                this.setState({ step: 'install' });

                if (typeof window !== 'undefined') {
                    window.open(Ticker.installLink);
                }
                return;
            }
            
            if (
                walletProviderStatus
            ) {
                this.setState({ step: 'fresh' });
                return;
            }

            if (paymentRequestUrl) {
                this.setState({ step: 'pending' });
                console.info('Cashtab payInvoice begin', paymentRequestUrl);
                payInvoice({ url: paymentRequestUrl })
                    .then(({ memo }: any) => {
                        console.info('Cashtab send success:', memo);
                        successFn && successFn(memo);
                        this.paymentSendSuccess();
                    })
                    .catch((err: object) => {
                        console.info('Cashtab send cancel', err);
                        failFn && failFn(err);
                        this.setState({ step: 'fresh' });
                    });
                return;
            }

            const sendParams: sendParamsArr = {
                to,
                protocol: coinType,
                value: amount?.toString() || adjustAmount(satoshis, 8, true),
            };
            if (coinType === Ticker.tokenTicker) {
                sendParams.assetId = tokenId;
            }

            if (opReturn && opReturn.length) {
                sendParams.opReturn = opReturn;
            }

            this.setState({ step: 'pending' });
            console.info('Cashtab sendAssets begin', sendParams);
            sendAssets(sendParams)
                .then(({ txid }: any) => {
                    console.info('Cashtab send success:', txid);
                    successFn && successFn(txid);
                    this.paymentSendSuccess();
                })
                .catch((err: any) => {
                    console.info('Cashtab send cancel', err);
                    failFn && failFn(err);
                    this.setState({ step: 'fresh' });
                });
        };

        gotoLoginState = () => {
            // Obsolete for CashTab
            // For now, set to 'install'
            this.setState({ step: 'install' });            
        };

        updateSatoshisFiat = debounce(
            async () => {
                const { price, currency } = this.props;

                if (!price) return;
                const satoshis = await fiatToSatoshis(currency, price);
                this.setState({ satoshis });
            },
            250,
            { leading: true, trailing: true },
        );

        setupSatoshisFiat = () => {
            const { intervalPrice } = this.state;
            intervalPrice && clearInterval(intervalPrice);

            this.updateSatoshisFiat();
            const intervalPriceNext = setInterval(
                () => this.updateSatoshisFiat(),
                PRICE_UPDATE_INTERVAL,
            );

            this.setState({ intervalPrice: intervalPriceNext });
        };

        updateInvoiceFiat = debounce(
            async () => {
                const { currency } = this.props;
                const { invoiceInfo } = this.state;

                if (
                    !invoiceInfo ||
                    !invoiceInfo.fiatTotal ||
                    invoiceInfo.currency !== Ticker.coinSymbol
                )
                    return;
                const invoicePriceBCH = invoiceInfo.fiatTotal;

                const invoiceFiat = await bchToFiat(currency, invoicePriceBCH);
                this.setState({ invoiceFiat });
            },
            250,
            { leading: true, trailing: true },
        );

        setupInvoiceFiat = () => {
            const { intervalInvoicePrice } = this.state;
            intervalInvoicePrice && clearInterval(intervalInvoicePrice);

            this.updateInvoiceFiat();
            const intervalInvoicePriceNext = setInterval(
                () => this.updateInvoiceFiat(),
                PRICE_UPDATE_INTERVAL,
            );

            this.setState({ intervalInvoicePrice: intervalInvoicePriceNext });
        };

        setupWatchAddress = async () => {
            const { to } = this.props;
            const { intervalUnconfirmed } = this.state;

            intervalUnconfirmed && clearInterval(intervalUnconfirmed);

            const initialUnconfirmed = await getAddressUnconfirmed(to);
            this.setState({ unconfirmedCount: initialUnconfirmed.length });

            // Watch UTXO interval
            const intervalUnconfirmedNext = setInterval(async () => {
                const prevUnconfirmedCount = this.state.unconfirmedCount;
                const targetTransactions = await getAddressUnconfirmed(to);
                const unconfirmedCount = targetTransactions.length;

                this.setState({ unconfirmedCount });
                if (
                    prevUnconfirmedCount != null &&
                    unconfirmedCount > prevUnconfirmedCount
                ) {
                    this.paymentSendSuccess();
                }
            }, URI_CHECK_INTERVAL);

            this.setState({ intervalUnconfirmed: intervalUnconfirmedNext });
        };

        setupWatchInvoice = async () => {
            const { paymentRequestUrl, successFn } = this.props;

            if (!paymentRequestUrl) {
                return;
            }

            const urlParts = paymentRequestUrl.split('/');
            const server = urlParts[2];
            if (server !== 'pay.bitcoin.com') {
                // InvoiceTimer and showAmount fields are only supported for pay.bitcoin.com invoices
                return;
            }

            const paymentId = urlParts[urlParts.length - 1];
            const ws = new WebSocket(`wss://pay.bitcoin.com/s/${paymentId}`);

            ws.onopen = () => {
                this.setState({ websocketInvoice: ws });
            };

            ws.onmessage = evt => {
                // listen to data sent from the websocket server
                const invoiceInfo = JSON.parse(evt.data);

                const invoiceStatus = invoiceInfo.status; // for InvoiceDisplay

                this.setState({ invoiceInfo }, this.setupInvoiceFiat);
                this.setupCoinMeta(invoiceInfo);

                if (invoiceStatus === 'paid') {
                    successFn && successFn();
                    return this.paymentSendSuccess();
                }
                if (invoiceStatus === 'expired') {
                    return this.invoiceExpired();
                }

                // If invoice is not expired or paid, start the timer (add this logic after timer works) TODO
                // Get current UTC time for timer
                const nowUTC = Date.now();

                const invoiceExpiresAt = Date.parse(invoiceInfo.expires);

                let invoiceTimeLeftSeconds = Math.round(
                    (invoiceExpiresAt - nowUTC) / 1000,
                );

                if (invoiceTimeLeftSeconds > 0) {
                    this.setState({ invoiceTimeLeftSeconds });
                }
            };
        };

        setupInvoiceTimer = () => {
            // start timer
            const intervalTimerNext = setInterval(() => {
                const prevInvoiceTimeLeftSeconds = this.state
                    .invoiceTimeLeftSeconds;
                if (prevInvoiceTimeLeftSeconds === 1) {
                    return this.invoiceExpired();
                }

                const newInvoiceTimeLeftSeconds = prevInvoiceTimeLeftSeconds
                    ? prevInvoiceTimeLeftSeconds - 1
                    : 0;
                this.setState({
                    invoiceTimeLeftSeconds: newInvoiceTimeLeftSeconds,
                });
            }, 1000);

            this.setState({ intervalTimer: intervalTimerNext });
        };

        setupCoinMeta = async (invoiceInfo: invoiceInfoObj = {}) => {
            const { coinType, tokenId, paymentRequestUrl } = this.props;

            if (
                invoiceInfo !== {} &&
                invoiceInfo.currency &&
                invoiceInfo.currency !== Ticker.coinSymbol &&
                invoiceInfo.outputs &&
                invoiceInfo.outputs[0] &&
                invoiceInfo.outputs[0].token_id
            ) {
                const invoiceTokenId = invoiceInfo.outputs[0].token_id;
                const invoiceTokenInfo = await getTokenInfo(invoiceTokenId);

                const { symbol, decimals, name } = invoiceTokenInfo;

                this.setState({
                    coinSymbol: symbol,
                    coinDecimals: decimals,
                    coinName: name,
                });
            } else if (
                (!paymentRequestUrl && coinType === Ticker.coinSymbol) ||
                (invoiceInfo !== null && invoiceInfo.currency === Ticker.coinSymbol)
            ) {
                this.setState({
                    coinSymbol: Ticker.coinSymbol,
                    coinDecimals: Ticker.coinDecimals,
                    coinName: Ticker.coinName,
                });
            } else if (!paymentRequestUrl && coinType === Ticker.tokenTicker && tokenId) {
                this.setState({
                    coinSymbol: undefined,
                    coinName: undefined,
                    coinDecimals: undefined,
                });
                const tokenInfo = await getTokenInfo(tokenId);

                const { symbol, decimals, name } = tokenInfo;
                this.setState({
                    coinSymbol: symbol,
                    coinDecimals: decimals,
                    coinName: name,
                });
            }
        };

        confirmCashTabProviderStatus = () => {
            console.log(`confirmCashTabProviderStatus called`)
            const cashTabStatus = getCashTabProviderStatus()
            if (cashTabStatus) {
                this.setState({ step: 'fresh' });
            }
        }

        async componentDidMount() {
            if (typeof window !== 'undefined') {
                const { price, watchAddress, paymentRequestUrl } = this.props;

                // setup state, intervals, and listeners
                watchAddress && this.setupWatchAddress();
                paymentRequestUrl && this.setupWatchInvoice(); // sets up websocket for invoice which calls setupCoinMeta() when the necessary information has been received
                price && this.setupSatoshisFiat();
                !paymentRequestUrl && this.setupCoinMeta(); // normal call for setupCoinMeta()

                // Detect CashTab and determine if button should show CTA
                console.log(`window`, window)
                console.log(`window.bitcoinAbc`, window.bitcoinAbc)
                const cashTabProviderStatus = getCashTabProviderStatus();
                console.log(`cashtabProviderStatus`, cashTabProviderStatus)                
                
                // Occasionially the cashtab window object is not available on componentDidMount, check later
                // TODO make this less hacky
                setTimeout(this.confirmCashTabProviderStatus, 750);

                // Detect CashTab and determine if button should show install CTA
                const walletProviderStatus = getCashTabProviderStatus();
                if (
                    walletProviderStatus
                ) {
                    this.setState({ step: 'fresh' });
                }
                else {
                    this.setState({ step: 'install' });
                }                
            }
        }

        componentWillUnmount() {
            const {
                intervalPrice,
                intervalInvoicePrice,
                intervalLogin,
                intervalUnconfirmed,
                websocketInvoice,
                intervalTimer,
            } = this.state;
            intervalPrice && clearInterval(intervalPrice);
            intervalInvoicePrice && clearInterval(intervalInvoicePrice);
            intervalLogin && clearInterval(intervalLogin);
            intervalUnconfirmed && clearInterval(intervalUnconfirmed);
            intervalTimer && clearInterval(intervalTimer);
            websocketInvoice && websocketInvoice.close();
        }

        componentDidUpdate(prevProps: CashtabBaseProps, prevState: IState) {
            if (typeof window !== 'undefined') {
                const {
                    currency,
                    price,
                    isRepeatable,
                    watchAddress,
                    tokenId,
                    paymentRequestUrl,
                } = this.props;
                const {
                    invoiceTimeLeftSeconds,
                    websocketInvoice,
                    intervalInvoicePrice,
                    intervalTimer,
                } = this.state;

                const prevCurrency = prevProps.currency;
                const prevPrice = prevProps.price;
                const prevIsRepeatable = prevProps.isRepeatable;
                const prevWatchAddress = prevProps.watchAddress;
                const prevTokenId = prevProps.tokenId;
                const prevPaymentRequestUrl = prevProps.paymentRequestUrl;

                const prevInvoiceTimeLeftSeconds =
                    prevState.invoiceTimeLeftSeconds;

                if (paymentRequestUrl !== prevPaymentRequestUrl) {
                    // clear all invoice intervals and websockets
                    intervalTimer && clearInterval(intervalTimer);
                    intervalInvoicePrice && clearInterval(intervalInvoicePrice);
                    websocketInvoice && websocketInvoice.close();
                    // reset all invoice info, then set it up again
                    this.setState({
                        step: 'fresh',
                        invoiceInfo: undefined,
                        invoiceFiat: undefined,
                        invoiceTimeLeftSeconds: undefined,
                    });
                    this.setupWatchInvoice();
                }
                if (
                    invoiceTimeLeftSeconds !== null &&
                    prevInvoiceTimeLeftSeconds === null
                ) {
                    this.setupInvoiceTimer();
                }

                // Fiat price or currency changes
                if (currency !== prevCurrency || price !== prevPrice) {
                    this.setupSatoshisFiat();
                }

                if (isRepeatable && isRepeatable !== prevIsRepeatable) {
                    this.startRepeatable();
                }

                if (tokenId !== prevTokenId && !paymentRequestUrl) {
                    this.setupCoinMeta();
                }

                if (watchAddress !== prevWatchAddress) {
                    if (watchAddress) {
                        this.setupWatchAddress();
                    } else {
                        const { intervalUnconfirmed } = this.state;
                        intervalUnconfirmed &&
                            clearInterval(intervalUnconfirmed);
                    }
                }
            }
        }

        render() {
            const {
                amount,
                showQR,
                opReturn,
                coinType,
                stepControlled,
                paymentRequestUrl,
            } = this.props;
            const {
                step,
                satoshis,
                coinDecimals,
                coinSymbol,
                coinName,
                invoiceInfo,
                invoiceTimeLeftSeconds,
                invoiceFiat,
            } = this.state;

            let calculatedAmount =
                adjustAmount(amount, coinDecimals, false) || satoshis;

            // If this is a BIP70 invoice with a specified BCH amount, use that
            if (
                paymentRequestUrl &&
                invoiceInfo &&
                invoiceInfo.currency === Ticker.coinSymbol
            ) {
                calculatedAmount =
                    adjustAmount(invoiceInfo.fiatTotal, coinDecimals, false) ||
                    undefined;
            } else if (
                paymentRequestUrl &&
                invoiceInfo &&
                invoiceInfo.currency === Ticker.tokenTicker &&
                invoiceInfo.outputs &&
                invoiceInfo.outputs[0]
            ) {
                // Sum up the SLP amounts from invoiceInfo.outputs[0].send_amounts
                const amounts = invoiceInfo.outputs[0].send_amounts;

                let calculatedAmountBig = new BigNumber(0);
                for (let i = 0; i < amounts.length; i++) {
                    const thisAmount = new BigNumber(amounts[i])
                    
                    calculatedAmountBig = calculatedAmountBig.plus(thisAmount)
                    
                }
                calculatedAmount = calculatedAmountBig.toString()
            }

            // Only show QR if all requested features can be encoded in the BIP44 URI, or if it's a BIP70 invoice
            const shouldShowQR =
                (showQR &&
                    coinType === Ticker.coinSymbol &&
                    (!opReturn || !opReturn.length)) ||
                paymentRequestUrl;

            // Show SLP icon if BIP70 invoice is for SLP
            let determinedCoinType = coinType;
            if (
                paymentRequestUrl &&
                coinSymbol !== Ticker.coinSymbol &&
                coinSymbol !== null
            ) {
                determinedCoinType = Ticker.tokenTicker;
            }
            if (paymentRequestUrl && coinSymbol === Ticker.coinSymbol) {
                determinedCoinType = Ticker.coinSymbol;
            }            

            return (
                <Wrapped
                    {...this.props}
                    coinType={determinedCoinType}
                    showQR={shouldShowQR}
                    handleClick={this.handleClick}
                    step={stepControlled || step}
                    amount={calculatedAmount}
                    coinDecimals={coinDecimals}
                    coinSymbol={coinSymbol}
                    coinName={coinName}
                    invoiceInfo={invoiceInfo}
                    invoiceTimeLeftSeconds={invoiceTimeLeftSeconds}
                    invoiceFiat={invoiceFiat}
                />
            );
        }
    };
};

export type { CashtabBaseProps, ButtonStates, ValidCoinTypes };

export default CashtabBase;
