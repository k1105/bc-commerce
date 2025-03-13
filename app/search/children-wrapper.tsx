"use client";

import {useSearchParams} from "next/navigation";
import {Fragment, Suspense} from "react";

// Ensure children are re-rendered when the search query changes
export default function ChildrenWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  return (
    <Suspense fallback="<div>loading...</div>">
      <Fragment key={searchParams.get("q")}>{children}</Fragment>
    </Suspense>
  );
}
