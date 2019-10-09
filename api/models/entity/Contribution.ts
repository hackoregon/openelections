import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BeforeInsert,
    BeforeUpdate,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    getConnection,
    Between,
    LessThanOrEqual,
    MoreThanOrEqual
} from 'typeorm';
import { IsDefined, validate, ValidationError } from 'class-validator';
import { Government } from './Government';
import { Campaign } from './Campaign';
import { Activity } from './Activity';
import { IGetContributionOptions } from '../../services/contributionService';
import { removeUndefined } from './helpers';
import { MatchAddressType } from '../../services/dataScienceService';
import { Parser } from 'json2csv';
import * as dateFormat from 'dateformat';
import OrestarContributionConverter from '../../models/converters/orestarContributionConverter';

export enum ContributionType {
    CONTRIBUTION = 'contribution',
    OTHER = 'other'
}

export enum ContributionSubType {
    CASH = 'cash',
    INKIND_CONTRIBUTION = 'inkind_contribution',
    INKIND_PAID_SUPERVISION = 'inkind_paid_supervision',
    INKIND_FORGIVEN_ACCOUNT = 'inkind_forgiven_account',
    INKIND_FORGIVEN_PERSONAL = 'inkind_forgiven_personal',
    ITEM_SOLD_FAIR_MARKET = 'item_sold_fair_market',
    ITEM_RETURNED_CHECK = 'item_returned_check',
    ITEM_MISC = 'item_misc',
    ITEM_REFUND = 'item_refund'
}

export enum ContributorType {
    INDIVIDUAL = 'individual',
    BUSINESS = 'business',
    FAMILY = 'family',
    LABOR = 'labor',
    POLITICAL_COMMITTEE = 'political_committee',
    POLITICAL_PARTY = 'political_party',
    UNREGISTERED = 'unregistered',
    OTHER = 'other'
}

export enum PhoneType {
    MOBILE = 'Mobile',
    WORK = 'Work',
    HOME = 'Home'
}

export enum ContributionStatus {
    ARCHIVED = 'Archived',
    DRAFT = 'Draft',
    SUBMITTED = 'Submitted',
    PROCESSED = 'Processed'
}

export enum MatchStrength {
    STRONG = 'strong',
    EXACT = 'exact',
    WEAK = 'weak',
    NONE = 'none'
}

export enum InKindDescriptionType {
    WAGES = 'wages',
    BROADCAST = 'broadcast_advertising',
    FUNDRAISING = 'fundraising_event_expenses',
    GENERAL_OPERATING = 'general_operating_expenses',
    PRIMTING = 'printing',
    MANAGEMENT = 'management',
    NEWSPAPER = 'print_advertising',
    OTHER_AD = 'other_advertising',
    PETITION = 'petition_circulators',
    POSTAGE = 'postage',
    PREP_AD = 'preparation_of_advertising',
    POLLING = 'surveys_and_polls',
    TRAVEL = 'travel_expenses',
    UTILITIES = 'utilities'
}

export enum OaeType {
    SEED = 'seed',
    MATCHABLE = 'matchable',
    PUBLICMATCHING = 'public_matching_contribution',
    QUALIFYING = 'qualifying',
    ALLOWABLE = 'allowable',
    INKIND = 'inkind'
}

export enum PaymentMethod {
    CASH = 'cash',
    CHECK = 'check',
    MONEY_ORDER = 'money_order',
    CREDIT_CARD_ONLINE = 'credit_card_online',
    CREDIT_CARD_PAPER = 'credit_card_paper',
    ETF = 'electronic_funds_transfer'
}
// Note, if you change any column type on the model, it will do a drop column operation, which means data loss in production.
@Entity({ name: 'contributions' })
export class Contribution {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column({
        type: 'enum',
        enum: ContributionType,
        default: ContributionType.CONTRIBUTION
    })
    @IsDefined()
    type: ContributionType;

    @Column({
        type: 'enum',
        enum: ContributionSubType
    })
    @IsDefined()
    subType: ContributionSubType;

