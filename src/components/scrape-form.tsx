"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// UI Components
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
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

// Services and Types
import { fetchBookContent } from '@/services/dataFetcher';
import { Downloads, DownloadInfo } from '@/components/novel-page';

type ScrapeProps = {
    titleToScrape: string | null;
    urlToScrape: string | null;
    downloadsCallback: React.Dispatch<React.SetStateAction<Downloads>>;
};

const formSchema = z.object({
    startChapters: z.coerce.number({
        required_error: "Starting chapter is required",
        invalid_type_error: "Starting chapter must be a number",
    }).int().positive(),
    chapterAmount: z.coerce.number({
        required_error: "Chapters are required",
        invalid_type_error: "Chapters must be a number",
    }).int().positive(),
})

type FormData = {
    startChapters: number;
    chapterAmount: number;
};

async function fetchEpub(title: string, data: any, downloadsCallback: React.Dispatch<React.SetStateAction<Downloads>>) {
    try {
        const response = await fetch("/api/generateEpub", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const { epubBase64 } = await response.json();
        const blob = new Blob([new Uint8Array(atob(epubBase64).split("").map(char => char.charCodeAt(0)))], { type: "application/epub+zip" });
        const url = URL.createObjectURL(blob);

        downloadsCallback({
            apple: { title, url },
            mobi: { title, url },
            pdf: { title, url },
        });

    } catch (error) {
        console.error('Error fetching epub:', error);
    }
}

export function ScrapeForm({ titleToScrape, urlToScrape, downloadsCallback }: ScrapeProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { 
            startChapters: 1,
            chapterAmount: 1
        },
    });

    async function onSubmit(values: FormData) {
        toast({ title: `Title: ${titleToScrape}`, description: `Chapters to scrape: ${values.chapterAmount}` });

        if (urlToScrape) {
            const content = await fetchBookContent(urlToScrape, values.startChapters - 1, values.chapterAmount);
            const data = {
                title: content.title,
                coverImage: content.imgProxyUrl,
                chapters: content.chapters,
            };

            fetchEpub(titleToScrape || '', data, downloadsCallback);
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
                            name="startChapters"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Starting Chapter</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="1" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Specify the chapter to begin on.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="chapterAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chapters</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="1" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Specify the number of chapters to scrape.
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
    );
}