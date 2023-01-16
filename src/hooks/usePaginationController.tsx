import { Select } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { PaginationController } from '@app/components/frame/PaginationController';

import { useUpdateRouterQuery } from './useUpdateRouterQuery';

export const usePaginationController = ({
  collectionSize,
  pageLimits,
}: {
  collectionSize?: number;
  numPages?: number;
  pageLimits?: number[];
}) => {
  const _pageLimits = pageLimits ?? [25, 50, 100];
  const router = useRouter();
  const { query } = router;
  const { updateRouterQuery } = useUpdateRouterQuery();
  const [pageNumber, setPageNumber] = useState(
    query.pageNumber && parseInt(query.pageNumber as string) > 0
      ? parseInt(query.pageNumber as string)
      : 1,
  );
  const [limitPerPage, setLimitPerPage] = useState(
    query.limit ? parseInt(query.limit as string) : _pageLimits[0],
  );
  const [numPages, setNumPages] = useState(
    (collectionSize ?? 10_000) / limitPerPage,
  );

  const onLimitPerPageChange: React.ChangeEventHandler<HTMLSelectElement> = (
    e,
  ) => {
    e.preventDefault();
    setLimitPerPage(parseInt(e.target.value) ?? 25);
    setPageNumber(1);
    setNumPages((collectionSize ?? 10_000) / parseInt(e.target.value ?? '25'));
    updateRouterQuery({ limit: e.target.value || '25', pageNumber: '1' });
  };

  const PageChangeSelector: React.FC = () => (
    <Select
      width='125px'
      defaultValue={limitPerPage}
      onChange={onLimitPerPageChange}
    >
      {_pageLimits.map((limit) => (
        <option key={limit} value={limit}>
          {limit}
        </option>
      ))}
    </Select>
  );

  const PageController: React.FC = () => (
    <PaginationController
      pageNumber={pageNumber}
      setPageNumber={setPageNumber}
      numPages={numPages}
    />
  );

  return {
    limitPerPage,
    pageNumber,
    setPageNumber,
    PageChangeSelector,
    PageController,
  };
};
