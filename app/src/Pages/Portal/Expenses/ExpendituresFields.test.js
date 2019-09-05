import React from 'react';
import { fields } from './ExpendituresFields';

const formFieldKeys = [
  'amount',
  'date',
  'expenditureType',
  'expenditureSubType',
  'paymentMethod',
  'checkNumber',
  'purposeType',
  'payeeType',
  'payeeName',
  'streetAddress',
  'addressLine2',
  'city',
  'state',
  'zipcode',
  'notes',
];

describe('fields', () => {
  it('should have the expected field keys', () => {
    Object.keys(fields).every(field => formFieldKeys.includes(field));
  });
});
