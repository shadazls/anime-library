"use client";

import { useEffect } from "react";

// Définir une interface pour représenter un anime
interface Anime {
  Name: string;
  image_url: string;
}

export default function AnimeDetailsPage() {

  useEffect(() => {
    document.body.style.background = '#121212';
  }, []);

  return (
    <section className="flex flex-col gap-4 py-8 md:py-10 mx-24">
      
    </section>
  );
}
