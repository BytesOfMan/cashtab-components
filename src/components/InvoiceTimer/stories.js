// @flow

import React from 'react';

import { storiesOf } from '@storybook/react/dist/client/preview';
import { array, select, text, boolean, number } from '@storybook/addon-knobs';

import InvoiceTimer from './InvoiceTimer';

storiesOf('Invoice Timer', module)
    .addDecorator(story => (
        <div style={{ display: 'inline-block', minWidth: 150 }}>{story()}</div>
    ))
    .add(
        'Default',
        () => {
            return <InvoiceTimer invoiceTimeLeftSeconds={600} />;
        },
        {
            notes: 'Default display',
        },
    );
