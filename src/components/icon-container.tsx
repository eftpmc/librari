"use client"
import React, { useState, useEffect } from 'react';
import styles from '@/styles/icon-container.module.css';
import { Downloads, DownloadInfo } from '@/components/novel-page'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface IconButtonProps {
  iconSrc: string;
  altText: string;
  href?: string;
  download?: string;
}

export function IconButton({ iconSrc, altText, href, download }: IconButtonProps) {
  return (
    <div className={styles.iconButton}>
      <a href={href} download={download}>
        <img src={iconSrc} alt={altText} />
      </a>
    </div>
  );
}

type ContainerProps = {
  downloadsCalldown: Downloads;
};

export function IconButtonContainer({ downloadsCalldown }: ContainerProps) {
  const [downloads, setDownloads] = useState<Downloads>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("useEffect triggered", downloadsCalldown);
    if (downloadsCalldown.apple) {
      setIsLoading(false);
      setDownloads(downloadsCalldown)
    }
  }, [downloadsCalldown]);

  if (isLoading) return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>4. Get Downloads</CardTitle>
        <CardDescription>Choose your preferred file format below.</CardDescription>
      </CardHeader>
      <CardContent className="flex space-x-4">
        <div className="flex justify-center items-center py-6 text-lg font-semibold text-gray-600">
          No Downloads Yet
        </div>
      </CardContent>
    </Card>
  );

  if (error) return (
    <div className="flex justify-center items-center py-6 text-lg font-semibold text-red-600">
      Error: {error}
    </div>
  );

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>4. Get Downloads</CardTitle>
        <CardDescription>Choose your preferred file format below.</CardDescription>
      </CardHeader>
      <CardContent className="flex space-x-4">
        <IconButton
          iconSrc="books.png"
          altText="Apple Books"
          href={downloads.apple?.url}
          download={`${downloads.apple?.title}.epub`}
        />
        <IconButton
          iconSrc="pdf.png"
          altText="PDF"
          href={downloads.pdf?.url}
          download={`${downloads.pdf?.title}.epub`}
        />
        <IconButton
          iconSrc="mobi.png"
          altText="Mobi"
          href={downloads.mobi?.url}
          download={`${downloads.mobi?.title}.epub`}
        />
      </CardContent>
    </Card>
  );
}
