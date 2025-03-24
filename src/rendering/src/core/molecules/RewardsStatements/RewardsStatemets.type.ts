import {
  ComponentParams,
  ComponentRendering,
  Field,
  ImageField,
} from '@sitecore-jss/sitecore-jss-nextjs';

export interface RewardsStatementsProps {
  rendering: ComponentRendering & { params: ComponentParams } & {
    fields: RewardsStatementsFieldProps;
  };
  params: ComponentParams;
}

export interface RewardsStatementsFieldProps {
  EnableProUsers: Field<string>;
  Title: Field<string>;
  Icon: ImageField;
}

export interface RewardsStatementApi {
  id: string;
  fiText: string;
}
