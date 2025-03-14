"use client";

import {useRouter, useSearchParams} from "next/navigation";
import React, {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
} from "react";

type ProductState = {
  [key: string]: string;
} & {
  image?: string;
};

type ProductContextType = {
  state: ProductState;
  updateOption: (name: string, value: string) => ProductState;
  updateImage: (index: string) => ProductState;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

function SearchParamsWrapper({children}: {children: React.ReactNode}) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

function ProductProviderContent({children}: {children: React.ReactNode}) {
  const searchParams = useSearchParams();
  const [initialState, setInitialState] = useState<ProductState>({});

  useEffect(() => {
    const params: ProductState = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    setInitialState(params);
  }, [searchParams]);

  const [state, setOptimisticState] = useOptimistic(
    initialState,
    (prevState: ProductState, update: ProductState) => ({
      ...prevState,
      ...update,
    })
  );

  const updateOption = (name: string, value: string) => {
    const newState = {[name]: value};
    setOptimisticState(newState);
    return {...state, ...newState};
  };

  const updateImage = (index: string) => {
    const newState = {image: index};
    setOptimisticState(newState);
    return {...state, ...newState};
  };

  const value = useMemo(
    () => ({
      state,
      updateOption,
      updateImage,
    }),
    [state]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function ProductProvider({children}: {children: React.ReactNode}) {
  return (
    <SearchParamsWrapper>
      <ProductProviderContent>{children}</ProductProviderContent>
    </SearchParamsWrapper>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}

export function useUpdateURL() {
  const router = useRouter();

  return (state: ProductState) => {
    const newParams = new URLSearchParams(window.location.search);
    Object.entries(state).forEach(([key, value]) => {
      newParams.set(key, value);
    });
    router.push(`?${newParams.toString()}`, {scroll: false});
  };
}
