// @flow

import React from 'react';

import { storiesOf } from '@storybook/react/dist/client/preview';
import { array, select, text, boolean, number } from '@storybook/addon-knobs';

import BadgerButton from './BadgerButton';
import { currencyOptions } from '../../utils/currency-helpers';

const defaultOpReturn = [
	'0x6d02',
	'Learn to build on BCH at https://developer.bitcoin.com',
];

const coinTypeOptions = ['BCH', 'SLP'];

// [ SPICE, NAKAMOTO, DOGECASH, BROC ]
const tokenIdOptions = [
	'4de69e374a8ed21cbddd47f2338cc0f479dc58daa2bbe11cd604ca488eca0ddf',
	'df808a41672a0a0ae6475b44f272a107bc9961b90f29dc918d71301f24fe92fb',
	'3916a24a051f8b3833a7fd128be51dd93015555ed9142d6106ec03267f5cdc4c',
	'259908ae44f46ef585edef4bcc1e50dc06e4c391ac4be929fae27235b8158cf1',
];

storiesOf('BadgerButton', module)
	.add(
		'default',
		() => (
			<BadgerButton
				price={number('Price', 0.05)}
				currency={select('Currency', currencyOptions, 'USD')}
				to={text(
					'To Address',
					'bitcoincash:qppc593r2hhksvrz5l77n5yd6usrj74waqnqemgjgf'
				)}
				opReturn={array('OP_RETURN', [])}
				successFn={() => console.log('success example function called')}
				failFn={() => console.log('fail example function called')}
			/>
		),
		{
			notes:
				'Basic Badger Button.  Perfect for adding Badger integration to an existing flow, or in a minimal way.  Default has all the knobs to play with',
		}
	)
	.add(
		'most knobs',
		() => (
			<BadgerButton
				price={number('Price', 0.0025)}
				currency={select('Currency', currencyOptions, 'USD')}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				isRepeatable={boolean('repeatable', true)}
				repeatTimeout={number('repeat timeout (ms)', 4000)}
				opReturn={array('OP_RETURN', defaultOpReturn)}
				successFn={() => console.log('success example function called')}
				failFn={() => console.log('fail example function called')}
				text={text('Top Text', 'Badger Pay')}
				showAmount={boolean('Toggle coin amount', true)}
				showBorder={boolean('Toggle Border', true)}
				showQR={boolean('Show QR', false)}
			/>
		),
		{
			notes:
				'Play with all the props in the knobs tab to try out what BadgerButtons can do',
		}
	)
	.add(
		'minimal look',
		() => (
			<BadgerButton
				amount={0.0001}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				showSatoshis={false}
				showQR={boolean('QR?', true)}
			/>
		),
		{
			notes: 'minimal look',
		}
	)
	.add(
		'price in fiat',
		() => (
			<BadgerButton
				price={number('Price', 0.0025)}
				currency={select('Currency', currencyOptions, 'USD')}
				text="Pay with Badger"
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
			/>
		),
		{
			notes:
				'Change the currency and price to charge in any fiat currency equivalent of BCH',
		}
	)
	.add(
		'price in BCH',
		() => (
			<BadgerButton
				coinType="BCH"
				amount={number('Amount', 0.0001)}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
			/>
		),
		{
			notes: 'Without a text prop, it only shows the price',
		}
	)
	.add(
		'price in SLP tokens',
		() => (
			<BadgerButton
				to={text(
					'To Address',
					'simpleledger:qq6qcjt6xlkeqzdwkhdvfyl2q2d2wafkgg8phzcqez'
				)}
				coinType="SLP"
				tokenId={
					text('Token ID', '') ||
					select('Token ID select', tokenIdOptions, tokenIdOptions[0])
				}
				amount={number('Amount', 5)}
				text="Send SLP Tokens"
			/>
		),
		{
			notes: 'Enter the token ID and send whichever SLP tokens you want!',
		}
	)
	.add(
		'optional text',
		() => (
			<BadgerButton
				price={0.0025}
				currency={'USD'}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				text={text('text', 'Change this text in section below')}
				successFn={() => console.log('success example function called')}
				failFn={() => console.log('fail example function called')}
			/>
		),
		{
			notes: 'Without a text prop, it only shows the price',
		}
	)
	.add(
		'optional QR code',
		() => (
			<BadgerButton
				amount={0.0001}
				showQR={boolean('show QR', true)}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
			/>
		),
		{
			notes:
				'Optional QR code in addition to Button.  Only shows if transaction fully compatible in a URI',
		}
	)

	.add(
		'toggle coin amount',
		() => (
			<BadgerButton
				showAmount={boolean('Toggle coin amount', false)}
				price={0.0025}
				currency={'USD'}
				text="Pay now"
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
			/>
		),
		{
			notes: 'Choose to show the coin or token amount',
		}
	)
	.add(
		'toggle border',
		() => (
			<BadgerButton
				price={0.0025}
				showBorder={boolean('Toggle Border', true)}
				currency={'USD'}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
			/>
		),
		{
			notes: 'Change the currency and price',
		}
	)
	.add(
		'OP_RETURN',
		() => (
			<BadgerButton
				price={0.0025}
				currency={'USD'}
				opReturn={array('OP_RETURN', defaultOpReturn)}
				text="With OP_RETURN"
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
			/>
		),
		{
			notes: 'Change the currency and price',
		}
	)
	.add(
		'repeatable payments',
		() => (
			<BadgerButton
				amount={0.0001}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				isRepeatable={boolean('Repeatable payment', true)}
				repeatTimeout={number('Reset Timeout (ms)', 5000)}
			/>
		),
		{
			notes:
				'Payments which can happen more than once on a single page visit.  Games for example',
		}
	)
	.add(
		'watch all sources',
		() => (
			<BadgerButton
				amount={0.0001}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				watchAddress={boolean('Watch Address', true)}
			/>
		),
		{
			notes:
				'if watchAddress is true, the payment will turn to confirmed when the address receives a payment from any source.  Including other people.  This is ideal to use if the payment codes are unique for the checkout.  Not great if the payment address is shared by users.',
		}
	)
	.add(
		'controlled step',
		() => (
			<BadgerButton
				amount={0.0001}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				stepControlled={select(
					'step',
					['fresh', 'pending', 'complete'],
					'fresh'
				)}
			/>
		),
		{
			notes:
				'Controlled step overrides the component step state.  Valuable for payment systems where the app/backend does payment confirmation.',
		}
	)
	.add(
		'BIP70 Invoicing - BCH, expired',
		() => (
			<BadgerButton
				paymentRequestUrl={text(
					'Invoice URL',
					//'https://yourInvoiceUrlHere.com/String'
					'https://pay.bitcoin.com/i/7UG3Z5y56DoXLQzQJAJxoD'
				)}
				showAmount={boolean('showAmount', true)}
				successFn={() => console.log('BIP70 Invoice successfully paid')}
				failFn={() =>
					console.log('BIP70 Invoice is expired or the URL is invalid')
				}
			/>
		),
		{
			notes: 'Expired BCH invoice with no conflicting props',
		}
	)
	.add(
		'BIP70 Invoicing - SLP, Paid',
		() => (
			<BadgerButton
				paymentRequestUrl={text(
					'Invoice URL',
					//'https://yourInvoiceUrlHere.com/String'
					'https://pay.bitcoin.com/i/DFFwn544tB2A2YvekWd3Y9'
				)}
				showAmount={boolean('showAmount', true)}
				successFn={() => console.log('BIP70 Invoice successfully paid')}
				failFn={() =>
					console.log('BIP70 Invoice is expired or the URL is invalid')
				}
			/>
		),
		{
			notes: 'Paid SLP invoice with no conflicting props',
		}
	);
