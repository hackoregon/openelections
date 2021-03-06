import React from 'react';
import { fields } from './ContributionsFields';

const formFieldKeys = [
  'dateOfContribution',
  'typeOfContribution',
  'subTypeOfContribution',
  'typeOfContributor',
  'amountOfContribution',
  'oaeType',
  'paymentMethod',
  'checkNumber',
  'firstName',
  'lastName',
  'entityName',
  'streetAddress',
  'addressLine2',
  'city',
  'state',
  'zipcode',
  'email',
  'phone',
  'occupation',
  'employerName',
  'employerCity',
  'employerState',
  'inKindDescription',
  'occupationLetterDate',
  'linkToDocumentation',
  'notes',
];

describe('fields', () => {
  it('should have the expected field keys', () => {
    Object.keys(fields).every(field => formFieldKeys.includes(field));
  });
});
