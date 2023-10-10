"use client"
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Downloads, DownloadInfo } from '@/components/novel-page'
import { fetchBookContent } from '@/services/dataFetcher';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

type ScrapeProps = {
    titleToScrape: string | null;
    urlToScrape: string | null;
    downloadsCallback: React.Dispatch<React.SetStateAction<Downloads>>;
};

const formSchema = z.object({
    chapters: z.coerce.number({
        required_error: "Chapters are required",
        invalid_type_error: "Chapters must be a number",
    }).int().positive(),
})

export function ScrapeForm({ titleToScrape, urlToScrape, downloadsCallback }: ScrapeProps) {
    const [downloads, setDownloads] = useState<Downloads>({});

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            chapters: 1,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        toast({
            title: `Title: ${titleToScrape}`,
            description: (
                `Chapters to scrape: ${values.chapters}`
            ),
        })
        if (urlToScrape) {
            const { title, imgProxyUrl, chapters } = await fetchBookContent(urlToScrape, 0, values.chapters);

            const data = {
                title: title,
                coverImage: imgProxyUrl,
                chapters: chapters
            };

            fetch("/api/generateEpub", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(data => {
                    const epubBase64 = data.epubBase64;
                    const blob = new Blob([new Uint8Array(atob(epubBase64).split("").map(char => char.charCodeAt(0)))], { type: "application/epub+zip" });
                    const url = URL.createObjectURL(blob);

                    setDownloads({
                        apple: {
                            title: title,
                            url: url
                        },
                        mobi: {
                            title: title,
                            url: url
                        },
                        pdf: {
                            title: title,
                            url: url
                        },
                    });

                    /* const a = document.createElement("a");
                    a.href = url;
                    a.download = `${title}.epub`;
                    a.click(); */

                    //URL.revokeObjectURL(url);  // free up storage--remove the blob which was used for this url
                })
                .catch(error => console.error('Error:', error));

            downloadsCallback(downloads)
        }
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>3. Specify Details</CardTitle>
                <CardDescription>Configure a few things before getting your file.</CardDescription>
            </CardHeader>
            <CardContent className="flex space-x-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="chapters"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chapters</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="1" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the amount of chapters you want.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Scrape</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
