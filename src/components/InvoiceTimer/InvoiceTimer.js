// @flow

import * as React from 'react';
import styled from 'styled-components';

const TimeText = styled.p`
	font-family: monospace;
	font-size: 12px;
	font-weight: 700;
	line-height: 10px;
	margin: 0;
	display: grid;
	text-align: right;
	color: ${({ alert = false }) => (alert === true ? 'red' : '#000')};
`;

// Invoice Timer

// Turn red if less than 1:00 left
// align right so alignment doesn't change when time goes from 10:00 to 9:59
// Only render if the invoice is active; not paid or expired
type Props = {
	invoiceTimeLeftSeconds: ?number,
};

class InvoiceTimer extends React.PureComponent<Props> {
	render() {
		const { invoiceTimeLeftSeconds } = this.props;

		const timeLeftMinutes = Math.floor(invoiceTimeLeftSeconds / 60);
		const remainderSeconds = invoiceTimeLeftSeconds % 60;

		const formattedMinutes = `${timeLeftMinutes}`.padStart(2, '0');
		const formattedSeconds = `${remainderSeconds}`.padStart(2, '0');
		const formattedTime = `${formattedMinutes}:${formattedSeconds}`;
		const isAlert = timeLeftMinutes < 1;

		return <TimeText alert={isAlert}>{formattedTime}</TimeText>;
	}
}

export default InvoiceTimer;
