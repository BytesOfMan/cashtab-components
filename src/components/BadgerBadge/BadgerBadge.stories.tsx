// @flow

import React from 'react';

import { storiesOf } from '@storybook/react/dist/client/preview';
import { array, boolean, number, select, text } from '@storybook/addon-knobs';

import BadgerBadge from './BadgerBadge';

import { currencyOptions } from '../../utils/currency-helpers';

const defaultOpReturn = [
    '0x6d02',
    'Try out Badger at https://badger.bitcoin.com',
];

const coinTypeOptions = ['BCH', 'SLP'];

// [ SPICE, NAKAMOTO, DOGECASH, BROC ]
const tokenIdOptions = [
    '4de69e374a8ed21cbddd47f2338cc0f479dc58daa2bbe11cd604ca488eca0ddf',
    'df808a41672a0a0ae6475b44f272a107bc9961b90f29dc918d71301f24fe92fb',
    '3916a24a051f8b3833a7fd128be51dd93015555ed9142d6106ec03267f5cdc4c',
    '259908ae44f46ef585edef4bcc1e50dc06e4c391ac4be929fae27235b8158cf1',
];

storiesOf('BadgerBadge', module)
    .add(
        'most knobs',
        () => (
            <BadgerBadge
                price={number('Price', 0.0025)}
                currency={select('Currency', currencyOptions, 'USD')}
                to={text(
                    'To Address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
                opReturn={array('OP_RETURN', [])}
                tag={text('Button Text', 'Badger Pay')}
                text={text('Top Text', 'Payment Total')}
                isRepeatable={boolean('Repeatable payment', false)}
                repeatTimeout={number('Repeat Timeout (ms)', 4000)}
                watchAddress={boolean('Watch Address All', true)}
                showBrand={boolean('Toggle Brand', false)}
                showAmount={boolean('Toggle Amount', true)}
                showQR={boolean('Toggle QR', true)}
                showBorder={boolean('Toggle Border', false)}
                successFn={() => console.log('success')}
                failFn={() => console.log('fail')}
            />
        ),
        {
            notes:
                'Badger Badges are perfect for showing the price and amount in a simple clean all in one component.  Default has knobs to experiment with all settings',
        },
    )
    .add(
        'minimal look',
        () => (
            <BadgerBadge
                amount={0.0001}
                to={text(
                    'To Address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
                text={''}
                showAmount={false}
                showQR={boolean('Toggle QR', true)}
            />
        ),
        {
            notes: 'Minimal look of Badge',
        },
    )
    .add(
        'price in fiat',
        () => (
            <BadgerBadge
                price={number('Price', 0.0025)}
                currency={select('Currency', currencyOptions, 'USD')}
                to={text(
                    'To Address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
                successFn={() => console.log('success')}
                failFn={() => console.log('fail')}
            />
        ),
        {
            notes:
                'Pay in any currency, and automagically convert the amount to BCH',
        },
    )
    .add(
        'price in BCH',
        () => (
            <BadgerBadge
                coinType="BCH"
                amount={number('Amount', 0.0001)}
                to={text(
                    'To Address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
            />
        ),
        {
            notes: 'Price in BCH absolute value',
        },
    )
    .add(
        'price in SLP tokens',
        () => (
            <BadgerBadge
                to={text(
                    'To Address',
                    'simpleledger:qq6qcjt6xlkeqzdwkhdvfyl2q2d2wafkgg8phzcqez',
                )}
                coinType="SLP"
                tokenId={
                    text('Token ID', '') ||
                    select('Token ID Select', tokenIdOptions, tokenIdOptions[0])
                }
                amount={number('Amount', 5)}
                tag="Send Tokens"
                text="Send SLP Tokens"
            />
        ),
        {
            notes: 'Enter the token ID and send whichever SLP tokens you want!',
        },
    )
    .add(
        'custom text',
        () => (
            <BadgerBadge
                price={0.0025}
                currency={'USD'}
                to={text(
                    'To Address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
                tag={text('Button Text', 'And the CTA')}
                text={text('Top Text', 'Customize the Title')}
                successFn={() => console.log('success')}
                failFn={() => console.log('fail')}
            />
        ),
        {
            notes: 'Customize the title and button text',
        },
    )
    .add(
        'toggle QR code',
        () => (
            <BadgerBadge
                price={number('Price', 0.0025)}
                to={text(
                    'To Address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
                showQR={boolean('Toggle QR', false)}
                successFn={() => console.log('success')}
                failFn={() => console.log('fail')}
            />
        ),
        {
            notes:
                'Optional QR code in addition to Button.  Only shows if transaction fully compatible in a URI',
        },
    )
    .add(
        'toggle coin amount',
        () => (
            <BadgerBadge
                price={0.0025}
                to={text(
                    'To Address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
                showAmount={boolean('Show Satoshis', false)}
                successFn={() => console.log('success')}
                failFn={() => console.log('fail')}
            />
        ),
        {
            notes: 'Choose to show the coin or token amount',
        },
    )
    .add(
        'toggle badger info',
        () => (
            <BadgerBadge
                price={0.0025}
                to={text(
                    'To Address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
                showBrand={boolean('Badger info', true)}
                successFn={() => console.log('success')}
                failFn={() => console.log('fail')}
            />
        ),
        {
            notes: 'Choose to display a link to the Badger homepage',
        },
    )
    .add(
        'toggle border',
        () => (
            <BadgerBadge
                price={0.0025}
                showBorder={boolean('Toggle Border', true)}
                to={text(
                    'To Address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
            />
        ),
        {
            notes: 'Toggle border',
        },
    )
    .add(
        'repeatable payments',
        () => (
            <BadgerBadge
                price={number('Price', 0.0025)}
                to={text(
                    'To Address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
                isRepeatable={boolean('Repeatable payment', true)}
                repeatTimeout={number('Reset Timeout (ms)', 5000)}
            />
        ),
        {
            notes:
                'Payments which can happen more than once on a single page visit.  Games for example',
        },
    )
    .add(
        'payment functions',
        () => (
            <BadgerBadge
                price={0.0025}
                to={text(
                    'To Address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
                successFn={() => alert('Custom Success function called')}
                failFn={() => alert('Custom Fail / Cancel function called ')}
            />
        ),
        {
            notes: 'Custom functions called on Successful and Failed payments',
        },
    )
    .add(
        'OP_RETURN',
        () => (
            <BadgerBadge
                price={0.0025}
                currency={'USD'}
                opReturn={array('OP_RETURN', defaultOpReturn)}
                text="With OP_RETURN"
                to={text(
                    'To Address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
            />
        ),
        {
            notes: 'Modify the OP_RETURN value when paid with Badger wallet',
        },
    )
    .add(
        'watch all sources',
        () => (
            <BadgerBadge
                amount={0.0001}
                to={text(
                    'To Address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
                watchAddress={boolean('watch Address All', true)}
            />
        ),
        {
            notes:
                'if watchAddress is true, the payment will turn to confirmed when the address receives a payment from any source.  Including other people.  This is ideal to use if the payment codes are unique for the checkout.  Not great if the payment address is shared by users.',
        },
    )
    .add(
        'controlled step',
        () => (
            <BadgerBadge
                amount={0.0001}
                to={text(
                    'To Address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
                stepControlled={select(
                    'step',
                    ['fresh', 'pending', 'complete'],
                    'fresh',
                )}
            />
        ),
        {
            notes:
                'Controlled step overrides the component step state.  Valuable for payment systems where the app/backend does payment confirmation.',
        },
    )
    .add(
        'BIP70 Invoicing - BCH, expired',
        () => (
            <BadgerBadge
                paymentRequestUrl={text(
                    'Invoice URL',
                    //'https://yourInvoiceUrlHere.com/String'
                    'https://pay.bitcoin.com/i/7UG3Z5y56DoXLQzQJAJxoD',
                )}
                showAmount={boolean('showAmount', true)}
                successFn={() => console.log('BIP70 Invoice successfully paid')}
                failFn={() =>
                    console.log(
                        'BIP70 Invoice is expired or the URL is invalid',
                    )
                }
            />
        ),
        {
            notes: 'Expired BCH invoice with no conflicting props',
        },
    )
    .add(
        'BIP70 Invoicing - SLP, Paid',
        () => (
            <BadgerBadge
                paymentRequestUrl={text(
                    'Invoice URL',
                    //'https://yourInvoiceUrlHere.com/String'
                    'https://pay.bitcoin.com/i/DFFwn544tB2A2YvekWd3Y9',
                )}
                showAmount={boolean('showAmount', true)}
                successFn={() => console.log('BIP70 Invoice successfully paid')}
                failFn={() =>
                    console.log(
                        'BIP70 Invoice is expired or the URL is invalid',
                    )
                }
            />
        ),
        {
            notes: 'Paid SLP invoice with no conflicting props',
        },
    );
