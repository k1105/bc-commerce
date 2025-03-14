"use client";

import {usePathname, useSearchParams} from "next/navigation";
import {Suspense, useEffect, useRef, useState} from "react";

import {ChevronDownIcon} from "@heroicons/react/24/outline";
import type {ListItem} from ".";
import {FilterItem} from "./item";

function SearchParamsWrapper({children}: {children: React.ReactNode}) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

export default function FilterItemDropdown({list}: {list: ListItem[]}) {
  const pathname = usePathname();
  const [active, setActive] = useState("");
  const [openSelect, setOpenSelect] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <SearchParamsWrapper>
      <FilterItemDropdownContent
        list={list}
        pathname={pathname}
        active={active}
        setActive={setActive}
        openSelect={openSelect}
        setOpenSelect={setOpenSelect}
        ref={ref}
      />
    </SearchParamsWrapper>
  );
}

const FilterItemDropdownContent = ({
  list,
  pathname,
  active,
  setActive,
  openSelect,
  setOpenSelect,
  ref,
}: {
  list: ListItem[];
  pathname: string;
  active: string;
  setActive: (title: string) => void;
  openSelect: boolean;
  setOpenSelect: (open: boolean) => void;
  ref: React.RefObject<HTMLDivElement | null>;
}) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    list.forEach((listItem: ListItem) => {
      if (
        ("path" in listItem && pathname === listItem.path) ||
        ("slug" in listItem && searchParams.get("sort") === listItem.slug)
      ) {
        setActive(listItem.title);
      }
    });
  }, [pathname, list, searchParams]);

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => {
          setOpenSelect(!openSelect);
        }}
        className="flex w-full items-center justify-between rounded-sm border border-black/30 px-4 py-2 text-sm dark:border-white/30"
      >
        <div>{active}</div>
        <ChevronDownIcon className="h-4" />
      </div>
      {openSelect && (
        <div
          onClick={() => {
            setOpenSelect(false);
          }}
          className="absolute z-40 w-full rounded-b-md bg-white p-4 shadow-md dark:bg-black"
        >
          {list.map((item: ListItem, i) => (
            <FilterItem key={i} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
