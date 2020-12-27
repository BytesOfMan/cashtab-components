// @flow

import React from 'react';

import { storiesOf } from '@storybook/react/dist/client/preview';
import { select, text, boolean, number } from '@storybook/addon-knobs';

import ButtonQR from './ButtonQR';
import Text from '../Text';

const ButtonText = 'CashTab Pay';
const props = {
    toAddress: 'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
    amountSatoshis: 550,
};

storiesOf('ButtonQR', module)
    .add(
        'default - all knobs',
        () => (
            <ButtonQR
                toAddress={text(
                    'To address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
                amountSatoshis={number('Satoshis', 550)}
                sizeQR={number('QR size', 125)}
                step={'fresh'}
            >
                <Text>{ButtonText}</Text>
            </ButtonQR>
        ),
        {
            notes:
                'Button is a stateful controlled component which is the primary visual indicator for the badger payment process',
        },
    )
    .add(
        'payment pending',
        () => (
            <ButtonQR
                toAddress={text(
                    'To address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
                amountSatoshis={number('Satoshis', 550)}
                step={'pending'}
            >
                <Text>{ButtonText}</Text>
            </ButtonQR>
        ),
        {
            notes: 'Awaiting a confirmation or cancellation of Badger popup',
        },
    )
    .add(
        'payment complete',
        () => (
            <ButtonQR
                toAddress={text(
                    'To address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
                amountSatoshis={number('Satoshis', 550)}
                step={'complete'}
            >
                <Text>{ButtonText}</Text>
            </ButtonQR>
        ),
        {
            notes: 'Payment received, at least on the front-end',
        },
    )
    .add(
        'login prompt',
        () => (
            <ButtonQR
                toAddress={text(
                    'To address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
                amountSatoshis={number('Satoshis', 550)}
                step={'login'}
            >
                <Text>{ButtonText}</Text>
            </ButtonQR>
        ),
        {
            notes: 'user not logged in, prompt to login',
        },
    )
    .add(
        'install prompt',
        () => (
            <ButtonQR
                toAddress={text(
                    'To address',
                    'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
                )}
                amountSatoshis={number('Satoshis', 550)}
                step={'install'}
            >
                <Text>{ButtonText}</Text>
            </ButtonQR>
        ),
        {
            notes: 'Badger plugin not installed, prompt user to install Badger',
        },
    )
    .add(
        'expired',
        () => (
            <ButtonQR
                paymentRequestUrl={text(
                    'Invoice URL',
                    // expired invoice
                    'https://pay.bitcoin.com/i/Fz4AaMpzuSde9DgpFwDt13',
                )}
                step={'expired'}
            >
                <Text>{ButtonText}</Text>
            </ButtonQR>
        ),
        {
            notes: 'Shown for an expired BIP70 invoice',
        },
    );
