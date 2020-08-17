import { IContributionsGeoJson } from '../models/entity/Contribution';
import { IGetContributionGeoJsonOptions } from './contributionService';
import { geExternalContributionsGeoJsonAsync } from '../models/entity/ExternalContribution';

export async function getExternalContributionsGeoAsync(attrs: IGetContributionGeoJsonOptions): Promise<IContributionsGeoJson> {
  return geExternalContributionsGeoJsonAsync(attrs);
}