    @Column({
        type: 'enum',
        enum: OaeType,
        nullable: true
    })
    oaeType: OaeType;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        nullable: true
    })
    paymentMethod: PaymentMethod;

    @Column({
        type: 'enum',
        enum: ContributorType
    })
    @IsDefined()
    contributorType: ContributorType;

    @Column({ nullable: true })
    contrPrefix?: string;

    @Column({ nullable: true })
    firstName?: string;

    @Column({ nullable: true })
    middleInitial?: string;

    @Column({ nullable: true })
    lastName?: string;

    @Column({ nullable: true })
    suffix?: string;

    @Column({ nullable: true })
    title?: string;

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

    @Column({ nullable: true })
    county?: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    notes?: string;

    @Column({
        type: 'enum',
        enum: PhoneType,
        nullable: true
    })
    phoneType?: PhoneType;

    @Column({ nullable: true })
    checkNumber?: string;

    @Column({
        type: 'decimal',
        transformer: {
            to: (value: number) => {
                return value;
            },
            from: (value: string) => {
                return parseFloat(value);
            }
        }
    })
    amount: number;

    @Column({ nullable: true })
    inKindDescription?: string;

    @Column({ nullable: true })
    occupation?: string;

    @Column({ nullable: true })
    employerName?: string;

    @Column({ nullable: true })
    employerCity?: string;

    @Column({ nullable: true })
    employerState?: string;

    @Column({ nullable: true })
    employerCountry?: string;

    @Column({ nullable: true })
    compliant?: boolean;

    @Column({
        nullable: true
    })
    matchAmount?: number;

    @Column({ nullable: true, type: 'enum', enum: InKindDescriptionType })
    inKindType?: InKindDescriptionType;

    @Column({
        type: 'enum',
        enum: ContributionStatus,
        default: ContributionStatus.DRAFT
    })
    @IsDefined()
    status: ContributionStatus;

    @Column()
    @IsDefined()
    date: Date;

    @Column({ nullable: true })
    occupationLetterDate?: Date;

    @ManyToOne(type => Government, government => government.contributions)
    government: Government;

    @ManyToOne(type => Campaign, campaign => campaign.contributions)
    campaign: Campaign;

    @OneToMany(type => Activity, activity => activity.contribution)
    activities: Activity[];

    @Column({ type: 'json', nullable: true })
    matchResult?: MatchAddressType;

    @Column({ nullable: true })
    matchId?: string;

    @Column({ type: 'enum', enum: MatchStrength, nullable: true })
    matchStrength?: MatchStrength;

    @Column({
        type: 'geometry',
        nullable: true,
        spatialFeatureType: 'Point',
        srid: 4326
    })
    addressPoint?: any; // geoJson coordinates for address

    public errors: ValidationError[] = [];

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await this.validateAsync();
        if (this.errors.length > 0) {
            throw new Error('contribution has one or more validation problems');
        }
    }

    async isValidAsync(): Promise<boolean> {
        await this.validateAsync();
        return this.errors.length === 0;
    }

    async validateAsync(): Promise<ValidationError[]> {
        const errors = await validate(this);
        this.errors = errors;
        await this.validateCampaignAsync();
        await this.validateGovernmentAsync();
        this.validateType();
        this.validateName();
        this.validateMatchAmount();
        this.validateInKindType();
        this.validatePaymentType();
        return this.errors;
    }

    async validateGovernmentAsync() {
        const g = await this.government;
        if (!g) {
            const error = new ValidationError();
            error.property = 'governmentId';
            error.constraints = { isDefined: 'governmentId should not be null or undefined' };
            this.errors.push(error);
        }
    }

    async validateCampaignAsync() {
        const c = await this.campaign;
        if (!c) {
            const error = new ValidationError();
            error.property = 'campaignId';
            error.constraints = { isDefined: 'campaignId should not be null or undefined' };
            this.errors.push(error);
        }
    }

    validateType() {
        if (this.type === ContributionType.CONTRIBUTION) {
            if (
                ![
                    ContributionSubType.CASH,
                    ContributionSubType.INKIND_CONTRIBUTION,
                    ContributionSubType.INKIND_PAID_SUPERVISION,
                    ContributionSubType.INKIND_FORGIVEN_ACCOUNT,
                    ContributionSubType.INKIND_FORGIVEN_PERSONAL
                ].includes(this.subType)
            ) {
                const error = new ValidationError();
                error.property = 'subType';
                error.constraints = {
                    notAllowed: 'Type "contribution" must have a valid subType of "cash or an inkind value"'
                };
                this.errors.push(error);
            }
        } else {
            if (
                [
                    ContributionSubType.CASH,
                    ContributionSubType.INKIND_CONTRIBUTION,
                    ContributionSubType.INKIND_PAID_SUPERVISION,
                    ContributionSubType.INKIND_FORGIVEN_ACCOUNT,
                    ContributionSubType.INKIND_FORGIVEN_PERSONAL
                ].includes(this.subType)
            ) {
                const error = new ValidationError();
                error.property = 'subType';
                error.constraints = { notAllowed: 'Type "other" cannot have a subType of "cash or inkind value"' };
                this.errors.push(error);
            }
        }
    }

    validatePaymentType() {
        if (this.type === ContributionType.CONTRIBUTION && this.subType === ContributionSubType.CASH && !this.paymentMethod) {
        const error = new ValidationError();
        error.property = 'paymentMethod';
        error.constraints = {
            notAllowed: 'Type "contribution" with subType "cash" must have a paymentMethod'
        };
        this.errors.push(error);
        }
    }

    validateName() {
        if (this.contributorType === ContributorType.INDIVIDUAL || this.contributorType === ContributorType.FAMILY) {
            if (!this.lastName || this.lastName.trim() === '') {
                const error = new ValidationError();
                error.property = 'lastName';
                error.constraints = { isDefined: 'lastName should not be null or undefined' };
                this.errors.push(error);
            }

            if (!this.firstName || this.firstName.trim() === '') {
                const error = new ValidationError();
                error.property = 'firstName';
                error.constraints = { isDefined: 'firstName should not be null or undefined' };
                this.errors.push(error);
            }
        } else {
            if (!this.name || this.name.trim() === '') {
                const error = new ValidationError();
                error.property = 'name';
                error.constraints = { isDefined: 'name should not be null or undefined' };
                this.errors.push(error);
            }
        }
    }

    validateMatchAmount() {
        if (this.matchAmount && this.matchAmount > this.amount) {
            const error = new ValidationError();
            error.property = 'matchAmount';
            error.constraints = { notAllowed: 'Cannot match more than contributed amount' };
            this.errors.push(error);
        }
    }

    validateContributorAddress() {
        if (this.contributorType === ContributorType.INDIVIDUAL || this.contributorType === ContributorType.FAMILY) {
            return this.address1 && this.city && this.zip && this.state;
        }
        return true;
    }

    isInKind() {
        return [
            ContributionSubType.INKIND_CONTRIBUTION,
            ContributionSubType.INKIND_FORGIVEN_ACCOUNT,
            ContributionSubType.INKIND_FORGIVEN_PERSONAL,
            ContributionSubType.INKIND_PAID_SUPERVISION
        ].includes(this.subType);
    }

    validateInKindType() {
        if (this.isInKind() && !this.inKindType) {
            const error = new ValidationError();
            error.property = 'inKindType';
            error.constraints = { notAllowed: 'inKindType must be present if subType is an inkind type' };
            this.errors.push(error);
        }
    }

    toJSON(isGov: boolean = false) {
        const json: any = {};
        if (isGov) {
            contributionGovSummaryFields.forEach(
                (key: string): void => {
                    json[key] = this[key];
                }
            );
            json.campaign = {
                name: this.campaign.name,
                id: this.campaign.id
            };
            return json as IContributionGovSummary;
        }
        contributionSummaryFields.forEach(
            (key: string): void => {
                json[key] = this[key];
            }
        );
        json.campaign = {
            name: this.campaign.name,
            id: this.campaign.id
        };
        return json as IContributionSummary;
    }

    toXML() {
        const xml = new OrestarContributionConverter(this);
        return xml.generate();
    }
}

