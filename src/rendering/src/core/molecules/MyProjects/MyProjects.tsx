import React, { useCallback, useEffect, useState } from 'react';
import { ITypesMyProjectData, ITypesMyProjects, ITypesMyProjectTableData } from './MyProject.type';
import Image from '@/core/atoms/Image/Image';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { ITypesTable } from '@/core/atoms/Table/Table.type';
import Table from '@/core/atoms/Table/Table';
import Pagination from '@/core/atoms/Pagination/Pagination';
import { addressBookTablePageList, DOCUMNETTYPE } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { MyAccountService } from '@/api/services/MyAccountService';
import MyProjectDetails from './MyProjectDetails/MyProjectDetails';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import useDownloadFile from '@/hooks/useDownloadFile';
import { useI18n } from 'next-localization';
const MyProjects = (props: ITypesMyProjects) => {
  const { t } = useI18n();
  const { Title, Icon } = props?.rendering?.fields;
  const { uid } = props?.rendering;
  const { HeadingTag } = props?.params;
  const { mutate: download, isPending: isDownloading } = useDownloadFile();
  const [pageSize, setPageSize] = useState<number | undefined>(5);
  const [projectList, setProjectList] = useState<ITypesMyProjectTableData[]>([]);
  const [selectedIdToPreview, setSelectedIdToPreview] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [docType, setDocType] = useState<string>('');
  const columns: ITypesTable<ITypesMyProjectTableData>['columns'] = [
    { header: t('label_Project_Id'), accessor: 'projectId' },
    { header: t('label_Project_Name'), accessor: 'projectName' },
  ];

  const { data: myProjectData, isLoading } = useQuery({
    queryKey: ['myProjectListData'],
    queryFn: () => {
      return MyAccountService.myAccountGetMyProjects();
    },
  });

  const handleSelectingPageSize = useCallback((currentPageSize: number | undefined) => {
    setPageSize(currentPageSize);
    setCurrentPage(0); // Reset to first page on page size change
  }, []);

  const viewDocumentDetails = (id: string) => {
    setSelectedIdToPreview(id);
  };
  const handleBack = () => {
    setSelectedIdToPreview(null);
  };
  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };
  const currentItems =
    pageSize === undefined
      ? projectList
      : projectList.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const downloadXls = () => {
    const wecoFilter = {
      siteId: '',
      status: '',
      statusDue: '',
      period: '',
      searchBy: '',
      customer: '',
      shipToSelection: '',
      downloadType: DOCUMNETTYPE.XLSX,
      documentType: docType,
    };
    download(wecoFilter);
  };
  useEffect(() => {
    if (myProjectData && myProjectData?.documents?.length > 0) {
      setDocType(myProjectData?.documentType);
      const modifiedProjectList = myProjectData?.documents?.map((item: ITypesMyProjectData) => {
        return {
          id: item?.zzcustom?.projectId,
          projectId: item?.zzcustom?.projectId,
          projectName: item?.zzcustom?.projectName,
        };
      });
      setProjectList(modifiedProjectList);
    }
  }, [myProjectData]);
  return (
    <section key={uid} className="pb-17 md:my-10 md:py-14 container mx-auto px-4">
      {(isLoading || isDownloading) && <LoaderSpinner />}
      {selectedIdToPreview !== null ? (
        <MyProjectDetails
          selectedIdToPreview={selectedIdToPreview}
          Icon={Icon}
          handleBack={handleBack}
          uniqueId={new Date().getTime()}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-12 justify-center rounded-xl border border-gray-300 mb-8 md:mb-6 pb-6 pt-6 md:py-9 md:pb-13 px-4 md:px-9 bg-white gap-10">
            <div className="col-span-2 md:col-span-12 md:col-start-1 flex flex-col gap-y-6 ">
              <div className="w-full">
                <div className=" flex md:flex-row flex-col justify-between md:items-center items-start gap-2">
                  <div className="flex md:items-center items-start">
                    <div className="hidden md:block w-11 h-11 mr-8">
                      <Image field={Icon} />
                    </div>
                    <Text
                      tag={HeadingTag || 'h2'}
                      className="text-left text-xl font-semibold"
                      field={Title}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 justify-center  mb-8 md:mb-16   md:pb-13 bg-white gap-10">
            <div className="col-span-2 md:col-span-12 md:col-start-1 flex flex-col gap-y-6 ">
              <Table
                data={currentItems}
                columns={columns}
                sortable
                clickableColumns={['projectId', 'projectName']}
                isClickableUnderLine
                onCellClick={viewDocumentDetails}
                modifyCssColumns={['projectId']}
                customColumnsStyle={'md:w-7'}
                isMobileHalFNHalf
              />
              <Pagination
                perPageList={addressBookTablePageList}
                currentPageSize={pageSize?.toString() || '5'}
                getSelectedPageSize={handleSelectingPageSize}
                totalItems={projectList?.length}
                itemsPerPage={pageSize || 5}
                isPaging
                onPageChange={handlePageChange}
                isDownload
                onDownload={downloadXls}
                isDownloadDisabled={true}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default MyProjects;
