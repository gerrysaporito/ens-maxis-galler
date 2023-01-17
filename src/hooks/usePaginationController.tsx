import { Select } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { PaginationController } from '@app/components/frame/PaginationController';

import { useUpdateRouterQuery } from './useUpdateRouterQuery';

const pageLimits = [25, 50, 100];
export const usePaginationController = ({
  collectionSize,
}: {
  collectionSize: number;
}) => {
  const router = useRouter();
  const { query } = router;
  const { updateRouterQuery } = useUpdateRouterQuery();

  const [pageNumber, setPageNumber] = useState(
    query.pageNumber && parseInt(query.pageNumber as string) > 0
      ? parseInt(query.pageNumber as string)
      : 1,
  );
  const [limitPerPage, setLimitPerPage] = useState(
    query.limit ? parseInt(query.limit as string) : pageLimits[0],
  );
  const [resultsSize, setResultsSize] = useState(collectionSize);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageNumber]);

  const onLimitPerPageChange: React.ChangeEventHandler<HTMLSelectElement> = (
    e,
  ) => {
    const val = parseInt(e.target.value ?? '25');
    setLimitPerPage(parseInt(e.target.value) ?? 25);
    setPageNumber(1);
    updateRouterQuery({ limit: val.toString(), pageNumber: '1' });
  };

  const PageChangeSelector: React.FC = () => (
    <Select
      minW='100px'
      defaultValue={limitPerPage}
      onChange={onLimitPerPageChange}
    >
      {pageLimits.map((limit) => (
        <option key={limit} value={limit}>
          {limit}
        </option>
      ))}
    </Select>
  );

  const PageController: React.FC<{ isDropdown?: boolean }> = ({
    isDropdown,
  }) => (
    <PaginationController
      pageNumber={pageNumber}
      setPageNumber={setPageNumber}
      numPages={Math.ceil(resultsSize / limitPerPage)}
      isDropdown={isDropdown}
    />
  );

  return {
    limitPerPage,
    pageNumber,
    PageChangeSelector,
    PageController,
    setPageNumber,
    setResultsSize,
  };
};
