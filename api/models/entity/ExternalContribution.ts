import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  getConnection,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { IsDefined, validate, ValidationError } from 'class-validator';
import { ContributionType, ContributorType, IContributionsGeoJson } from './Contribution';
import { IGetContributionGeoJsonOptions } from '../../services/contributionService';
import { removeUndefined } from './helpers';

export enum ExternalContributionSubType {
  CASH = 'cash',
  INKIND_CONTRIBUTION = 'inkind_contribution',
  INKIND_PAID_SUPERVISION = 'inkind_paid_supervision',
  INKIND_FORGIVEN_ACCOUNT = 'inkind_forgiven_account',
  INKIND_FORGIVEN_PERSONAL = 'inkind_forgiven_personal',
  ITEM_SOLD_FAIR_MARKET = 'item_sold_fair_market',
  ITEM_RETURNED_CHECK = 'item_returned_check',
  ITEM_MISC = 'item_misc',
  ITEM_REFUND = 'item_refund',
  OTHER = 'other',
}

// Note, if you change any column type on the model, it will do a drop column operation, which means data loss in production.
@Entity('external_contributions')
export class ExternalContribution {
  // New: from Orestar
  @PrimaryColumn()
  @IsDefined()
  orestarOriginalId: string;

  // New: from Orestar
  @Column()
  @IsDefined()
  orestarTransactionId: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: ContributionType,
    default: ContributionType.CONTRIBUTION,
  })
  @IsDefined()
  type: ContributionType;

  @Column({
    type: 'enum',
    enum: ExternalContributionSubType,
  })
  @IsDefined()
  subType: ExternalContributionSubType;

  @Column({
    type: 'enum',
    enum: ContributorType,
  })
  @IsDefined()
  contributorType: ContributorType;

  @Column({ nullable: true })
  name?: string;

  @IsDefined()
  @Column()
  address1: string;

  @Column({ nullable: true })
  address2?: string;

  @IsDefined()
  @Column()
  city: string;

  @IsDefined()
  @Column()
  state: string;

  @IsDefined()
  @Column()
  zip: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({
    type: 'decimal',
    transformer: {
      to: (value: number): number => value,
      from: (value: string): number => parseFloat(value),
    },
  })
  amount: number;

  @Column({ nullable: true })
  occupation?: string;

  @Column({ nullable: true })
  employerName?: string;

  @Column({ nullable: true })
  employerCity?: string;

  @Column({ nullable: true })
  employerState?: string;

  @Column()
  @IsDefined()
  date: Date;

  @Column({
    type: 'geometry',
    nullable: true,
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  addressPoint?: {
    type: 'Point';
    coordinates: [number, number];
  }; // geoJson coordinates for address

  public errors: ValidationError[] = [];

  async isValidAsync(): Promise<boolean> {
    await this.validateAsync();
    return this.errors.length === 0;
  }

  async validateAsync(): Promise<ValidationError[]> {
    const errors = await validate(this);
    this.errors = errors;
    this.validateType();
    this.validateName();
    this.validateContributorAddress();
    return this.errors;
  }

  validateType(): void {
    if (this.type === ContributionType.CONTRIBUTION) {
      if (
        ![
          ExternalContributionSubType.CASH,
          ExternalContributionSubType.INKIND_CONTRIBUTION,
          ExternalContributionSubType.INKIND_PAID_SUPERVISION,
          ExternalContributionSubType.INKIND_FORGIVEN_ACCOUNT,
          ExternalContributionSubType.INKIND_FORGIVEN_PERSONAL,
        ].includes(this.subType)
      ) {
        const error = new ValidationError();
        error.property = 'subType';
        error.constraints = {
          notAllowed: 'Type "contribution" must have a valid subType of "cash or an inkind value"',
        };
        this.errors.push(error);
      }
    } else if (
      [
        ExternalContributionSubType.CASH,
        ExternalContributionSubType.INKIND_CONTRIBUTION,
        ExternalContributionSubType.INKIND_PAID_SUPERVISION,
        ExternalContributionSubType.INKIND_FORGIVEN_ACCOUNT,
        ExternalContributionSubType.INKIND_FORGIVEN_PERSONAL,
      ].includes(this.subType)
    ) {
      const error = new ValidationError();
      error.property = 'subType';
      error.constraints = { notAllowed: 'Type "other" cannot have a subType of "cash or inkind value"' };
      this.errors.push(error);
    }
  }

  validateName(): void {
    if (!this.name || this.name.trim() === '') {
      const error = new ValidationError();
      error.property = 'name';
      error.constraints = { isDefined: 'name should not be null or undefined' };
      this.errors.push(error);
    }
  }

  validateContributorAddress(): boolean {
    if (this.contributorType === ContributorType.INDIVIDUAL || this.contributorType === ContributorType.FAMILY) {
      return !!(this.address1 && this.city && this.zip && this.state);
    }
    return true;
  }
}

export const contributionSummaryFields = <const>[
  'orestarOriginalId',
  'orestarTransactionId',
  'country',
  'amount',
  'type',
  'subType',
  'contributorType',
  'name',
  'address1',
  'address2',
  'city',
  'state',
  'zip',
  'occupation',
  'employerName',
  'employerCity',
  'employerState',
  'notes',
  'date',
  'addressPoint',
];
export type IContributionSummary = Pick<ExternalContribution, typeof contributionSummaryFields[number]>;

export async function getContributionsGeoJsonAsync(
  options?: IGetContributionGeoJsonOptions
): Promise<IContributionsGeoJson> {
  try {
    const externalContributionRepository = getConnection('default').getRepository('external_contributions');
    let from;
    let to;
    if (options) {
      from = options.from;
      to = options.to;
    }

    const where = {
      date: from && to ? Between(from, to) : from ? MoreThanOrEqual(from) : to ? LessThanOrEqual(to) : undefined
    };
    const query: any = {
      select: ['date', 'type', 'amount', 'city', 'state', 'zip', 'name', 'addressPoint', 'contributorType', 'subType'],
      where,
      order: {
        date: 'DESC'
      }
    };

    const contributions = (await externalContributionRepository.find(removeUndefined(query)) as any).map((contribution: ExternalContribution): any => {
      const json = {
        type: 'Feature',
        properties: {
          type: contribution.type,
          city: contribution.city,
          state: contribution.state,
          zip: contribution.zip,
          amount: contribution.amount,
          contributorType: contribution.contributorType,
          contributionType: contribution.type,
          contributionSubType: contribution.subType,
          date: contribution.date.toISOString(),
          contributorName: contribution.name,
          campaignId: contribution.campaign.id,
          campaignName: contribution.campaign.name,
          officeSought: contribution.campaign.officeSought,
        },
        geometry: {
            type: 'Point',
            // @ts-ignore
            coordinates: contribution.addressPoint ? contribution.addressPoint.coordinates : undefined
        }
      };

      return json;
    });

    return {
      type: 'FeatureCollection',
      features: contributions,
    };

  } catch (err) {
      console.log(err);
      throw new Error('Error executing get contributions geojson query');
  }
}