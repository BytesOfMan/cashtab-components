// @flow

import React from 'react';

import { storiesOf } from '@storybook/react/dist/client/preview';
import { array, select, text, boolean, number } from '@storybook/addon-knobs';

import PriceDisplay from './PriceDisplay';
import { currencyOptions } from '../../utils/currency-helpers';
import {
	getCurrencyPreSymbol,
	formatPriceDisplay,
	formatAmount,
} from '../../utils/badger-helpers';

const coinTypeOptions = ['BCH', 'SLP'];

// [ NAKAMOTO, DOGECASH, BROC ]
const tokenIdOptions = [
	'df808a41672a0a0ae6475b44f272a107bc9961b90f29dc918d71301f24fe92fb',
	'3916a24a051f8b3833a7fd128be51dd93015555ed9142d6106ec03267f5cdc4c',
	'259908ae44f46ef585edef4bcc1e50dc06e4c391ac4be929fae27235b8158cf1',
];

storiesOf('Price Display', module)
	.addDecorator((story) => (
		<div style={{ display: 'inline-block', minWidth: 150 }}>{story()}</div>
	))
	.add(
		'fiat',
		() => {
			const currency = select('Currency', currencyOptions, 'USD');
			const price = number('Price', 0.001);

			return (
				<PriceDisplay
					preSymbol={getCurrencyPreSymbol(currency)}
					price={formatPriceDisplay(price)}
					symbol={currency}
				/>
			);
		},
		{
			notes: 'Displaying fiat currencies',
		}
	)
	.add(
		'bch',
		() => {
			const price = number('Price', 0.001);
			const satoshis = price * 1e8;

			return (
				<PriceDisplay
					coinType="BCH"
					price={formatAmount(satoshis, 8)}
					symbol="BCH"
					name="Bitcoin Cash"
				/>
			);
		},
		{
			notes: 'Displaying BCH ',
		}
	)
	.add(
		'slp',
		() => {
			const price = number('Price', 0.001);
			const satoshis = price * 1e8;

			return (
				<PriceDisplay
					coinType="SLP"
					price={formatAmount(satoshis, 8)}
					symbol="DOGE"
					name="DOGECASH"
				/>
			);
		},
		{
			notes: 'Displaying SLP tokens',
		}
	);
