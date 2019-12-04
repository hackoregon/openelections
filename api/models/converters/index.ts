import OrestarContributionConverter from "./orestarContributionConverter";

// import { Expenditure } from '../entity/Expenditure';
// import { Contribution } from '../entity/Contribution';

export function convertContributionsToXML(contributions: any, filerId: number | string): string {

  const contributionsArray = [];
  const totalLoops = Math.ceil(contributions.data.length / 2000);

  for (let i = 0; i < totalLoops; i++) {
    console.log('working on set: ', i)
    const currentSet = contributions.data.slice(i === 0 ? i : (i * 2000) + 1, (i + 1) * 2000);
    const convertedContributions = currentSet.map( (contribution: any, index: number ): any => {
      const converter = new OrestarContributionConverter(contribution);
      console.log('processing ', index);
      return converter.convert();
    });

    contributionsArray.push(`<campaign-finance-transactions xmlns="http://www.state.or.us/sos/ebs2/ce/dataobject" filer-id="${filerId}">${convertedContributions.join()}</campaign-finance-transactions>`);
  }
  console.log(contributionsArray.length);
  return JSON.stringify(contributionsArray);
}

