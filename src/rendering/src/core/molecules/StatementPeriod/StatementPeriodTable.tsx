import { useI18n } from 'next-localization';
import { StatementPeriodTableProps, StatementType } from './StatementPeriod.type';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/core/atoms/ui/Table';

const StatementPeriodTable: React.FC<StatementPeriodTableProps> = (props) => {
  const { type, referralDetails, spendDetails } = props;
  const spendHeaders = [
    { id: 1, value: 'Rewards_OrderNumber' },
    { id: 2, value: 'Rewards_Date' },
    { id: 3, value: 'Rewards_PO' },
    { id: 4, value: 'Rewards_SpendTotal' },
  ];
  const referralsHeaders = [
    { id: 1, value: 'Rewards_OrderNumber' },
    { id: 2, value: 'Rewards_Date' },
    { id: 3, value: 'Rewards_PO' },
    { id: 4, value: 'Rewards_ReferalTotal' },
  ];

  const { t } = useI18n();

  const renderTableBody = () => {
    switch (type) {
      case StatementType.SPEND: {
        if (spendDetails && spendDetails.length > 0) {
          return spendDetails.map((item) => (
            <TableRow key={item.order}>
              <TableCell className="text-xs font-medium font-latoSemiBold py-3.7">
                {item.order}
              </TableCell>
              <TableCell className="text-xs font-medium font-latoSemiBold py-3.7">
                {item.date}
              </TableCell>
              <TableCell className="text-xs font-medium font-latoSemiBold py-3.7">
                {item.po}
              </TableCell>
              <TableCell className="text-xs font-medium font-latoSemiBold py-3.7">
                {item.referraltotal}
              </TableCell>
            </TableRow>
          ));
        }
        break;
      }
      case StatementType.REFERRAL: {
        if (referralDetails && referralDetails.length > 0) {
          return referralDetails.map((item) => (
            <TableRow key={item.order}>
              <TableCell className="text-xs font-medium font-latoSemiBold py-3.7">
                {item.order}
              </TableCell>
              <TableCell className="text-xs font-medium font-latoSemiBold py-3.7">
                {item.date}
              </TableCell>
              <TableCell className="text-xs font-medium font-latoSemiBold py-3.7">
                {item.po}
              </TableCell>
              <TableCell className="text-xs font-medium font-latoSemiBold py-3.7">
                {item.referraltotal}
              </TableCell>
            </TableRow>
          ));
        }
        break;
      }
    }
    return (
      <TableRow>
        <TableCell></TableCell>
      </TableRow>
    );
  };

  return (
    <Table className="border-b border-border-gray">
      <TableHeader className="mb-41">
        <TableRow className="bg-tonal-gray">
          {type === StatementType.SPEND
            ? spendHeaders.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-xs font-medium font-latoSemiBold text-dark-gray first:rounded-l-md last:rounded-r-md"
                >
                  {t(header.value)}
                </TableHead>
              ))
            : referralsHeaders.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-xs font-medium font-latoSemiBold text-dark-gray first:rounded-l-md last:rounded-r-md pr-6"
                >
                  {t(header.value)}
                </TableHead>
              ))}
        </TableRow>
      </TableHeader>
      <TableBody>{renderTableBody()}</TableBody>
    </Table>
  );
};
export default StatementPeriodTable;
