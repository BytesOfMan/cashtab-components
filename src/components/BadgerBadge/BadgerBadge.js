// @flow

import * as React from 'react';
import styled, { css } from 'styled-components';

import {
	getCurrencyPreSymbol,
	formatPriceDisplay,
	formatAmount,
} from '../../utils/badger-helpers';

import { type CurrencyCode } from '../../utils/currency-helpers';

import BadgerBase, {
	type ButtonStates,
	type BadgerBaseProps,
	type ValidCoinTypes,
} from '../../hoc/BadgerBase';

import BitcoinCashImage from '../../images/bitcoin-cash.svg';
import SLPLogoImage from '../../images/slp-logo.png';

import colors from '../../styles/colors';

import PriceDisplay from '../PriceDisplay';
import InvoiceTimer from '../InvoiceTimer';

import Button from '../../atoms/Button';
import ButtonQR from '../../atoms/ButtonQR';
import Small from '../../atoms/Small';
import Text from '../../atoms/Text';
import H3 from '../../atoms/H3';

const PRICE_UPDATE_INTERVAL = 60 * 1000;

const Outer = styled.div`
	display: grid;
	grid-template-columns: max-content;
`;

const Main = styled.div`
	font-family: sans-serif;
	display: grid;
	grid-gap: 12px;
	padding: 12px 12px 6px;

	${(props) =>
		props.showBorder &&
		css`
			border: 1px dashed ${colors.brand500};
			border-radius: 4px;
		`}
`;

const Prices = styled.div`
	display: grid;
	/* grid-template-columns: max-content max-content; */
	grid-gap: 5px;
	align-items: end;
	justify-content: end;
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

const ButtonContainer = styled.div`
	min-height: 40px;
	display: grid;
	grid-gap: 7px;
	align-items: center;
	justify-content: flex-end;
	width: 100%;
`;

const BrandBottom = styled.div`
	display: flex;
	justify-content: flex-end;
`;

const A = styled.a`
	color: ${colors.fg500};
	text-decoration: none;
	&:hover {
		color: ${colors.brand500};
	}
`;

// Badger Badger Props
type Props = BadgerBaseProps & {
	text?: string,
	tag?: string,
	step: ButtonStates,

	showAmount?: boolean,
	coinSymbol: string,
	coinName: string,
	coinAmount: number,
	coinDecimals?: number,

	showBrand?: boolean,
	showQR?: boolean,
	showBorder?: boolean,

	invoiceInfo: ?Object,
	invoiceTimeLeftSeconds: ?number,
	invoiceFiat: ?number,

	handleClick: Function,
};

class BadgerBadge extends React.PureComponent<Props> {
	static defaultProps = {
		currency: 'USD',
		tag: 'Badger Pay',
		text: 'Payment Total',
		showAmount: true,
		showBrand: false,
		showQR: true,
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
			coinName,
			coinDecimals,
			amount,

			text,
			tag,

			showAmount,
			showQR,
			paymentRequestUrl,
			invoiceInfo,
			invoiceTimeLeftSeconds,
			invoiceFiat,
			showBorder,
			showBrand,
		} = this.props;

		const CoinImage = coinType === 'BCH' ? BitcoinCashImage : SLPLogoImage;

		// Handle cases for displaying price
		// Case 1: no bip70 invoice
		// Case 2: bip70 invoice, supported pay.bitcoin.com invoice with websocket info over-riding props, showAmount={true}
		// Case 3: bip70 invoice, no supported websocket price updating, only display a "Bip70 invoice" label and no cointype or price, OR valid invoice but showAmount={false}; a bip70 invoice must be labeled as such even if showAmount={false} and price in props must be over-ridden

		// Case 1: no bip70 invoice
		let displayedPriceInfo = (
			<Prices>
				{price != undefined && (
					<PriceDisplay
						preSymbol={getCurrencyPreSymbol(currency)}
						price={formatPriceDisplay(price)}
						symbol={currency}
					/>
				)}
				{showAmount && (
					<PriceDisplay
						coinType={coinType}
						price={formatAmount(amount, coinDecimals)}
						symbol={coinSymbol}
						name={coinName}
					/>
				)}
			</Prices>
		);
		// Case 2: bip70 invoice, supported pay.bitcoin.com invoice with websocket info over-riding props, showAmount={true}
		if (showAmount && paymentRequestUrl && invoiceInfo.currency) {
			displayedPriceInfo = (
				<Prices>
					{invoiceFiat != undefined && (
						<PriceDisplay
							preSymbol={getCurrencyPreSymbol(currency)}
							price={formatPriceDisplay(invoiceFiat)}
							symbol={currency}
						/>
					)}

					<PriceDisplay
						coinType={coinType}
						price={formatAmount(amount, coinDecimals)}
						symbol={coinSymbol}
						name={coinName}
					/>
				</Prices>
			);
			// Case 3: bip70 invoice, no supported websocket price updating, only display a "Bip70 invoice" label and no cointype or price, OR valid invoice but showAmount={false}
			// Bip70 invoice must be labeled as such if amounts are not shown
		} else if (paymentRequestUrl) {
			displayedPriceInfo = (
				<Prices>
					<PriceText>BIP70 Invoice</PriceText>
				</Prices>
			);
		}
		return (
			<Outer>
				<Main showBorder={showBorder}>
					<H3>{text}</H3>
					{displayedPriceInfo}
					{invoiceTimeLeftSeconds !== null && (
						<InvoiceTimer invoiceTimeLeftSeconds={invoiceTimeLeftSeconds} />
					)}
					<ButtonContainer>
						{showQR ? (
							<ButtonQR
								onClick={handleClick}
								step={step}
								amountSatoshis={amount}
								toAddress={to}
								paymentRequestUrl={paymentRequestUrl}
							>
								<Text>{tag}</Text>
							</ButtonQR>
						) : (
							<Button onClick={handleClick} step={step}>
								<Text>{tag}</Text>
							</Button>
						)}

						{(step === 'install' || showBrand) && (
							<BrandBottom>
								<Small>
									<A href="badger.bitcoin.com" target="_blank">
										What is Badger
									</A>
								</Small>
							</BrandBottom>
						)}
					</ButtonContainer>
				</Main>
			</Outer>
		);
	}
}

export default BadgerBase(BadgerBadge);
