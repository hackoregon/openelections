import { IContributionsGeoJson, getContributionsGeoJsonAsync } from '../models/entity/Contribution';

export interface IGetContributionGeoJsonOptions {
  from?: string;
  to?: string;
}

export async function getExternalContributionsGeoAsync(attrs: IGetContributionGeoJsonOptions): Promise<IContributionsGeoJson> {
  return getContributionsGeoJsonAsync(attrs);
}
