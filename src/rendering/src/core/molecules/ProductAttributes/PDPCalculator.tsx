import React, { useState, useEffect } from 'react';
import { RichText, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { type ProductAttributesProps } from './ProductAttributes.types';
import { getHeadingStyles } from '@/utils/StyleHeadings';
import { useForm, FormProvider } from 'react-hook-form';
import Select from '@/core/atoms/Form/Select/Select';
import Input from '@/core/atoms/Form/Input/Input';
import { IoCloseSharp } from 'react-icons/io5';
import { BsInfoCircle } from 'react-icons/bs';
import { useI18n } from 'next-localization';
import CustomIcon from './CustomIcon';
import { cn } from '@/utils/cn';
import Cookies from 'js-cookie';
import { IS_PROUSER } from 'src/config';
interface PDPCalculatorProps extends ProductAttributesProps {
  onTotalUnitsChange: (units: number) => void;
}

const PDPCalculator: React.FC<PDPCalculatorProps> = (props) => {
  const { params, fields, data, onTotalUnitsChange } = props;
  const { HeadingTag, HeadingSize } = params;
  const { Title, Description, AlertSummary, OverageDropdown } = fields?.PDPCalculator?.fields ?? '';
  const { t } = useI18n();
  const formMethods = useForm();
  const [coverageNeeded, setCoverageNeeded] = useState('');
  const [showErrormsg, setErrorMsg] = useState<boolean>(false);
  const [overage, setOverage] = useState('15');
  const [totalUnits, setTotalUnits] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [totalCoverage, setTotalCoverage] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const pdpCalculator = data;
  const calculatorMode = data?.CalculatorMode;
  const [isProUser, setIsProUser] = useState<boolean>(false);
  useEffect(() => {
    calculateCoverage();
  }, [coverageNeeded, overage]);

  useEffect(() => {
    const proUserCookie = Cookies.get(IS_PROUSER);
    if (proUserCookie !== undefined) setIsProUser(proUserCookie === 'true');
  }, [isProUser]);

  const calculateCoverage = () => {
    const needed = parseFloat(coverageNeeded) || 0;
    const overagePercentage = parseInt(overage) || 0;
    const adjustedCoverage: number | undefined = needed + needed * (overagePercentage / 100);
    const sizePerItem = calculatorMode === 'AREA' ? pdpCalculator.CoveragePerBox : 0; //pdpCalculator.Product?.xp?.ActualLengthIN / 12;
    const pricePerItem = pdpCalculator?.PriceSchedule?.PriceBreaks[0]?.SalePrice || 0;

    const count = Math.ceil(adjustedCoverage / sizePerItem) || 0;
    const cost: number | undefined = count * pricePerItem || 0;
    const adjustedCoverageNumber =
      adjustedCoverage !== undefined ? parseFloat(adjustedCoverage?.toFixed(0)) : 0;
    setTotalCoverage(adjustedCoverageNumber);
    setTotalUnits(isNaN(count) ? 0 : count);
    setTotalUnits(isNaN(count) ? 0 : count);
    const costNumber = cost !== undefined ? parseFloat(cost?.toFixed(2)) : 0;
    setTotalCost(isNaN(costNumber) ? 0 : costNumber);
    onTotalUnitsChange(count);
    setErrorMsg(false);
  };

  const recalculateCoverage = (value: number) => {
    const needed = parseFloat(coverageNeeded);
    if (isNaN(needed)) {
      alert('Error calculating coverage.');
      setErrorMsg(true);
    } else {
      setOverage(value.toString());
      calculateCoverage();
      setErrorMsg(false);
    }
  };
  return calculatorMode !== 'NONE' &&
    ((data?.IsOnlinePurchasableRetail === true && !isProUser) ||
      (data?.IsOnlinePurchasablePro === true && isProUser)) ? (
    <div className="mt-10">
      <div className="flex items-center gap-2">
        <CustomIcon />
        <button
          className="font-latoBold text-base underline hover:text-black"
          onClick={() => setOpen(!open)}
        >
          <span className="text-dark-gray hover:text-black">
            {t('PDPAttributes_HowMuchDoINeed')}
          </span>
        </button>
      </div>
      {open && (
        <div className="border border-dark-gray border-opacity-75 bg-white rounded-xl p-6 mb-6 mt-6">
          <div className="flex items-center justify-between w-full mb-6 text-dark-gray">
            {Title && (
              <Text
                field={Title}
                tag={HeadingTag}
                className={cn(getHeadingStyles(HeadingSize, HeadingTag), 'text-base')}
              />
            )}
            <IoCloseSharp
              onClick={() => setOpen(false)}
              className="w-14 h-8 hover:scale-150 hover:transition hover:ease-out cursor-pointer text-çlose-button"
            />
          </div>
          {Description && (
            <RichText field={Description} className="mb-4 font-normal text-dark-gray" />
          )}
          <div className="bg-tonal-gray flex items-center rounded-lg pt-6 pl-3 pb-3 pr-12 mb-10">
            <div className="mb-3 p-6">
              <BsInfoCircle className="max-w-fit w-6 h-6" />
            </div>
            {AlertSummary && (
              <RichText field={AlertSummary} className="mb-4 font-normal text-dark-gray" />
            )}
          </div>
          <FormProvider {...formMethods}>
            <div className="flex items-center border border-border-black text-border-black rounded-lg px-2 pt-2 pb-3.5 text-base mb-3">
              <Input
                name="calculator-coverage-needed"
                inputType="tel"
                value={coverageNeeded}
                placeholder={t('PDPCalculator_Enter')}
                onChange={(e) => setCoverageNeeded(e?.target?.value)}
                className="focus:outline-none focus:placeholder-transparent w-13 py-1 pl-2.5 pr-0.5 border-none text-black text-right"
              />
              <label className="pl-1">{t('PDPCalculator_SqFt')}</label>
            </div>
            <div className="border border-border-black text-border-black rounded-lg ">
              <Select
                name="overage-calculation"
                value={overage}
                options={
                  OverageDropdown?.map((item) => {
                    return {
                      label: item?.fields?.DisplayName?.value,
                      value: item?.fields?.Value?.value,
                    };
                  }) || []
                }
                onChange={(e) => recalculateCoverage(Number(e.target.value))}
                className="w-full border-r-0 py-3.5 pl-4 border-none"
              />
            </div>
          </FormProvider>
          <div className="mt-7 text-base w-full text-dark-gray">
            <div className="my-1 leading-5 flex justify-between items-center">
              <label className="mb-1 font-normal">
                {calculatorMode === 'AREA' ? `${t('PDPCalculator_TotalSqFt')}` : ' Linear Ft.'}
              </label>
              <span className="font-bold">{`${totalCoverage || '0'} ${calculatorMode === 'AREA' ? `${t('PDPCalculator_SqFt')} ` : 'Linear Ft.'}`}</span>
            </div>
            <div className="my-1 leading-5 flex justify-between items-center">
              <label className="mb-1 font-normal">
                {calculatorMode === 'AREA' ? `${t('PDPCalculator_BoxesNeeded')}` : 'Pieces'}
              </label>
              <span className="font-bold">
                {!showErrormsg
                  ? `${totalUnits}  ${calculatorMode === 'AREA' ? `${t('PDPCalculator_Boxes')} ` : 'Pieces'}`
                  : 'Error, Unable to calculate.'}
              </span>
            </div>
            <div className="my-1 leading-5 flex justify-between items-center">
              <label className="mb-1 font-normal">
                {calculatorMode === 'AREA' ? `${t('PDPCalculator_PricePerBox')}` : 'Piece'}
              </label>
              <span className="font-bold">{`$${pdpCalculator?.PriceSchedule?.PriceBreaks[0]?.SalePrice?.toFixed(2)}`}</span>
            </div>
            <hr className="border-2 border-slate-gray my-0.5 border-t-0" />
            <div className="my-1 flex justify-between items-center">
              <label className="mb-1 leading-29 text-2xl">{t('PDPCalculator_TotalCost')}</label>
              <span className="font-bold text-2xl">{`$${totalCost.toFixed(2)}`}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    ''
  );
};

export default PDPCalculator;
