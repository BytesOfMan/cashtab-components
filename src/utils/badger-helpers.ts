// @flow
// Currency endpoints, logic, converters and formatters

import BigNumber from 'bignumber.js';
import { currencySymbolMap, type CurrencyCode } from './currency-helpers';

const buildPriceEndpoint = (currency: CurrencyCode) => {
	return `https://markets.api.bitcoin.com/rates/convertor?c=BCH&q=${currency}`;
};

const getAddressUnconfirmed = async (address: string): Promise<string[]> => {
	const transactionsRequest = await fetch(
		`https://rest.bitcoin.com/v2/address/unconfirmed/${address}`
	);
	const result = await transactionsRequest.json();
	return result.utxos || [];
};

const getTokenInfo = async (coinId: string): Promise<any> => {
	const tokenInfoRequest = await fetch(
		`https://rest.bitcoin.com/v2/slp/list/${coinId}`
	);
	const tokenInfo = await tokenInfoRequest.json();
	return tokenInfo;
};

const getCurrencyPreSymbol = (currency: CurrencyCode) => {
	return currencySymbolMap[currency];
};

const formatPriceDisplay = (price: ?number): ?number => {
	if (!price) return null;
	if (price > 1) {
		return price
			.toLocaleString('en-US', {
				style: 'currency',
				currency: 'USD',
			})
			.slice(1);
	} else {
		return +price.toFixed(5);
	}
};

const formatAmount = (amount: ?number, decimals: ?number): string => {
	if (decimals == null) {
		return '-.--------';
	}
	if (!amount) {
		return `-.`.padEnd(decimals + 2, '-');
	}
	const baseAmount = new BigNumber(amount);
	const adjustDecimals = baseAmount.shiftedBy(-1 * decimals).toFixed(decimals);
	const removeTrailing = +adjustDecimals + '';

	return removeTrailing;
};

const priceToSatoshis = (BCHRate: number, price: number): string => {
	const singleDollarValue = new BigNumber(BCHRate);
	const satoshisPerBCH = new BigNumber(100000000);
	const singleDollarSatoshis = satoshisPerBCH.div(singleDollarValue);

	return (+singleDollarSatoshis.times(price).integerValue(BigNumber.ROUND_FLOOR)).toString();
};

const priceToFiat = (BCHRate: number, price: number): number => {
	const singleDollarValue = new BigNumber(BCHRate);
	return +singleDollarValue.times(price);
};

const fiatToSatoshis = async (
	currency: CurrencyCode,
	price: number
): Promise<string> => {
	const priceRequest = await fetch(buildPriceEndpoint(currency));
	const result = await priceRequest.json();
	const fiatPrice = result[currency].rate;
	const satoshis = priceToSatoshis(fiatPrice, price);
	return satoshis;
};

const bchToFiat = async (
	currency: CurrencyCode,
	price: number
): Promise<number> => {
	const priceRequest = await fetch(buildPriceEndpoint(currency));
	const result = await priceRequest.json();
	const fiatPrice = result[currency].rate;

	const fiatInvoiceTotal = priceToFiat(fiatPrice, price);
	return fiatInvoiceTotal;
};

const adjustAmount = (
	amount?: string | number,
	decimals: number | undefined,
	fromSatoshis: ?boolean
): ?string => {
	decimals = decimals || 0;
	const shiftBy = !fromSatoshis ? decimals : decimals * -1;

	return amount ? new BigNumber(amount).shiftedBy(shiftBy).toString() : null;
};

export {
	adjustAmount,
	buildPriceEndpoint,
	fiatToSatoshis,
	bchToFiat,
	formatAmount,
	formatPriceDisplay,
	getAddressUnconfirmed,
	getCurrencyPreSymbol,
	getTokenInfo,
	priceToSatoshis,
};