export const contributionSummaryFields = <const>[
    'id',
    'amount',
    'createdAt',
    'updatedAt',
    'type',
    'subType',
    'inKindType',
    'contributorType',
    'oaeType',
    'contrPrefix',
    'firstName',
    'middleInitial',
    'lastName',
    'suffix',
    'title',
    'name',
    'address1',
    'address2',
    'city',
    'state',
    'zip',
    'county',
    'email',
    'phone',
    'phoneType',
    'checkNumber',
    'inKindType',
    'occupation',
    'employerName',
    'employerCity',
    'employerState',
    'employerCountry',
    'compliant',
    'matchAmount',
    'status',
    'notes',
    'paymentMethod',
    'date',
    'occupationLetterDate',
    'addressPoint'
];
export type IContributionSummary = Pick<Contribution, typeof contributionSummaryFields[number]>;

export const contributionGovSummaryFields = <const>[
    'id',
    'amount',
    'createdAt',
    'updatedAt',
    'type',
    'subType',
    'inKindType',
    'contributorType',
    'oaeType',
    'contrPrefix',
    'firstName',
    'middleInitial',
    'lastName',
    'suffix',
    'title',
    'name',
    'address1',
    'address2',
    'city',
    'state',
    'zip',
    'county',
    'email',
    'phone',
    'phoneType',
    'checkNumber',
    'inKindType',
    'occupation',
    'employerName',
    'employerCity',
    'employerState',
    'employerCountry',
    'compliant',
    'status',
    'notes',
    'paymentMethod',
    'date',
    'occupationLetterDate',
    'addressPoint',
    'compliant',
    'matchId',
    'matchAmount',
    'matchStrength',
    'matchResult'
];

