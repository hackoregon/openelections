import { Campaign } from '../models/entity/Campaign';
import { Government } from '../models/entity/Government';
import { getConnection } from 'typeorm';

export interface ICreateCampaign {
    name: string;
    governmentId: number;
}

export async function createCampaignAsync(campaignAttrs: ICreateCampaign): Promise<Campaign> {
    const campaignRepository = getConnection('default').getRepository('Campaign');
    const governmentRepository = getConnection('default').getRepository('Government');
    const campaign = new Campaign();
    campaign.name = campaignAttrs.name;
    const government = await governmentRepository.findOne(campaignAttrs.governmentId) as Government;
    campaign.government = government;
    if (await campaign.isValidAsync()) {
        await campaignRepository.save(campaign);
    }
    return campaign;
}
