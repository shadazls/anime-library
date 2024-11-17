"use client";

import { title } from "@/components/primitives";
import { useEffect } from "react";

export default function CatalogPage() {

  useEffect(() => {
      document.body.style.background = '#121212';
  }, );

  return (
    <div>
      <h1 className={title()}>Catalog</h1>
    </div>
  );
}
