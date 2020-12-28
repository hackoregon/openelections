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
import { IGetExpenditureAttrs } from '../../services/expenditureService';
import { Parser } from 'json2csv';
import * as dateFormat from 'dateformat';
import { convertExpendituresToXML } from '../converters';

export enum ExpenditureType {
    EXPENDITURE = 'expenditure',
    OTHER = 'other',
    OTHER_DISBURSEMENT = 'other_disbursement'
}

export enum ExpenditureSubType {
    ACCOUNTS_PAYABLE = 'accounts_payable',
    CASH_EXPENDITURE = 'cash_expenditure',
    PERSONAL_EXPENDITURE = 'personal_expenditure',
    ACCOUNTS_PAYABLE_RESCINDED = 'accounts_payable_rescinded',
    CASH_BALANCE_ADJUSTMENT = 'cash_balance_adjustment',
    MISCELLANEOUS_OTHER_DISBURSEMENT = 'miscellaneous_other_disbursement',
    REFUND_OF_CONTRIBUTION = 'refund_of_expenditure'
}

export enum PayeeType {
    INDIVIDUAL = 'individual',
    BUSINESS = 'business',
    FAMILY = 'family',
    LABOR = 'labor',
    POLITICAL_COMMITTEE = 'political_committee',
    POLITICAL_PARTY = 'political_party',
    UNREGISTERED = 'unregistered',
    OTHER = 'other'
}

export enum PaymentMethod {
    CASH = 'cash',
    CHECK = 'check',
    MONEY_ORDER = 'money_order',
    CREDIT_CARD_ONLINE = 'credit_card_online',
    CREDIT_CARD_PAPER = 'credit_card_paper',
    ETF = 'electronic_funds_transfer',
    DEBIT = 'debit'
}

export enum ExpenditureStatus {
    ARCHIVED = 'archived',
    DRAFT = 'draft',
    SUBMITTED = 'submitted',
    OUT_OF_COMPLIANCE = 'out_of_compliance',
    IN_COMPLIANCE = 'in_compliance'
}

export enum PurposeType {
    WAGES = 'wages',
    CASH = 'cash_contribution',
    REIMBURSEMENT = 'personal_reimbursement',
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

// Note, if you change any column type on the model, it will do a drop column operation, which means data loss in production.
@Entity({ name: 'expenditures' })
export class Expenditure {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    @IsDefined()
    date: Date;

    @Column({
        type: 'enum',
        enum: ExpenditureType,
        default: ExpenditureType.EXPENDITURE
    })
    @IsDefined()
    type: ExpenditureType;

    @Column({
        type: 'enum',
        enum: ExpenditureSubType
    })
    @IsDefined()
    subType: ExpenditureSubType;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        nullable: true
    })
    paymentMethod?: PaymentMethod;

    @Column({
        type: 'enum',
        enum: PayeeType
    })
    @IsDefined()
    payeeType: PayeeType;

    @Column({
        type: 'enum',
        enum: PurposeType,
        nullable: true
    })
    purpose?: PurposeType;

    @IsDefined()
    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    vendorForOriginalPurchase?: string;

    @Column({ nullable: true })
    dateOriginalTransaction?: Date;

    @Column({ nullable: true })
    address1: string;

    @Column({ nullable: true })
    address2?: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    zip: string;

    @Column({ nullable: true })
    checkNumber?: string;

    @Column({ nullable: true })
    notes?: string;

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
    @IsDefined()
    amount: number;

    @Column({
        type: 'enum',
        enum: ExpenditureStatus,
        default: ExpenditureStatus.DRAFT
    })
    @IsDefined()
    status: ExpenditureStatus;

    @ManyToOne(type => Government, government => government.expenditures)
    government: Government;

    @ManyToOne(type => Campaign, campaign => campaign.expenditures)
    campaign: Campaign;

    @OneToMany(type => Activity, activity => activity.expenditure)
    activities: Activity[];

    public errors: ValidationError[] = [];

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await this.validateAsync();
        if (this.errors.length > 0) {
            throw new Error('expenditure has one or more validation problems');
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
        this.validateAmount();
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
        if (this.type === ExpenditureType.EXPENDITURE) {
            if (
                ![
                    ExpenditureSubType.ACCOUNTS_PAYABLE,
                    ExpenditureSubType.CASH_EXPENDITURE,
                    ExpenditureSubType.PERSONAL_EXPENDITURE
                ].includes(this.subType)
            ) {
                const error = new ValidationError();
                error.property = 'subType';
                error.constraints = {
                    notAllowed:
                        'Type "expenditure" must have a subType of "accounts_payable, cash_expenditure or personal_expenditure"'
                };
                this.errors.push(error);
            }
        } else if (this.type === ExpenditureType.OTHER) {
            if (
                ![ExpenditureSubType.ACCOUNTS_PAYABLE_RESCINDED, ExpenditureSubType.CASH_BALANCE_ADJUSTMENT].includes(
                    this.subType
                )
            ) {
                const error = new ValidationError();
                error.property = 'subType';
                error.constraints = {
                    notAllowed: 'Type "other"  must have a subType of "accounts_payable or cash_balance_adjustment"'
                };
                this.errors.push(error);
            }
        } else if (this.type === ExpenditureType.OTHER_DISBURSEMENT) {
            if (
                ![
                    ExpenditureSubType.MISCELLANEOUS_OTHER_DISBURSEMENT,
                    ExpenditureSubType.REFUND_OF_CONTRIBUTION
                ].includes(this.subType)
            ) {
                const error = new ValidationError();
                error.property = 'subType';
                error.constraints = {
                    notAllowed:
                        'Type "other_disbursement"  must have a subType of "miscellaneous_other_disbursement or refund_of_expenditure"'
                };
                this.errors.push(error);
            }
        }
    }

    validateAmount() {
        if (!this.amount || this.amount === 0) {
            const error = new ValidationError();
            error.property = 'amount';
            error.constraints = { notAllowed: 'Cannot submit 0 amount for match' };
            this.errors.push(error);
        }
    }

    toJSON() {
        const json: any = {};
        expenditureSummaryFields.forEach(( (key: string): void => {
            json[key] = this[key];
        }));
        json.campaign = {
            name: this.campaign.name,
            id: this.campaign.id
        };
        return json as IExpenditureSummary;
    }
}

