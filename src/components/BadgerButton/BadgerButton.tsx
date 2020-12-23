// @flow

import * as React from 'react';
import styled from 'styled-components';

import {
    getCurrencyPreSymbol,
    formatPriceDisplay,
    formatAmount,
} from '../../utils/badger-helpers';

import type { CurrencyCode } from '../../utils/currency-helpers';

import colors from '../../styles/colors';

import BitcoinCashImage from '../../images/bitcoin-cash.svg';
import SLPLogoImage from '../../images/slp-logo.png';

import BadgerBase from '../../hoc/BadgerBase';

import type {
    ButtonStates,
    BadgerBaseProps,
    ValidCoinTypes,
} from '../../hoc/BadgerBase';

import PriceDisplay from '../PriceDisplay';
import InvoiceTimer from '../InvoiceTimer';

import Button from '../../atoms/Button';
import ButtonQR from '../../atoms/ButtonQR';
import Small from '../../atoms/Small';
import Text from '../../atoms/Text';

const SatoshiText = styled.p`
    font-size: 12px;
    margin: 0;
    display: grid;
    grid-template-columns: max-content max-content max-content;
    justify-content: end;
    grid-gap: 5px;
    align-items: center;
`;

const Outer = styled.div`
    display: grid;
    grid-template-columns: max-content;
`;

const Wrapper = styled('div')<{ hasBorder?: boolean }>`
    display: grid;
    grid-gap: 5px;
    font-family: sans-serif;
    grid-template-columns: max-content;
    grid-template-rows: max-content max-content max-content;
    color: ${colors.fg500};
    padding: 6px;
    border: ${props =>
        props.hasBorder ? `1px dashed ${colors.brand700}` : 'none'};
    border-radius: 4px;
`;

const PriceText = styled.p`
    font-family: monospace;
    font-size: 16px;
    line-height: 1em;
    margin: 0;
    display: grid;
    grid-gap: 5px;
    grid-auto-flow: column;
    justify-content: flex-end;
    align-items: center;
`;

interface invoiceInfoOutputsObjs {
    token_id: string;
    send_amounts: string;
}

interface invoiceInfoObj {
    fiatTotal?: number;
    currency?: string;
    outputs?: Array<invoiceInfoOutputsObjs>;
}

// Badger Button Props
type Props = BadgerBaseProps & {
    text?: string;

    showAmount?: boolean;
    showBorder?: boolean;
    showQR?: boolean;

    coinSymbol: string;
    coinDecimals?: number;
    coinName?: string;

    invoiceInfo?: invoiceInfoObj;
    invoiceTimeLeftSeconds?: number;
    invoiceFiat?: number;

    handleClick: Function;
    step: ButtonStates;
};

class BadgerButton extends React.PureComponent<Props> {
    static defaultProps = {
        showAmount: true,
        showBorder: false,
    };

    render() {
        const {
            to,
            step,
            handleClick,

            currency,
            price,

            coinType,
            coinSymbol,
            coinDecimals,
            coinName,

            amount,
            showAmount,

            text,
            showBorder,
            showQR,
            paymentRequestUrl,

            invoiceInfo,
            invoiceTimeLeftSeconds,
            invoiceFiat,
        } = this.props;

        const CoinImage = coinType === 'BCH' ? BitcoinCashImage : SLPLogoImage;

        // buttonPriceDisplay -- handle different cases for BIP70 invoices

        // buttonPriceDisplay if no price, or if a bip70 invoice is set from a server without supported websocket updates
        let buttonPriceDisplay = <Text>Badger Pay</Text>;

        // buttonPriceDisplay of price set in props and no invoice is set
        if (price && !paymentRequestUrl) {
            buttonPriceDisplay = (
                <Text>
                    {getCurrencyPreSymbol(currency)} {formatPriceDisplay(price)}
                    <Small> {currency}</Small>
                </Text>
            );
            // buttonPriceDisplay if valid bip70 invoice with price information is available
        } else if (paymentRequestUrl && invoiceFiat !== undefined) {
            buttonPriceDisplay = (
                <Text>
                    {getCurrencyPreSymbol(currency)}{' '}
                    {formatPriceDisplay(invoiceFiat)}
                    <Small> {currency}</Small>
                </Text>
            );
        }

        let determinedShowAmount = (
            <PriceDisplay
                coinType={coinType}
                price={formatAmount(amount, coinDecimals)}
                symbol={coinSymbol}
                name={coinName}
            />
        );
        if (!showAmount) {
            determinedShowAmount = <React.Fragment></React.Fragment>;
        } else if (
            showAmount &&
            paymentRequestUrl &&
            (!invoiceInfo || !invoiceInfo.currency)
        ) {
            determinedShowAmount = <PriceText>BIP70 Invoice</PriceText>;
        }
        return (
            <Outer>
                <Wrapper hasBorder={showBorder}>
                    <Text style={{ textAlign: 'center' }}>{text}</Text>
                    {showQR ? (
                        <ButtonQR
                            amountSatoshis={amount}
                            toAddress={to}
                            onClick={handleClick}
                            step={step}
                            paymentRequestUrl={paymentRequestUrl}
                        >
                            {buttonPriceDisplay}
                        </ButtonQR>
                    ) : (
                        <Button onClick={handleClick} step={step}>
                            {buttonPriceDisplay}
                        </Button>
                    )}

                    {determinedShowAmount}

                    {invoiceTimeLeftSeconds !== null && (
                        <InvoiceTimer
                            invoiceTimeLeftSeconds={invoiceTimeLeftSeconds}
                        />
                    )}
                </Wrapper>
            </Outer>
        );
    }
}

export default BadgerBase(BadgerButton);
