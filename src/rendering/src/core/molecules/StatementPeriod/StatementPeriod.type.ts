export const enum StatementType {
  REFERRAL = 'Referral',
  SPEND = 'Spend',
}
export interface ApiData {
  header: {
    zzcustom: {
      rewardDetails: ApiRequiredData;
    };
  };
}

export interface ApiRequiredData {
  referralDetails: Array<TableDataType> | undefined;
  referralTotal: string | undefined;
  spendDetails: Array<TableDataType> | undefined;
  spendTotal: string | undefined;
}

export interface StatementPeriodTableProps {
  type?: StatementType;
  referralDetails?: Array<TableDataType>;
  spendDetails?: Array<TableDataType>;
}

export interface TableDataType {
  order: string;
  date: string;
  po: string;
  referraltotal?: string;
  spendTotal?: string;
}

export interface MobileContainerType extends TableDataType {
  type?: StatementType;
}
