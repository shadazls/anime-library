import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

import { SearchInput } from "@/components/SearchInput";
import { Autocomplete, AutocompleteSection, AutocompleteItem } from "@nextui-org/autocomplete";
import { Select, SelectItem } from "@nextui-org/select";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button, ButtonGroup } from "@nextui-org/button";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="mt-8 flex gap-4">
        <SearchInput/>

        <Autocomplete
          label="Genres"
          labelPlacement="outside"
          placeholder="Any"
          className="max-w-xs"
          description="The genres of the anime"
        ></Autocomplete>

        <Autocomplete
          label="Scores"
          labelPlacement="outside"
          placeholder="Any"
          className="max-w-xs"
          description="The score of the anime"
        ></Autocomplete>

        <Autocomplete
          label="Episodes"
          labelPlacement="outside"
          placeholder="Any"
          className="max-w-xs"
          description="The number of episodes of the anime"
        ></Autocomplete>

        <Autocomplete
          label="Producers"
          labelPlacement="outside"
          placeholder="Any"
          className="max-w-xs"
          description="The production companies or producers of the anime"
        ></Autocomplete>

        <Autocomplete
          label="Licensors"
          labelPlacement="outside"
          placeholder="Any"
          className="max-w-xs"
          description="The licensors of the anime (e.g., streaming platforms)"
        ></Autocomplete>

        <Autocomplete
          label="Type"
          labelPlacement="outside"
          placeholder="Any"
          className="max-w-xs"
          description="The type of the anime (e.g., TV series, movie, OVA, etc.)"
        ></Autocomplete>
        
        {/* <Autocomplete
          label="Airing Status"
          labelPlacement="outside"
          placeholder="Any"
          className="max-w-xs"
          description="The status of the anime (e.g., Finished Airing, Currently Airing, etc.)"
        ></Autocomplete> */}

        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </div>
      <div className="mt-8 flex gap-4">
        <Card
          isBlurred
          isFooterBlurred
          radius="lg"
          className="border-none"
        >
          <Image
            width={225}
            alt="Anime image"
            src="https://cdn.myanimelist.net/images/anime/4/19644.jpg"
          />
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">ONE PIECE</p>
            <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
              EDIT
            </Button>
          </CardFooter>
        </Card>
        <Card
          isPressable
          isFooterBlurred
          isHoverable
          radius="lg"
          className="border-none"
        >
          <Image
            width={225}
            alt="Anime image"
            src="https://cdn.myanimelist.net/images/anime/1439/93480.jpg"
          />
          <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
            <div>
              <p className="text-black text-medium">One Piece</p>
            </div>
            <Button className="text-tiny" color="primary" radius="full" size="sm">
              EDIT
            </Button>
          </CardFooter>
        </Card>
        <Image
          width={225}
          alt="Anime image"
          src="https://cdn.myanimelist.net/images/anime/7/20310.jpg"
        />
      </div>
    </section>
  );
}
