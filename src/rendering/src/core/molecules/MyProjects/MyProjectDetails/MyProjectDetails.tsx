import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  ITypesDeleteProduct,
  ITypesMyProjectDetails,
  ITypesProjectDetails,
  ITypesProjectDetailsTableData,
  ITypesProjectSuccessTableData,
  ITypesUpdateProduct,
} from './MyProjectDetails.type';
import Image from '@/core/atoms/Image/Image';
import { MyAccountService } from '@/api/services/MyAccountService';
import { useI18n } from 'next-localization';
import { ITypesTable } from '@/core/atoms/Table/Table.type';
import Table from '@/core/atoms/Table/Table';
import CustomSelect from '@/core/atoms/Select/Select';
import { DOCUMNETTYPE, PDPURL, projectDownloadType, SIZE } from '@/utils/constants';

import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import { ProjectService } from '@/api/services/ProjectService';
import { WECOUpdateProjectRequest } from '@/api/models/WECOUpdateProjectRequest';
import { WECOUpdateProjectItemRequest } from '@/api/models/WECOUpdateProjectItemRequest';
import { useRouter } from 'next/router';
import useDownloadFile from '@/hooks/useDownloadFile';
import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';

import { useReactToPrint } from 'react-to-print';
const MyProjectDetails = ({
  selectedIdToPreview,
  Icon,
  handleBack,
  uniqueId,
}: ITypesMyProjectDetails) => {
  const contentToPrint = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const router = useRouter();
  const [projectDetails, setProjectDetails] = useState<ITypesProjectDetails | null>(null);
  const [projectList, setProjectList] = useState([]);
  const [editProjectList, setEditProjectList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isConfirmPage, setIsConfirmPage] = useState<boolean>(false);
  const [basketId, setBasketId] = useState<string | null>(null);
  const [docType, setDocType] = useState<null | string>(null);
  // const [docId, setDocId] = useState<null | string>(null);
  const [updateProductItems, setUpdatedProductItems] = useState<ITypesUpdateProduct[] | []>([]);
  const [deletedProduct, setDeletedProduct] = useState<ITypesDeleteProduct[] | []>([]);
  const { data: myProjectDetailsData, isLoading } = useQuery({
    queryKey: ['myProjectDetailsData', selectedIdToPreview, isEdit, uniqueId],
    queryFn: () => {
      return MyAccountService.myAccountGetProjectDetail(selectedIdToPreview);
    },
    enabled: Boolean(selectedIdToPreview !== null && isEdit === false),
  });

  const { mutate: updateProject, isPending: isUpdatePending } = useMutation({
    mutationFn: async (data: WECOUpdateProjectRequest) => {
      return await ProjectService.projectUpdateProject(data);
    },
    onSuccess: (data) => {
      if (data) {
        setBasketId(data?.id);
        const modifiedItemsList = data?.items?.map(
          (item: {
            id: string;
            extMaterialNumber: string;
            description: string;
            zzcustom: { unitOfMeasure: string };
            quantity: string;
            isDeletable: boolean;
          }) => {
            const productImage = `${process.env.NEXT_PUBLIC_IMAGE_URL}${Number(item.extMaterialNumber)}?$PDPThumbnail$`;
            return {
              id: item?.id,
              sku: item.extMaterialNumber,
              image: productImage,
              description: item.description,
              qty: `${item.quantity} ${item.zzcustom?.unitOfMeasure}`,
              isDeletable: item?.isDeletable,
            };
          }
        );
        setEditProjectList(modifiedItemsList);
      }
    },
    onError: () => {
      //   setShowError(true);
    },
    retry: 3,
  });

  const { mutate: saveProject, isPending: isSavePending } = useMutation({
    mutationFn: async (basketId: string) => {
      return await ProjectService.projectSaveProject(basketId);
    },
    onSuccess: (data) => {
      if (data) {
        if (deletedProduct?.length > 0) {
          setDeletedProduct([]);
          isEditRefetch();
        } else {
          setIsConfirmPage(true);
          setIsEdit(false);
          setBasketId(data?.id);
        }
      }
    },
    onError: () => {
      //   setShowError(true);
    },
  });
  const { mutate: editProduct, isPending: isEditPending } = useMutation({
    mutationFn: async (data: WECOUpdateProjectItemRequest) => {
      return await ProjectService.projectEditProjectItems(data);
    },
    onSuccess: () => {
      saveProject(basketId as string);
    },
    onError: () => {
      //   setShowError(true);
    },
  });
  const { mutate: deleteProduct, isPending: isDeletePending } = useMutation({
    mutationFn: async (data: { basketId?: string; basketItemGuid?: string }) => {
      return await ProjectService.projectDeleteProjectItems(data.basketId, data.basketItemGuid);
    },
    onSuccess: (_, variable) => {
      saveProject(basketId as string);
      setDeletedProduct((prev) => [
        ...prev,
        {
          id: variable?.basketItemGuid || '', // Add a fallback in case `variable?.basketItemGuid` is undefined
        },
      ]);
    },
    onError: () => {
      //   setShowError(true);
    },
  });
  const { mutate: download, isPending: isDownloading } = useDownloadFile();
  const columns: ITypesTable<ITypesProjectDetailsTableData>['columns'] = [
    { header: t('label_SKU'), accessor: 'sku' },
    { header: t('label_Image'), accessor: 'image' },
    { header: t('label_Description'), accessor: 'description' },
    { header: t('label_QTY'), accessor: 'qty' },
  ];
  const columnsSucess: ITypesTable<ITypesProjectSuccessTableData>['columns'] = [
    { header: t('label_Image'), accessor: 'image' },
    { header: t('label_QTY'), accessor: 'qty' },
    { header: t('label_SKU'), accessor: 'sku' },

    { header: t('label_Description'), accessor: 'description' },
  ];

  const onPrint = useReactToPrint({
    removeAfterPrint: true,
  });
  const handlePrint = () => {
    onPrint(null, () => contentToPrint.current);
  };
  const viewDocumentDetails = (id: string) => {
    router.push(`/${PDPURL}/${id}`);
  };
  const openEdit = () => {
    setIsEdit(true);
  };
  const closeEdit = () => {
    // Show the confirmation dialog
    const message = t('cancel_message');
    if (window !== undefined) {
      const userConfirmed = window.confirm(message);

      if (userConfirmed) {
        // User clicked "OK"
        setIsEdit(false);
      } else {
        // User clicked "Cancel"
      }
    }
  };
  const handleSelectingFileType = useCallback((selectedFiled: string) => {
    console.log(selectedFiled);
  }, []);

  const handleSubmitProject = () => {
    editProduct({
      basketGuid: basketId,
      projectItems: updateProductItems,
    });
  };

  const getQuantity = (quantity: number, id: string) => {
    setUpdatedProductItems((prevItems) => {
      const itemIndex = prevItems.findIndex((item: { id: string }) => item?.id === id);
      if (itemIndex !== -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[itemIndex].quantity = quantity;
        return updatedItems;
      } else {
        // Add new item if it doesn't exist
        return [...prevItems, { id, quantity }];
      }
    });
  };

  const handleCloseConfirm = () => {
    setIsConfirmPage(false);
  };

  const handleDownload = () => {
    const wecoFilter = {
      siteId: '',
      status: '',
      statusDue: '',
      period: '',
      searchBy: '',
      customer: '',
      shipToSelection: '',
      downloadType: DOCUMNETTYPE.CSV,
      documentType: docType,
      docNumber: selectedIdToPreview,
      // pdfsId: getSelectedInvoice && getSelectedInvoice.in,
    };
    download(wecoFilter);
  };

  const handleDelete = (id: string) => {
    deleteProduct({
      basketId: basketId as string,
      basketItemGuid: id,
    });
  };
  const isEditRefetch = () => {
    updateProject({
      mode: 'UPD',
      documentId: String(selectedIdToPreview),
    });
  };
  useEffect(() => {
    setDocType(myProjectDetailsData?.documentType);
    // setDocId(myProjectDetailsData?.id);
    if (myProjectDetailsData && isEdit === false) {
      const modifiedDetails = {
        isDeletable: myProjectDetailsData?.isDeletable,
        isEditable: myProjectDetailsData?.isEditable,
        title: myProjectDetailsData?.header?.zzcustom?.project?.projectname,
      };
      setProjectDetails(modifiedDetails);
      if (myProjectDetailsData?.items?.length > 0) {
        const modifiedItemsList = myProjectDetailsData?.items?.map(
          (item: {
            id: string;
            extMaterialNumber: string;
            description: string;
            unit: string;
            quantity: string;
          }) => {
            const modifyingProductSku = item.extMaterialNumber.replace(/SS/g, '');
            const productImage = `${process.env.NEXT_PUBLIC_IMAGE_URL}${Number(modifyingProductSku)}?$PDPThumbnail$`;
            return {
              id: item.extMaterialNumber,
              sku: item.extMaterialNumber,
              image: productImage,
              description: item.description,
              qty: `${item.quantity} ${item.unit}`,
              isDeletable: true,
            };
          }
        );
        setProjectList(modifiedItemsList);
      }
    }
  }, [myProjectDetailsData, isEdit]);

  useEffect(() => {
    if (selectedIdToPreview && isEdit === true) {
      updateProject({
        mode: 'UPD',
        documentId: String(selectedIdToPreview),
      });
    }
  }, [selectedIdToPreview, isEdit]);

  // useEffect(() => {
  //   if (deletedProduct?.length > 0 && editProjectList?.length > 0) {
  //     // Create an array of ids from deletedProduct
  //     const deletedProductIds = deletedProduct?.map((product) => product?.id);

  //     // Filter editProjectList to exclude items with ids present in deletedProductIds
  //     const filteredProduct = editProjectList?.filter(
  //       (item: { id: string }) => !deletedProductIds?.includes(item?.id)
  //     );
  //     setEditProjectList(filteredProduct);
  //     console.log('Filtered editProjectList:', filteredProduct);
  //   }
  // }, [editProjectList, deletedProduct]);
  return (
    <div ref={contentToPrint}>
      {(isLoading || isSavePending || isEditPending || isUpdatePending || isDeletePending) && (
        <LoaderSpinner />
      )}
      {!isConfirmPage && (
        <div>
          <button className="text-xs font-bold mb-3" onClick={handleBack}>
            <span>{`<`}</span> {t('label_Back')}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 justify-center rounded-xl border border-gray-300 mb-8 md:mb-6 pt-6 pb-6 md:py-9 md:pb-13 px-4 md:px-9 bg-white gap-10">
        <div className="col-span-2 md:col-span-12 md:col-start-1 flex flex-col gap-y-6 ">
          <div className="w-full">
            <div className=" flex md:flex-row flex-col justify-between md:items-center items-start gap-2">
              <div className="flex md:items-center items-start">
                <div className="hidden md:block w-11 h-11 mr-8">
                  <Image field={Icon} />
                </div>
                <h2 className="text-left text-xl font-semibold">
                  {isConfirmPage
                    ? `Project Confirmation ${projectDetails?.title}`
                    : projectDetails?.title}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1  md:grid-cols-12 justify-center  mb-8 md:mb-16   pb-13 bg-white gap-10">
        <div className="col-span-2 md:col-span-12 md:col-start-1 flex flex-col gap-y-6 ">
          {isEdit && editProjectList?.length > 0 && (
            <Table
              data={editProjectList}
              columns={columns}
              sortable
              clickableColumns={['sku', 'image']}
              isClickableUnderLine
              onCellClick={viewDocumentDetails}
              imageColumns={['image']}
              quantityControl={['qty']}
              modifyCssColumns={['qty']}
              customColumnsStyle={'md:w-7'}
              isAction
              isOnlyDelete
              getQuantityUpdate={getQuantity}
              isMobileHalFNHalf
              onDelete={handleDelete}
            />
          )}
          {isEdit === false && projectList?.length > 0 && (
            <Table
              data={projectList}
              columns={isConfirmPage ? columnsSucess : columns}
              sortable
              clickableColumns={['sku', 'image']}
              isClickableUnderLine
              onCellClick={viewDocumentDetails}
              modifyCssColumns={['qty', 'description', 'sku']}
              imageColumns={['image']}
              isMobileHalFNHalf
            />
          )}
          {!isConfirmPage && (
            <div className="flex flex-col md:flex-row align-middle justify-between bg-dark-gray rounded-md py-3 pb-3 px-4 pr-4">
              {isEdit ? (
                <div className="flex-1 flex align-middle items-center">
                  {projectDetails?.isEditable && (
                    <button
                      className="px-2 py-1 bg-gray-200 text-white underline"
                      onClick={isEditRefetch}
                    >
                      {t('Cart_RefreshProject')}
                    </button>
                  )}
                  <button
                    className="px-2 py-1 bg-gray-200 text-white underline"
                    onClick={handleSubmitProject}
                  >
                    {t('Common_Save')}
                  </button>
                  <button
                    className="px-2 py-1 bg-gray-200 text-white underline"
                    onClick={closeEdit}
                  >
                    {t('Labels_Cancel')}
                  </button>
                </div>
              ) : (
                <div className=" flex align-middle items-center justify-center md:justify-start w-full">
                  <div className=" w-65 flex align-middle items-center flex-row gap-4  ">
                    {projectDetails?.isEditable && (
                      <button
                        className="px-2 py-1 bg-gray-200 text-white underline"
                        onClick={openEdit}
                      >
                        Edit
                      </button>
                    )}

                    <button
                      disabled={isDownloading}
                      className="px-2 py-1 bg-gray-200 text-white underline"
                      onClick={handleDownload}
                    >
                      {t('Cart_Download')}
                    </button>
                    <div className="max-w-24">
                      <CustomSelect
                        className="py-0 px-2 min-w-24"
                        options={projectDownloadType}
                        selected={DOCUMNETTYPE.CSV}
                        onSelect={handleSelectingFileType}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {isConfirmPage && (
            <div className="flex w-full md:w-auto flex-col md:flex-row gap-3">
              <Button
                size={SIZE.MEDIUM}
                onClick={handleCloseConfirm}
                variant={ButtonVariant.OUTLINE}
              >
                {t('Cart_Close')}
              </Button>
              <Button size={SIZE.MEDIUM} onClick={handlePrint}>
                {t('Cart_Print')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(MyProjectDetails);
