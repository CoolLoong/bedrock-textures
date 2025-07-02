"use client";

import path from "path";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Divider } from "@heroui/divider";
import Image from "next/image";

import { title, subtitle } from "@/components/primitives";
import { SearchIcon } from "@/components/icons";
import { CopyButton } from "@/components/copy";

interface TextureEntry {
  path: string;
  name: string;
}

export default function Home() {
  const [textures, setTextures] = useState<TextureEntry[]>([]);
  const [filteredTextures, setFilteredTextures] = useState<TextureEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  function removeFileExtension(pathStr: string) {
    const { dir, name } = path.parse(pathStr);

    return dir ? `${dir}/${name}` : name;
  }

  useEffect(() => {
    const fetchTextures = async () => {
      try {
        const response = await fetch("/texture_list.json");
        const data: string[] = await response.json();

        const formattedData = data.map((path) => {
          const parts = path.split("/");

          return {
            path,
            name: parts[parts.length - 1],
          };
        });

        setTextures(formattedData);
        setFilteredTextures(formattedData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error loading texture data:", error);
      }
    };

    fetchTextures();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTextures(textures);
    } else {
      const filtered = textures.filter((texture) =>
        texture.path.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      setFilteredTextures(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, textures]);

  const totalPages = Math.ceil(filteredTextures.length / itemsPerPage);
  const currentItems = filteredTextures.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const CustomPagination = () => (
    <div className="flex justify-center gap-2 mt-4">
      <Button
        isDisabled={currentPage === 1}
        size="sm"
        onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
      >
        Previous
      </Button>
      <span className="flex items-center px-4">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        isDisabled={currentPage >= totalPages}
        size="sm"
        onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      >
        Next
      </Button>
    </div>
  );

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Minecraft&nbsp;</span>
        <span className={title({ color: "violet" })}>Texture&nbsp;</span>
        <br />
        <span className={title()}>Library</span>
        <div className={subtitle({ class: "mt-4" })}>
          Browse Minecraft texture resources.
        </div>
      </div>

      <div className="max-w-4xl w-full gap-4 flex flex-col">
        <Card>
          <CardBody className="flex flex-col gap-4">
            <Input
              placeholder="Search textures..."
              startContent={<SearchIcon size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Divider />

            <Table aria-label="Texture list">
              <TableHeader>
                <TableColumn width={120}>PREVIEW</TableColumn>
                <TableColumn>PATH</TableColumn>
                <TableColumn width={80}>ACTION</TableColumn>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((texture, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="w-[32px] h-[32px] relative bg-gray-100 overflow-hidden">
                          <Image
                            alt={texture.name}
                            height={32}
                            src={`/${texture.path}`}
                            width={32}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm">
                          {removeFileExtension(texture.path)}
                        </code>
                      </TableCell>
                      <TableCell>
                        <CopyButton
                          text={removeFileExtension(texture.path)}
                          title="Copy path"
                          variant="light"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="text-center py-8" colSpan={3}>
                      No textures found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && <CustomPagination />}
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
