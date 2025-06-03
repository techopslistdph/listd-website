import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type ParamValue = string | number | boolean | null | undefined;
type ParamsObject = Record<string, ParamValue>;

export function useUrlParams() {
  const searchParams = useSearchParams();
  
  const getParam = useCallback((key: string): string | null => {
    return searchParams.get(key);
  }, [searchParams]);

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
     */
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        urlSearchParams.append(key, String(value));
      }
    });

    return urlSearchParams.toString();
  }, []);

  return {
    getParam,
    getAllParams,
    createParamsString,
  };
} 