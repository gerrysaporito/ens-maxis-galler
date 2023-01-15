import { useRouter } from 'next/router';

export const useUpdateRouterQuery = () => {
  const router = useRouter();

  const updateRouterQuery = (query: {
    [key: string]: string | null | undefined;
  }) => {
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, ...query },
      },
      undefined,
      { shallow: true },
    );
  };

  return { updateRouterQuery };
};
