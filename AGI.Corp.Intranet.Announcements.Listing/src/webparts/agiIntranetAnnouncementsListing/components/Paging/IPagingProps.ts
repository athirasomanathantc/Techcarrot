
export interface IPagingProps {
    totalItems: number;
    itemsCountPerPage: number;
    onPageUpdate: (selectedPageNumber: number) => void;
    currentPage: number;
  }
  