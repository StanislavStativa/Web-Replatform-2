import Button from '@/core/atoms/Button/Button';
import { ButtonVariant } from '@/core/atoms/Button/Button.type';
import { SIZE } from '@/utils/constants';
import { RxCross1 } from 'react-icons/rx';
import Modal from 'react-responsive-modal';
import { useForm, FormProvider } from 'react-hook-form';
import Input from '@/core/atoms/Form/Input/Input';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  newProjectModalOpen,
  newProjectModelTitle,
  newProjectModelDescription,
  showProjectItemSection,
  newProjectId,
  createNewProjectDetails,
} from '@/core/molecules/Modal/atom';
import { useAtom } from 'jotai';
import { MyAccountService, WECOAddProjectItemRequest } from '@/api';
import { type ITypesProjectDetailsTableData } from '../MyProjects/MyProjectDetails/MyProjectDetails.type';
import Image from '@/core/atoms/Image/Image';
import { ProjectService } from '@/api/services/ProjectService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoaderSpinner from '@/core/atoms/LoaderSpinner/LoaderSpinner';
import NotificationMessage from '@/core/atoms/NotificationMessage/NotificationMessage';
const NewProjectModal = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useAtom(newProjectModalOpen);
  const [title] = useAtom(newProjectModelTitle);
  const [description] = useAtom(newProjectModelDescription);
  const [showProjectItem] = useAtom(showProjectItemSection);
  const [newprojectId] = useAtom(newProjectId);
  const [newProjectDetails] = useAtom(createNewProjectDetails);
  const formMethods = useForm();
  const [textValue, setTextValue] = useState<string>('');
  const router = useRouter();
  const [showError, setShowError] = useState<boolean>(false);
  const [addProjectId, setAddProjectId] = useState<string>('');
  const pathname = router.query.path;
  const path = pathname && pathname[pathname?.length - 1]?.split('-');
  const productId = router?.asPath === '/' ? '' : path && path[path?.length - 1];
  const { mutate: saveProject, isPending: isSavePending } = useMutation({
    mutationFn: async (basketId: string) => {
      return await ProjectService.projectSaveProject(basketId);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [`myProjectListData`] });
        handleCloseModal();
      }
    },
    onError: () => {
      setShowError(true);
    },
  });

  const { mutate: addItemToProject, isPending: isAddItemPending } = useMutation({
    mutationFn: (productData: WECOAddProjectItemRequest) => {
      return ProjectService.projectAddItemToProject(productData);
    },
    onSuccess: (data, variable) => {
      if (data) {
        saveProject(variable?.basketGuid as string);
      } else {
        setShowError(true);
      }
    },
    onError: () => {
      setShowError(true);
    },
  });

  const { mutate: addProjectName, isPending: isAddNamePending } = useMutation({
    mutationFn: (basketId?: string) => {
      const formattedBasketId = decodeURIComponent(basketId || '');
      return ProjectService.projectAddProjectName(formattedBasketId, addProjectId, textValue);
    },
    onSuccess: (data, variable) => {
      if (data) {
        addItemToProject({
          basketGuid: variable,
          extMaterialNumber: Number(productId),
          quantity: Number(newProjectDetails?.quantity),
          zzcustom: {
            unitOfMeasure: newProjectDetails?.unit,
          },
        });
        // handleCloseModal();
      } else {
        setShowError(true);
      }
    },
    onError: () => {
      setShowError(true);
    },
  });

  const { mutate: createNewProject, isPending: isCreateNewPending } = useMutation({
    mutationFn: async () => {
      return await ProjectService.projectCreateNewProject();
    },
    onSuccess: (data) => {
      if (data?.id) {
        setAddProjectId(data?.header?.zzcustom?.project?.projectid);
        addProjectName(data?.id);
      } else {
        setShowError(true);
      }
    },
    onError: () => {
      setShowError(true);
    },
  });

  const getBasketId = () => {
    createNewProject();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const setInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTextValue(value);
  };
  const [projectDetails, setProjectDetails] = useState<ITypesProjectDetailsTableData[]>([]);
  const { data: myProjectDetailsData } = useQuery({
    queryKey: ['myProjectDetailsData', newprojectId],
    queryFn: () => {
      return newprojectId !== '' ? MyAccountService.myAccountGetProjectDetail(newprojectId) : null;
    },
    enabled: newprojectId !== '',
  });

  useEffect(() => {
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
            id: item.id,
            sku: item.extMaterialNumber,
            image: productImage,
            description: item.description,
            qty: `${item.quantity} ${item.unit}`,
          };
        }
      );
      setProjectDetails(modifiedItemsList);
    }
  }, [myProjectDetailsData]);
  const handleViewProject = () => {
    router.push('/My-Account/Projects/My-Projects');
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (showError) {
      timeoutId = setTimeout(() => {
        setShowError(false);
      }, 10000); // 3 seconds
    }

    return () => clearTimeout(timeoutId);
  }, [showError]);
  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      showCloseIcon={false}
      center
      classNames={{
        modal: 'bg-white !rounded-md !p-6 shadow-lg  w-[90%] max-w-lg',
      }}
    >
      {(isCreateNewPending || isAddNamePending || isAddItemPending || isSavePending) && (
        <LoaderSpinner />
      )}
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-3 md:gap-0 mb-10">
            <h2 className="text-xl leading-10 font-light">{title}</h2>
            <RxCross1 size="18px" onClick={handleCloseModal} />
          </div>
          {showError && <NotificationMessage isCloseable onCancel={() => setShowError(false)} />}
          {showProjectItem === false && (
            <>
              <p className="text-base font-bold leading-6 uppercase">{description}</p>
              <em>Max 40 Characters</em>
            </>
          )}
        </div>
        {showProjectItem === false ? (
          <>
            <FormProvider {...formMethods}>
              <Input
                name="Project name"
                inputType="text"
                value={textValue}
                placeholder=""
                onChange={setInput}
                className="mb-7.5 w-414 max-w-full border border-gray-400"
              />
            </FormProvider>
            <div className="flex justify-start gap-x-3">
              <Button
                className="py-2.5 px-10 text-dark-gray bg-tonal-gray border border-tonal-gray font-normal uppercase rounded-md text-sm leading-4.25"
                variant={ButtonVariant.OUTLINE}
                size={SIZE.MEDIUM}
                onClick={getBasketId}
              >
                Create
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start">
              {projectDetails && (
                <Image
                  desktopSrc={projectDetails[0]?.image as string}
                  mobileSrc={projectDetails[0]?.image as string}
                  className="float-left w-122 object-cover"
                  alt={projectDetails[0]?.description}
                />
              )}
              <div className="ml-4">
                <p className="text-base font-normal leading-6 mb-10">{description}</p>
                <Button
                  className="mr-2.5 py-2.5 px-10 text-dark-gray bg-tonal-gray border border-tonal-gray font-normal uppercase rounded-md text-sm leading-4.25"
                  variant={ButtonVariant.OUTLINE}
                  size={SIZE.MEDIUM}
                  onClick={handleViewProject}
                >
                  View Project
                </Button>
                <Button
                  className="py-2.5 px-10 text-dark-gray bg-tonal-gray border border-tonal-gray font-normal uppercase rounded-md text-sm leading-4.25"
                  variant={ButtonVariant.OUTLINE}
                  size={SIZE.MEDIUM}
                  onClick={handleCloseModal}
                >
                  Keep Browsing
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
export default NewProjectModal;