export const expenditureSummaryFields = <const>[
    'id',
    'amount',
    'createdAt',
    'updatedAt',
    'name',
    'address1',
    'address2',
    'city',
    'state',
    'zip',
    'type',
    'notes',
    'paymentMethod',
    'subType',
    'payeeType',
    'checkNumber',
    'purpose',
    'dateOriginalTransaction',
    'vendorForOriginalPurchase',
    'status',
    'date'
];
export type IExpenditureSummary = Pick<Expenditure, typeof expenditureSummaryFields[number]>;

export type IExpenditureSummaryResults = {
    data: IExpenditureSummary[];
    csv?: string;
    xml?: string;
    perPage: number;
    page: number;
    total: number;
};

export async function getExpendituresByGovernmentIdAsync(
    governmentId: number,
    options?: IGetExpenditureAttrs
): Promise<IExpenditureSummaryResults> {
    try {
        const expenditureRepository = getConnection('default').getRepository('Expenditure');
        const { page, perPage, campaignId, status, from, to, sort, format } = options;
        const where = {
                government: {
                    id: governmentId
                },
                campaign: campaignId
                    ? {
                        id: campaignId
                    }
                    : undefined,
                status,
                date:
                    from && to ? Between(from, to) : from ? MoreThanOrEqual(from) : to ? LessThanOrEqual(to) : undefined
            };
        const query: any = {
            select: expenditureSummaryFields,
            relations: ['campaign', 'government'],
            where,
            join: {
                alias: 'contribution',
                leftJoinAndSelect: {
                    government: 'contribution.government',
                    campaign: 'contribution.campaign'
                }
            },
            skip: format === 'csv' ? undefined : page,
            take:  format === 'csv' ? undefined : perPage,
            order: { 'updatedAt': 'DESC'}
        };

        if (sort) {
            if (!['date', 'status', 'campaignId'].includes(sort.field)) {
                throw new Error('Sort.field must be one of date, status or campaignId');
            }

            if (!['ASC', 'DESC'].includes(sort.direction)) {
                throw new Error('Sort.direction must be one of ASC or DESC');
            }
            let sortField: 'campaignId' | 'status' | 'date' | 'id' = sort.field;
            if (sortField === 'campaignId') {
                sortField = 'id';
            }

            query.order = { [sortField]: sort.direction };

        }

        const expenditures = (await expenditureRepository.find(removeUndefined(query))  as IExpenditureSummary[]).map((item: any): any => {
            const json = item.toJSON();
            json.campaign = {
                id: item.campaign.id,
                name: item.campaign.name};
            json.government = {
                id: item.government.id,
                name: item.government.name};
            return json;
        });
        const total = await expenditureRepository.count(removeUndefined(query));
        return {
            data: expenditures,
            total,
            perPage,
            page
        };
    } catch (err) {
        console.log(err);
        throw new Error('Error executing get expenditures query');
    }
}

export function convertToCsv(expenditures: IExpenditureSummaryResults): string {
    const json2csvParser = new Parser();
    expenditures.data.map( (item: any ): any => {
        item.campaignId = item.campaign.id;
        item.campaignName = item.campaign.name;
        item.date = dateFormat(item.date, 'yyyy/mm/dd');
        delete item.campaign;
        delete item.government;
        return item;
    });
    return json2csvParser.parse(expenditures.data);
}

export function convertToXml(expenditures: IExpenditureSummaryResults, filerId: string | number): string {
    return convertExpendituresToXML(expenditures, filerId);
}

const removeUndefined = obj => {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') removeUndefined(obj[key]);
        else if (obj[key] === undefined) delete obj[key];
    });
    return obj;
};

export interface ExpenditureSummaryByStatus {
    status: ExpenditureStatus;
    total: number;
    amount: number;
}


export interface SummaryAttrs {
    campaignId?: number;
    governmentId?: number;
}

export async function getExpenditureSummaryByStatusAsync(
    attrs: SummaryAttrs
): Promise<ExpenditureSummaryByStatus[]> {
    try {
        const expenditureQuery = getConnection('default')
            .getRepository('Expenditure')
            .createQueryBuilder('expenditures')
            .select('SUM(expenditures.amount)', 'amount')
            .addSelect('COUNT(expenditures.*)', 'total')
            .addSelect('expenditures.status', 'status')
            .where('expenditures.status != :status', {status: ExpenditureStatus.ARCHIVED})
            .groupBy('expenditures.status');
        if (attrs.campaignId) {
            expenditureQuery.andWhere('expenditures."campaignId" = :campaignId', {campaignId: attrs.campaignId});
        } else if (attrs.governmentId) {
            expenditureQuery.andWhere('expenditures."governmentId" = :governmentId', {governmentId: attrs.governmentId});
        }

        const results: any = await expenditureQuery.getRawMany();
        const summary: ExpenditureSummaryByStatus[] = [];
        results.forEach((item: any): void => {
            summary.push({
                status: item.status,
                total: parseInt(item.total),
                amount: parseInt(item.amount)
            });
        });
        return summary;

    } catch (err) {
        throw new Error('Error executing get expenditures summary status query');
    }
}
