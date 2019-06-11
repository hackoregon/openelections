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
        enum: ContributorType
    })
    @IsDefined()
    contributorType: ContributorType;

    @Column({ nullable: true })
    contrPrefix?: string;

    @Column({ nullable: true })
    contrFirst?: string;

    @Column({ nullable: true })
    contrMiddleInitial?: string;

    @Column({ nullable: true })
    contrLast?: string;

    @Column({ nullable: true })
    contrSuffix?: string;

    @Column({ nullable: true })
    contrTitle?: string;

    @Column({ nullable: true })
    contrName?: string;

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

    @Column({
        type: 'enum',
        enum: PhoneType,
        nullable: true
    })
    phoneType?: PhoneType;

    @Column({ nullable: true })
    checkNumber?: string;

    @Column({type: 'decimal', transformer: {
            to: (value: number) => {
                return value;
            },
            from: (value: string) => {
                return parseFloat(value);
            }
        }})
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

    @Column({
        type: 'enum',
        enum: ContributionStatus,
        default: ContributionStatus.DRAFT
    })
    @IsDefined()
    status: ContributionStatus;

    @ManyToOne(type => Government, government => government.contributions)
    government: Government;

    @ManyToOne(type => Campaign, campaign => campaign.contributions)
    campaign: Campaign;

    @OneToMany(type => Activity, activity => activity.contribution)
    activities: Activity[];

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
            if (this.subType !== ContributionSubType.CASH) {
                const error = new ValidationError();
                error.property = 'subType';
                error.constraints = { notAllowed: 'Type "contribution" must have a subType of "cash"' };
                this.errors.push(error);
            }
        } else {
            if (this.subType === ContributionSubType.CASH) {
                const error = new ValidationError();
                error.property = 'subType';
                error.constraints = { notAllowed: 'Type "other" cannot have a subType of "cash"' };
                this.errors.push(error);
            }
        }
    }

    validateName() {
        if (this.contributorType === ContributorType.INDIVIDUAL) {
            if (!this.contrLast || this.contrLast.trim() === '') {
                const error = new ValidationError();
                error.property = 'contrLast';
                error.constraints = { isDefined: 'contrLast should not be null or undefined' };
                this.errors.push(error);
            }

            if (!this.contrFirst || this.contrFirst.trim() === '') {
                const error = new ValidationError();
                error.property = 'contrFirst';
                error.constraints = { isDefined: 'contrFirst should not be null or undefined' };
                this.errors.push(error);
            }
        } else {
            if (!this.contrName || this.contrName.trim() === '') {
                const error = new ValidationError();
                error.property = 'contrName';
                error.constraints = { isDefined: 'contrName should not be null or undefined' };
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

    toJSON() {
        return {
            id: this.id
        };
    }
}

const contributionSummaryFields = <const>['id', 'amount'];
export type IContributionSummary = Pick<Contribution, typeof contributionSummaryFields[number]>;

export async function getContributionsByGovernmentIdAsync(
    governmentId: number,
    options?: IGetContributionOptions
): Promise<IContributionSummary[]> {
    try {
        const contributionRepository = getConnection('default').getRepository('Contribution');
        const { page, perPage, campaignId, status, from, to } = options;
        const relations = campaignId ? ['government', 'campaign'] : ['government'];
        const query = {
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
                status,
                createdAt:
                    from && to ? Between(from, to) : from ? MoreThanOrEqual(from) : to ? LessThanOrEqual(to) : undefined
            },
            skip: page,
            take: perPage
        };
        const contributions = await contributionRepository.find(removeUndefined(query));
        return contributions as IContributionSummary[];
    } catch (err) {
        throw new Error('Error executing get contributions query');
    }
}

const removeUndefined = obj => {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') removeUndefined(obj[key]);
        else if (obj[key] === undefined) delete obj[key];
    });
    return obj;
};
