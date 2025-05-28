import React, { useEffect, useState } from 'react';
import { ProductAttributesProps } from './ProductAttributes.types';
import { FaPinterestP, FaHouzz, FaHeart, FaPrint } from 'react-icons/fa';
import { useI18n } from 'next-localization';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { authorizationAtom } from '@/data/atoms/authorization';
import { ITypesMyProjectData, ITypesMyProjectTableData } from '../MyProjects/MyProject.type';
import {
  newProjectId,
  newProjectModalOpen,
  newProjectModelDescription,
  newProjectModelTitle,
  showProjectItemSection,
} from '@/core/molecules/Modal/atom';
import NewProjectModal from '../Modal/NewProjectModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  MyAccountService,
  ProjectService,
  WECOAddProjectItemRequest,
  WECOUpdateProjectRequest,
} from '@/api';
import { ROUTES } from 'src/utils/routes';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';

const PDPIcon: React.FC<ProductAttributesProps> = (props) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const router = useRouter();
  const visualizerUrl = `https://visualizer.tileshop.com/?sku=${encodeURIComponent(props?.data?.PriceSchedule?.xp?.ProductId)}`;
  const { t } = useI18n();
  const [{ isAuthenticated }] = useAtom(authorizationAtom);
  const toggleSignIn = () => {
    setShowSignIn(!showSignIn);
  };
  const [, setIsModalOpen] = useAtom(newProjectModalOpen);
  const [, setshowProjectItemn] = useAtom(showProjectItemSection);
  const [, setDescription] = useAtom(newProjectModelDescription);
  const [, setTitle] = useAtom(newProjectModelTitle);
  const [, setProjectId] = useAtom(newProjectId);
  const [projectList, setProjectList] = useState<ITypesMyProjectTableData[]>([]);
  const { data: myProjectData } = useQuery({
    queryKey: ['myProjectListData'],
    queryFn: () => {
      return MyAccountService.myAccountGetMyProjects();
    },
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });
  //save item added to project
  const { mutate: saveProject, isPending: isSavePending } = useMutation({
    mutationFn: async (basketId: string) => {
      return await ProjectService.projectSaveProject(basketId);
    },
    onSuccess: (data) => {
      if (data) {
        setIsModalOpen(true);
        setShowSignIn(false);
      }
    },
    onError: () => {},
  });
  // add item to project
  const { mutate: addItemToProject, isPending: isAddItemPending } = useMutation({
    mutationFn: (productData: WECOAddProjectItemRequest) => {
      return ProjectService.projectAddItemToProject(productData);
    },
    onSuccess: (data, variable) => {
      if (data) {
        saveProject(variable?.basketGuid as string);
      } else {
      }
    },
    onError: () => {},
  });
  // get basket id
  const { mutate: updateProject, isPending: isUpdatePending } = useMutation({
    mutationFn: async (data: WECOUpdateProjectRequest) => {
      return await ProjectService.projectUpdateProject(data);
    },
    onSuccess: (data) => {
      if (data) {
        addItemToProject({
          basketGuid: data?.id,
          extMaterialNumber: Number(props?.data?.PriceSchedule?.xp?.ProductId),
          quantity: Number(1),
          zzcustom: {
            unitOfMeasure: 'BX',
          },
        });
      } else {
      }
    },
    onError: () => {
      //   setShowError(true);
    },
    retry: 3,
  });
  useEffect(() => {
    if (myProjectData && myProjectData?.documents?.length > 0) {
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
  const handleClick = (value: boolean, name: string, projectId: string) => {
    if (value) {
      updateProject({
        mode: 'UPD',
        documentId: String(projectId),
      });
      setshowProjectItemn(value);
      setDescription(`Item saved to ${name} project list.`);
      setTitle('ITEM ADDED');
      setProjectId(projectId);
    } else {
      setshowProjectItemn(value);
      setDescription('PROJECT NAME');
      setTitle('NEW PROJECT');
      setProjectId('');
      setIsModalOpen(true);
      setShowSignIn(false);
    }
  };
  const handleClickSign = () => {
    router.push(`${ROUTES?.SIGNIN}?returnurl=${router.asPath}`);
  };
  return (
    <>
      {(isUpdatePending || isAddItemPending || isSavePending) && <LoaderSpinner />}
      <div className="flex justify-between h-26 items-center mt-6">
        <div className="flex gap-2">
          <a
            className="cursor-pointer"
            href="https://www.pinterest.com/pin/create/button/"
            data-pin-do="buttonBookmark"
            data-pin-custom="true"
            target="_blank"
            title={t('PDPAttributes_SaveToPinterest')}
          >
            <FaPinterestP className="text-pdp-icon" />
          </a>
          <a
            className="cursor-pointer"
            href="https://www.houzz.com/imageClipperUpload?link=%2fproducts%2f%2c-w-%2c&amp;source=button&amp;hzid=59706&amp;imageUrl=https%3a%2f%2fs7d1.scene7.com%2fis%2fimage%2fTileShop%2f680184&amp;title=White+Hex+Porcelain+Wall+and+Floor+Tile+-+10+in.&amp;ref=%2fproducts%2f%2c-w-%2c"
            target="_blank"
            title={t('PDPAttributes_SaveToHouzz')}
          >
            <FaHouzz className="text-pdp-icon" />
          </a>
          <a className="cursor-pointer" onClick={() => window.print()} title="Print">
            <FaPrint className="text-pdp-icon" />
          </a>
          <div className="relative">
            <FaHeart
              onClick={toggleSignIn}
              className="text-pdp-icon cursor-pointer"
              title={t('PDPAttributes_SaveToProject')}
            />
            {showSignIn && (
              <div className="absolute  min-w-[200px] z-[1000] ">
                {isAuthenticated ? (
                  <div
                    className="origin-top-right absolute mt-2 w-56 shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                  >
                    <div className="py-1" role="none">
                      {projectList &&
                        projectList?.map((project, index) => (
                          <a
                            title={t('PDPAttributes_SaveToHouzz')}
                            key={project.projectId}
                            href="#"
                            className="text-gray-700 block px-4 py-2 text-sm hover:bg-tonal-gray"
                            role="menuitem"
                            id={`menu-item-${index}`}
                            onClick={() =>
                              handleClick(true, project?.projectName, project?.projectId)
                            }
                          >
                            {project?.projectName}
                          </a>
                        ))}
                      <div className="border-t-2 border-tonal-gray my-1"></div>
                      <a
                        href="#"
                        title={t('PDPAttributes_SaveToProject')}
                        className="text-gray-700 font-bold  px-4 py-2 text-sm hover:bg-gray-100 flex items-center hover:bg-tonal-gray"
                        role="menuitem"
                        onClick={() => handleClick(false, '', '')}
                      >
                        Create a Project
                        <span className="ml-2">+</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div
                    className="origin-top-right absolute mt-2 w-56 shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                  >
                    <a
                      title={t('PDPAttributes_SaveToProject')}
                      href="#"
                      onClick={handleClickSign}
                      className="text-gray-700 font-bold  px-4 py-2 text-sm hover:bg-gray-100 flex items-center hover:bg-tonal-gray"
                    >
                      {t('Labels_SignIn')}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {props?.data?.IsSample === false && props?.data?.SellingUOM !== 'EA' && (
          <a
            title={t('PDPAttributes_ViewInTileVisualizer')}
            className="font-latoBold text-sm underline text-black inline cursor-pointer"
            target="_blank"
            href={visualizerUrl}
          >
            {t('PDPAttributes_ViewInTileVisualizer')}
          </a>
        )}
      </div>
      <NewProjectModal />
    </>
  );
};

export default PDPIcon;
