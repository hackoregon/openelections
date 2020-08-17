import { IContributionsGeoJson, getContributionsGeoJsonAsync } from '../models/entity/Contribution';
import { IGetContributionGeoJsonOptions } from './contributionService';

export async function getExternalContributionsGeoAsync(attrs: IGetContributionGeoJsonOptions): Promise<IContributionsGeoJson> {
  return getContributionsGeoJsonAsync(attrs);
}