export type IContributionGovSummary = Pick<Contribution, typeof contributionGovSummaryFields[number]>;

export interface IContributionGeoJson {
    type: 'Feature';
    properties: {
        city: string;
        state: string;
        zip: string;
        amount: number;
        contributorType: ContributorType;
        contributionType: ContributionType;
        contributionSubType: ContributionSubType;
        date: string;
        campaign: {
            name: string;
            id: string
        };
        contributorName: string
    };
    geometry: {
        type: 'Point';
        coordinates: [number, number]
    };
}


export interface IContributionsGeoJson {
    type: 'FeatureCollection';
    features: IContributionGeoJson[];
}

export type IContributionSummaryResults = {
    data: IContributionSummary[] | IContributionGovSummary[];
    geoJson?: IContributionsGeoJson;
    csv?: string;
    perPage: number;
    page: number;
    total: number;
};

export async function getContributionsByGovernmentIdAsync(
    governmentId: number,
    options?: IGetContributionOptions
): Promise<IContributionSummaryResults> {
    try {
        const contributionRepository = getConnection('default').getRepository('Contribution');
        const { page, perPage, campaignId, status, from, to, matchId, sort, format } = options;
        const isGovQuery = !options.campaignId;
        const where = {
                government: {
                    id: governmentId
                },
                campaign: campaignId
                    ? {
                        id: campaignId
                    }
                    : undefined,
                matchId,
                status,
                date:
                    from && to ? Between(from, to) : from ? MoreThanOrEqual(from) : to ? LessThanOrEqual(to) : undefined
            };
        const query: any = {
            select: isGovQuery ? contributionGovSummaryFields : contributionSummaryFields,
            relations: ['campaign', 'government'],
            where,
            skip: format === 'csv' ? undefined : page,
            take:  format === 'csv' ? undefined : perPage,
            order: {
                updatedAt: 'DESC'
            },
            join: {
                alias: 'contribution',
                leftJoinAndSelect: {
                    government: 'contribution.government',
                    campaign: 'contribution.campaign'
                }
            }
        };
        if (sort) {
            if (!['date', 'status', 'campaignId', 'matchAmount', 'amount'].includes(sort.field)) {
                throw new Error('Sort.field must be one of date, status, matchAmount, amount or campaignid');
            }

            if (!['ASC', 'DESC'].includes(sort.direction)) {
                throw new Error('Sort.direction must be one of ASC or DESC');
            }

            query.order = { [sort.field]: sort.direction };
        }


        const contributions = (await contributionRepository.find(removeUndefined(query)) as any).map((item: any): any => {
            const json = item.toJSON(isGovQuery);
            json.campaign = {
                id: item.campaign.id,
                name: item.campaign.name};
            json.government = {
                id: item.government.id,
                name: item.government.name};
            if (json.coordinates) {
                json.coordinates = item.addressPoint.coordinates;
            }
            return json;
        });

        const total = await contributionRepository.count(removeUndefined({ where }));
        return {
            data: contributions,
            perPage,
            page,
            total
        };
    } catch (err) {
        throw new Error('Error executing get contributions query');
    }
}

