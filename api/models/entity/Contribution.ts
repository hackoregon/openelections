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
    NEWSPAPER =  'print_advertising',
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
    CREDIT_CARD_PAPER = 'credit_card_paper'
}

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
        nullable: true,
    })
    oaeType: OaeType;

    @Column({
        type: 'enum',
        enum: PaymentMethod
    })
    @IsDefined()
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
    calendarYearAggregate?: number;

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
    submitForMatch?: boolean;

    @Column({ nullable: true })
    compliant?: boolean;

    @Column({ nullable: true })
    matchAmount?: number;

    @Column({ nullable: true, type: 'enum', enum: InKindDescriptionType})
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

    @ManyToOne(type => Government, government => government.contributions)
    government: Government;

    @ManyToOne(type => Campaign, campaign => campaign.contributions)
    campaign: Campaign;

    @OneToMany(type => Activity, activity => activity.contribution)
    activities: Activity[];

    @Column({ type: 'json', nullable: true })
    matchResult?: MatchAddressType;

    @Column({nullable: true})
    matchId?: string;

    @Column({type: 'enum', enum: MatchStrength, nullable: true})
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
        this.validateSubmitForMatch();
        this.validateMatchAmount();
        this.validateInKindType();
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
            if (![ContributionSubType.CASH, ContributionSubType.INKIND_CONTRIBUTION, ContributionSubType.INKIND_PAID_SUPERVISION, ContributionSubType.INKIND_FORGIVEN_ACCOUNT, ContributionSubType.INKIND_FORGIVEN_PERSONAL].includes(this.subType) ) {
                const error = new ValidationError();
                error.property = 'subType';
                error.constraints = { notAllowed: 'Type "contribution" must have a valid subType of "cash or an inkind value"' };
                this.errors.push(error);
            }
        } else {
            if ([ContributionSubType.CASH, ContributionSubType.INKIND_CONTRIBUTION, ContributionSubType.INKIND_PAID_SUPERVISION, ContributionSubType.INKIND_FORGIVEN_ACCOUNT, ContributionSubType.INKIND_FORGIVEN_PERSONAL].includes(this.subType)) {
                const error = new ValidationError();
                error.property = 'subType';
                error.constraints = { notAllowed: 'Type "other" cannot have a subType of "cash or inkind value"' };
                this.errors.push(error);
            }
        }
    }

    validateName() {
        if (this.contributorType === ContributorType.INDIVIDUAL) {
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

    validateSubmitForMatch() {
        if (this.submitForMatch && this.subType !== ContributionSubType.CASH) {
            const error = new ValidationError();
            error.property = 'submitForMatch';
            error.constraints = { notAllowed: 'Cannot submit non-cash contribution for match' };
            this.errors.push(error);
        } else if (this.submitForMatch && this.contributorType !== ContributorType.INDIVIDUAL) {
            const error = new ValidationError();
            error.property = 'contributorType';
            error.constraints = { notAllowed: 'Only individual cash contributions can be submitted for match' };
            this.errors.push(error);
        } else {
            this.validateAmount();
        }
    }

    validateAmount() {
        if (this.submitForMatch && (!this.amount || this.amount === 0)) {
            const error = new ValidationError();
            error.property = 'amount';
            error.constraints = { notAllowed: 'Cannot submit 0 amount for match' };
            this.errors.push(error);
        }
    }

    validateMatchAmount() {
        if (this.submitForMatch && this.matchAmount && this.matchAmount > this.amount) {
            const error = new ValidationError();
            error.property = 'matchAmount';
            error.constraints = { notAllowed: 'Cannot match more than contributed amount' };
            this.errors.push(error);
        }
    }

    validateContributorAddress() {
        if (this.contributorType === ContributorType.INDIVIDUAL) {
            return this.address1 && this.city && this.zip && this.state;
        }
        return true;
    }

    isInKind() {
        return [ContributionSubType.INKIND_CONTRIBUTION, ContributionSubType.INKIND_FORGIVEN_ACCOUNT, ContributionSubType.INKIND_FORGIVEN_PERSONAL, ContributionSubType.INKIND_PAID_SUPERVISION].includes(this.subType);
    }

    validateInKindType() {
        if (this.isInKind() && !this.inKindType) {
            const error = new ValidationError();
            error.property = 'inKindType';
            error.constraints = { notAllowed: 'inKindType must be present if subType is an inkind type' };
            this.errors.push(error);
        }
    }

    toJSON() {
        const json: any = {};
        contributionSummaryFields.forEach(( (key: string): void => {
            json[key] = this[key];
        }));
        return json as IContributionSummary;
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
    'calendarYearAggregate',
    'inKindType',
    'occupation',
    'employerName',
    'employerCity',
    'employerState',
    'submitForMatch',
    'compliant',
    'matchAmount',
    'status',
    'notes',
    'paymentMethod',
    'date'
];
export type IContributionSummary = Pick<Contribution, typeof contributionSummaryFields[number]>;

export async function getContributionsByGovernmentIdAsync(
    governmentId: number,
    options?: IGetContributionOptions
): Promise<IContributionSummary[]> {
    try {
        const contributionRepository = getConnection('default').getRepository('Contribution');
        const { page, perPage, campaignId, status, from, to, matchId, sort } = options;
        const relations = campaignId ? ['government', 'campaign'] : ['government'];
        const query: any = {
            select: contributionSummaryFields,
            relations,
            where: {
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
            },
            skip: page,
            take: perPage,
            order: {
                'updatedAt': 'DESC'
            }
        };
        if (sort) {
            if (!['date', 'status', 'campaignId'].includes(sort.field)) {
                throw new Error('Sort.field must be one of date, status or campaignid');
            }

            if (!['ASC', 'DESC'].includes(sort.direction)) {
                throw new Error('Sort.direction must be one of ASC or DESC');
            }

            query.order = { [sort.field]: sort.direction };

        }
        const contributions = await contributionRepository.find(removeUndefined(query));
        return contributions as IContributionSummary[];
    } catch (err) {
        throw new Error('Error executing get contributions query');
    }
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
            .where('contributions.status != :status', {status: ContributionStatus.ARCHIVED})
            .groupBy('contributions.status');
        if (attrs.campaignId) {
            contributionQuery.andWhere('contributions."campaignId" = :campaignId', {campaignId: attrs.campaignId});
        } else if (attrs.governmentId) {
            contributionQuery.andWhere('contributions."governmentId" = :governmentId', {governmentId: attrs.governmentId});
        }

        const results: any = await contributionQuery.getRawMany();
        const summary: ContributionSummaryByStatus[] = [];
        results.forEach((item: any): void => {
            summary.push({
                status: item.status,
                total: parseInt(item.total),
                amount: parseInt(item.amount),
                matchAmount: parseInt(item.matchAmount)
            });
        });
        return summary;

    } catch (err) {
        throw new Error('Error executing get contributions summary status query');
    }
}
