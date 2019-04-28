import { Campaign } from '../models/entity/Campaign';
import { Government } from '../models/entity/Government';
import { getConnection } from 'typeorm';

export interface ICreateCampaign {
    name: string;
    governmentId: number;
}

export async function createCampaignAsync(campaignAttrs: ICreateCampaign): Promise<Campaign> {
    const campaignRepository = getConnection('default').getRepository('Campaign');
    const governmnentRepository = getConnection('default').getRepository('Government');
    governmnentRepository.findOne(campaignAttrs.governmentId).then(
        (government => {
            const campaign = new Campaign();
            campaign.name = campaignAttrs.name;
            campaign.government = government;
            return campaignRepository.save(campaign);
        })
    );
}
