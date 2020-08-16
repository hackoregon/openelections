import { Response } from 'express';
import { IRequest } from '../routes/helpers';
import { getExternalContributionsGeoAsync } from '../services/externalContributionService';

export async function getExternalContributionsGeo(request: IRequest, response: Response, next: Function) {
  try {
      const contributions = await getExternalContributionsGeoAsync({ from: request.query.from, to: request.query.to});
      return response.status(200).send(contributions);
  } catch (err) {
      return response.status(422).json({ message: err.message });
  }
}