"use client";

import { title } from "@/components/primitives";
import { useEffect } from "react";
import FilterOptions from "@/components/FilterOptions";

export default function CatalogPage() {

  useEffect(() => {
      document.body.style.background = '#121212';
  }, );

  return (
    <div>
      <FilterOptions></FilterOptions>
    </div>
  );
}
