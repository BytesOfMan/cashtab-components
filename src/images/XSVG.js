// @flow

import React from 'react';
import styled from 'styled-components';

import colors from '../styles/colors';

import H3 from '../atoms/H3';

const ExpiredLabel = styled(H3)`
	color: ${colors.expired700};
`;

const XSVG = () => <ExpiredLabel>Invoice Expired</ExpiredLabel>;

export default XSVG;
