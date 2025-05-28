import React, { useState, useMemo, useEffect } from 'react';
import { FaSortUp, FaSortDown, FaEdit, FaTrash } from 'react-icons/fa';
import { LiaSortSolid } from 'react-icons/lia';
import { ITypesTable } from './Table.type';
import { cn } from '@/utils/cn';
import Image from '@/core/atoms/Image/Image';
import QuantityInput from './QuantityInput';
import { GrDocumentPdf } from 'react-icons/gr';
import { FaLock } from 'react-icons/fa6';
import { FaLockOpen } from 'react-icons/fa';
import { TABLESORT } from '@/utils/constants';

const Table = <T,>({
  data,
  columns,
  sortable = false,
  isAction = false,
  onCellClick,
  clickableColumns = [],
  onEdit,
  onDelete,
  isClickableUnderLine = false,
  modifyCssColumns = [],
  customColumnsStyle,
  imageColumns = [],
  filesColumns = [],
  quantityControl = [],
  isOnlyDelete,
  isCheckbox = false,
  isUnSelectAll,
  isSelectAll,
  onSelectedRowsChange,
  checkboxLabel,
  isActionLabel,
  isLock,
  getQuantityUpdate,
  isMobileClassName,
  fieldCss,
  isMobileCheckboxLabel,
  isMobileHalFNHalf,
}: ITypesTable<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: TABLESORT;
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const sortedData = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }

    const sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === TABLESORT.ASC ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === TABLESORT.ASC ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const requestSort = (key: keyof T) => {
    let direction: TABLESORT = TABLESORT.ASC;
    if (sortConfig && sortConfig.key === key && sortConfig.direction === TABLESORT.ASC) {
      direction = TABLESORT.DESC;
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof T) => {
    if (!sortConfig) return <LiaSortSolid aria-hidden="true" />;
    if (sortConfig.key === key) {
      return sortConfig.direction === TABLESORT.ASC ? (
        <FaSortUp aria-hidden="true" />
      ) : (
        <FaSortDown aria-hidden="true" />
      );
    }
    return <LiaSortSolid aria-hidden="true" />;
  };

  const handleSelectAll = () => {
    const newSelectedRows = new Set<string>();
    sortedData.forEach((item) => newSelectedRows.add(item.id));
    setSelectedRows(newSelectedRows);

    if (onSelectedRowsChange) {
      onSelectedRowsChange(Array.from(newSelectedRows));
    }
  };

  const handleUnselectAll = () => {
    setSelectedRows(new Set());

    if (onSelectedRowsChange) {
      onSelectedRowsChange([]);
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
    if (onSelectedRowsChange) {
      onSelectedRowsChange(Array.from(newSelectedRows));
    }
  };

  const handleFileView = (event: React.FormEvent, selectedFile: string) => {
    event.preventDefault();
    if (onCellClick) onCellClick(selectedFile as string);
  };

  const handleQuantityChange = (value: number, invoice: string) => {
    if (getQuantityUpdate) getQuantityUpdate(value, invoice);
  };
  useEffect(() => {
    if (isSelectAll === true) {
      handleSelectAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelectAll]);
  useEffect(() => {
    if (isUnSelectAll === true) {
      handleUnselectAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUnSelectAll]);

  return (
    <div className="overflow-x-auto rounded-md">
      <table className="hidden min-w-full rounded-md md:table" role="table">
        <thead className="bg-tonal-gray">
          <tr role="row">
            {isCheckbox && (
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500  tracking-wider rounded-bl-md">
                {checkboxLabel}
              </th>
            )}
            {columns.map((column, index) => {
              const isFirst = isCheckbox ? false : index === 0;
              const isLast = index === columns.length - 1;
              return (
                <th
                  key={String(column.accessor)}
                  className={`px-5 py-4 text-left text-xs font-medium text-gray-500  tracking-wider cursor-pointer whitespace-nowrap 
                    ${isFirst ? 'rounded-bl-md' : ''} 
                    ${isLast ? 'rounded-br-md' : ''}
                  `}
                  onClick={sortable ? () => requestSort(column.accessor) : undefined}
                  role="columnheader"
                  tabIndex={sortable ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && sortable) {
                      requestSort(column.accessor);
                    }
                  }}
                  aria-sort={
                    sortConfig?.key === column.accessor
                      ? sortConfig.direction === TABLESORT.ASC
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                  scope="col"
                >
                  <div className="flex items-center">
                    {column.header}
                    {sortable && <span className="ml-2">{getSortIcon(column.accessor)}</span>}
                  </div>
                </th>
              );
            })}
            {isAction && (
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500  tracking-wider">
                {isActionLabel ? isActionLabel : 'Actions'}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white py-4 pb-4">
          {sortedData.map((item, index) => (
            <tr key={item.id} role="row">
              {isCheckbox && (
                <td
                  className={cn(
                    'px-5 py-4 whitespace-nowrap text-base text-black font-normal',
                    fieldCss,
                    {
                      'pt-10': index === 0, // Apply extra padding top only for the first td
                    }
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedRows.has(item.id)}
                    onChange={() => handleSelectRow(item.id)}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={`${item.id}-${String(column.accessor)}`}
                  className={cn(
                    `px-6 py-4 whitespace-nowrap text-base text-black font-normal ${
                      modifyCssColumns.includes(column.accessor) ? customColumnsStyle : ''
                    }`,
                    fieldCss,
                    {
                      'cursor-pointer': clickableColumns.includes(column.accessor),
                    },
                    {
                      underline: isClickableUnderLine && clickableColumns.includes(column.accessor),
                    },
                    {
                      'no-underline': item?.notUnderline === false,
                    },
                    {
                      'pt-10': index === 0, // Apply extra padding top only for the first td
                    }
                  )}
                  role="cell"
                  scope="row"
                  onClick={
                    clickableColumns.includes(column.accessor) && item?.notUnderline !== false
                      ? () => onCellClick && onCellClick(item.id, column.accessor, item?.status)
                      : undefined
                  }
                >
                  {quantityControl.includes(column.accessor) ? (
                    <QuantityInput
                      initialQuantity={item[column.accessor] as string}
                      invoiceNumber={item?.id as string}
                      getQuantity={handleQuantityChange}
                    />
                  ) : imageColumns.includes(column.accessor) ? (
                    <Image
                      desktopSrc={item[column.accessor] as string}
                      mobileSrc={item[column.accessor] as string}
                      className="w-16 h-16 object-cover"
                    />
                  ) : filesColumns.includes(column.accessor) ? (
                    item[column.accessor] &&
                    (item[column.accessor] as string).trim() !== '' &&
                    item?.notUnderline !== false ? (
                      <button onClick={(e) => handleFileView(e, item.id)}>
                        <GrDocumentPdf />
                      </button>
                    ) : null
                  ) : (
                    (item[column.accessor] as React.ReactNode)
                  )}
                </td>
              ))}
              {isAction && (
                <td
                  className={cn('px-6 py-4 whitespace-nowrap text-base text-black font-normal', {
                    'pt-10': index === 0, // Apply extra padding top only for the first td
                  })}
                >
                  <div className="flex items-center">
                    {isOnlyDelete === true ? null : (
                      <button
                        className="mr-2 text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          if (onEdit) onEdit(item.id);
                        }}
                        aria-label="Edit"
                      >
                        <FaEdit />
                      </button>
                    )}
                    {isLock === true && item?.isLockable === true && (
                      <button
                        className="mr-2 text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          if (onEdit) onEdit(item.id, item?.isLocked);
                        }}
                        aria-label="Lock"
                      >
                        {item?.isLocked ? <FaLockOpen /> : <FaLock />}
                      </button>
                    )}
                    {item?.isDeletable === true && (
                      <button
                        className="text-gray-500"
                        onClick={() => {
                          if (onDelete) onDelete(item.id);
                        }}
                        aria-label="Delete"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile view */}
      <div className="md:hidden">
        {sortedData.map((item) => (
          <div
            key={item.id}
            className={`${isMobileClassName} mb-4 p-4 border-b bg-white shadow-md`}
          >
            {isCheckbox && (
              <div className="flex  mb-2 border-b border-border-gray pb-3">
                <input
                  type="checkbox"
                  checked={selectedRows.has(item.id)}
                  onChange={() => handleSelectRow(item.id)}
                />
                <span className="font-bold text-base ml-3">{isMobileCheckboxLabel}</span>
              </div>
            )}
            {columns.map((column) => (
              <div
                key={`${item.id}-${String(column.accessor)}`}
                className="flex justify-between mb-2 items-center "
              >
                <span
                  className={cn(` text-xs font-bold text-gray-500`, {
                    'w-1/2': isMobileHalFNHalf,
                  })}
                >
                  {column.header}
                </span>
                <span
                  className={cn(
                    `text-base text-black font-normal ${modifyCssColumns.includes(column.accessor) ? customColumnsStyle : ''}`,
                    fieldCss,
                    { 'cursor-pointer': clickableColumns.includes(column.accessor) },
                    {
                      underline: isClickableUnderLine && clickableColumns.includes(column.accessor),
                    },
                    {
                      'no-underline': item?.notUnderline === false,
                    },
                    { 'w-1/2': isMobileHalFNHalf }
                  )}
                  onClick={
                    clickableColumns.includes(column.accessor) && item?.notUnderline !== false
                      ? () => onCellClick && onCellClick(item.id, column.accessor, item?.status)
                      : undefined
                  }
                >
                  {quantityControl.includes(column.accessor) ? (
                    <QuantityInput
                      initialQuantity={item[column.accessor] as string}
                      invoiceNumber={item?.id as string}
                      getQuantity={handleQuantityChange}
                    />
                  ) : imageColumns.includes(column.accessor) ? (
                    <Image
                      desktopSrc={item[column.accessor] as string}
                      mobileSrc={item[column.accessor] as string}
                      className="w-16 h-16 object-cover"
                    />
                  ) : filesColumns.includes(column.accessor) ? (
                    item[column.accessor] &&
                    (item[column.accessor] as string).trim() !== '' &&
                    item?.notUnderline !== false ? (
                      <button onClick={(e) => handleFileView(e, item.id)}>
                        <GrDocumentPdf />
                      </button>
                    ) : null
                  ) : (
                    (item[column.accessor] as React.ReactNode)
                  )}
                </span>
              </div>
            ))}
            {isAction && (
              <div className="flex justify-end mt-2">
                {isOnlyDelete === true ? null : (
                  <button
                    className="mr-2 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      if (onEdit) onEdit(item.id);
                    }}
                    aria-label="Edit"
                  >
                    <FaEdit />
                  </button>
                )}
                {isLock === true && item?.isLockable === true && (
                  <button
                    className="mr-2 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      if (onEdit) onEdit(item.id);
                    }}
                    aria-label="Lock"
                  >
                    {item?.isLocked ? <FaLockOpen /> : <FaLock />}
                  </button>
                )}
                {item?.isDeletable === true && (
                  <button
                    className="text-gray-500"
                    onClick={() => {
                      if (onDelete) onDelete(item.id);
                    }}
                    aria-label="Delete"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
