import OrestarContributionConverter from "./orestarContributionConverter";

// import { Expenditure } from '../entity/Expenditure';
// import { Contribution } from '../entity/Contribution';

export function convertContributionsToXML(contributions: any, filerId: number | string): string {

  const contributionsArray = [];
  const baseNum = 500;
  const totalLoops = Math.ceil(contributions.data.length / baseNum);
  console.log(contributions.data.length)
  for (let i = 0; i < totalLoops; i++) {
    const currentSet = contributions.data.slice(i === 0 ? i : (i * baseNum), (i + 1) * baseNum);
    const convertedContributions = currentSet.map( (contribution: any, index: number ): any => {
      const converter = new OrestarContributionConverter(contribution);
      return converter.convert();
    });
    contributionsArray.push(`<campaign-finance-transactions xmlns="http://www.state.or.us/sos/ebs2/ce/dataobject" filer-id="${filerId}">${convertedContributions.join()}</campaign-finance-transactions>`);
  }
  return JSON.stringify(contributionsArray);
}

