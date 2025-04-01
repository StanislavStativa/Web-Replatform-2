import React, { useEffect, useState } from 'react';
import { ITypesQuantityInput } from './Table.type';

const QuantityInput = ({ initialQuantity, getQuantity, invoiceNumber }: ITypesQuantityInput) => {
  const initialQuantityNumber = parseInt(initialQuantity.replace(/[^0-9]/g, ''), 10);
  const [quantity, setQuantity] = useState(initialQuantityNumber);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (quantity !== initialQuantityNumber) {
      getQuantity(quantity, invoiceNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity, invoiceNumber]);

  return (
    <div className="flex items-center text-base font-normal gap-1">
      <div className="flex items-center p-3 border rounded-lg border-dark-gray gap-2 justify-between">
        <button className="leading-3.5" onClick={handleDecrement}>
          -
        </button>
        <p className="leading-3.5">{quantity}</p>
        <button className="leading-3.5" onClick={handleIncrement}>
          +
        </button>
      </div>
      <p className="leading-3.5">{initialQuantity?.replace(/[0-9]/g, '')}</p>
    </div>
  );
};

export default QuantityInput;
