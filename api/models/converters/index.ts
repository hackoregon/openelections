import OrestarContributionConverter, { ContributionConvertType } from './orestarContributionConverter';
import OrestarExpenditureConverter, { ExpenditureConvertType } from './orestarExpenditureConverter';

// import { Expenditure } from '../entity/Expenditure';
// import { Contribution } from '../entity/Contribution';

export function convertContributionsToXML(contributions: any, filerId: number | string): string {

  const contributionsArray = [];
  const baseNum = 2000;
  const totalLoops = Math.ceil(contributions.data.length / baseNum);
  for (let i = 0; i < totalLoops; i++) {
    const contacts: string[] = [];
    const transactions: string[] = [];
    const currentSet = contributions.data.slice(i === 0 ? i : (i * baseNum), (i + 1) * baseNum);
    currentSet.map( (contribution: any, index: number ): void => {
      const converter = new OrestarContributionConverter(contribution);
      const { contact, transaction }: ContributionConvertType = converter.convert();
      contacts.push(contact);
      transactions.push(transaction);
    });
    // removed from campaign-finance-transaction: xmlns="http://www.state.or.us/sos/ebs2/ce/dataobject"
    contributionsArray.push(`<campaign-finance-transactions ${process.env.NODE_ENV === 'production' ? 'xmlns="http://www.state.or.us/sos/ebs2/ce/dataobject"' : ''} filer-id="${filerId}">${contacts.join('')}${transactions.join('')}</campaign-finance-transactions>`);
  }
  return JSON.stringify(contributionsArray);
}

export function convertExpendituresToXML(expenditures: any, filerId: number | string): string {

  const expendituresArray = [];
  const baseNum = 2000;
  const totalLoops = Math.ceil(expenditures.data.length / baseNum);

  for (let i = 0; i < totalLoops; i++) {
    const contacts: string[] = [];
    const transactions: string[] = [];
    const currentSet = expenditures.data.slice(i === 0 ? i : (i * baseNum), (i + 1) * baseNum);
    currentSet.map( (expenditure: any, index: number ): void => {
      const converter = new OrestarExpenditureConverter(expenditure);
      const { contact, transaction }: ExpenditureConvertType = converter.convert();
      contacts.push(contact);
      transactions.push(transaction);
    });
    // removed from campaign-finance-transaction: xmlns="http://www.state.or.us/sos/ebs2/ce/dataobject"
    expendituresArray.push(`<campaign-finance-transactions ${process.env.NODE_ENV === 'production' ? 'xmlns="http://www.state.or.us/sos/ebs2/ce/dataobject"' : ''} filer-id="${filerId}">${contacts.join('')}${transactions.join('')}</campaign-finance-transactions>`);
  }
  return JSON.stringify(expendituresArray);
}