export function convertToGeoJson(contributions: any): IContributionsGeoJson {
    const data  = contributions.data.map((contribution: any): IContributionGeoJson => {
            return {
                type: 'Feature',
                properties: {
                    city: contribution.city,
                    state: contribution.state,
                    zip: contribution.zip,
                    amount: contribution.amount,
                    contributorType: contribution.contributorType,
                    contributionType: contribution.type,
                    contributionSubType: contribution.subType,
                    date: contribution.date.toISOString(),
                    contributorName: contribution.name || contribution.firstName + ' ' + contribution.lastName,
                    // @ts-ignore
                    campaign: contribution.campaign,
                },
                geometry: {
                    type: 'Point',
                    // @ts-ignore
                    coordinates: contribution.coordinates
                }
            };
        });
    return {
            type: 'FeatureCollection',
            features: data,
        };
}

export function convertToCsv(contributions: any): string {
    const json2csvParser = new Parser();
    contributions.data.map( (item: any ): any => {
        item.campaignId = item.campaign.id;
        item.campaignName = item.campaign.name;
        item.date = dateFormat(item.date, 'yyyy/mm/dd');
        delete item.campaign;
        delete item.government;
        return item;
    });
    return json2csvParser.parse(contributions.data);
}

export interface SummaryAttrs {
    campaignId?: number;
    governmentId?: number;
}

export interface ContributionSummaryByStatus {
    status: ContributionStatus;
    total: number;
    amount: number;
    matchAmount: number;
}

export async function getContributionsSummaryByStatusAsync(
    attrs: SummaryAttrs
): Promise<ContributionSummaryByStatus[]> {
    try {
        const contributionQuery = getConnection('default')
            .getRepository('Contribution')
            .createQueryBuilder('contributions')
            .select('SUM(contributions.amount)', 'amount')
            .addSelect('coalesce(SUM(contributions.matchAmount), 0)', 'matchAmount')
            .addSelect('COUNT(contributions.*)', 'total')
            .addSelect('contributions.status', 'status')
            .where('contributions.status != :status', { status: ContributionStatus.ARCHIVED })
            .groupBy('contributions.status');
        if (attrs.campaignId) {
            contributionQuery.andWhere('contributions."campaignId" = :campaignId', { campaignId: attrs.campaignId });
        } else if (attrs.governmentId) {
            contributionQuery.andWhere('contributions."governmentId" = :governmentId', {
                governmentId: attrs.governmentId
            });
        }

        const results: any = await contributionQuery.getRawMany();
        const summary: ContributionSummaryByStatus[] = [];
        results.forEach(
            (item: any): void => {
                summary.push({
                    status: item.status,
                    total: parseInt(item.total),
                    amount: parseInt(item.amount),
                    matchAmount: parseInt(item.matchAmount)
                });
            }
        );
        return summary;
    } catch (err) {
        throw new Error('Error executing get contributions summary status query');
    }
}
