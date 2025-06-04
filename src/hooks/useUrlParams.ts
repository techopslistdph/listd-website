import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type ParamValue = string | number | boolean | null | undefined;
type ParamsObject = Record<string, ParamValue>;

/**
 * Convert a string to a URL-friendly slug
 * - Converts to lowercase
 * - Replaces spaces and special characters with hyphens
 * - Removes multiple consecutive hyphens
 * - Removes leading/trailing hyphens
 */
const slugify = (text: string): string => {
  return (
    text
      .toLowerCase()
      .trim()
      // Replace spaces and underscores with hyphens
      .replace(/[\s_]+/g, '-')
      // Remove special characters except hyphens
      .replace(/[^a-z0-9-]/g, '')
      // Replace multiple consecutive hyphens with single hyphen
      .replace(/-+/g, '-')
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, '')
  );
};

export function useUrlParams() {
  const searchParams = useSearchParams();

  const getParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  const getAllParams = useCallback((): ParamsObject => {
    const result: ParamsObject = {};

    searchParams.forEach((value, key) => {
      result[key] = value;
    });

    return result;
  }, [searchParams]);

  const createParamsString = useCallback((params: ParamsObject): string => {
    const urlSearchParams = new URLSearchParams();

    /**
     * Add parameters to URLSearchParams, filtering out null/undefined values
     * and converting all values to URL-friendly slugs
     */
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        urlSearchParams.append(key, slugify(String(value)));
      }
    });

    return urlSearchParams.toString();
  }, []);

  const updateParams = useCallback(
    (newParams: ParamsObject): string => {
      console.log({ newParams });
      const currentParams = getAllParams();
      const mergedParams = { ...currentParams, ...newParams };
      return createParamsString(mergedParams);
    },
    [getAllParams, createParamsString]
  );

  const deleteParams = useCallback(
    (keys: string[]): string => {
      const currentParams = getAllParams();
      const remainingParams = { ...currentParams };

      keys.forEach(key => {
        delete remainingParams[key];
      });

      return createParamsString(remainingParams);
    },
    [getAllParams, createParamsString]
  );

  return {
    getParam,
    getAllParams,
    createParamsString,
    updateParams,
    deleteParams,
  };
}
