"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { fetchBookContent } from '@/services/dataFetcher';
import { convertToEpub } from '@/services/formatHub';
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
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

type ScrapeProps = {
    titleToScrape: string | null;
    urlToScrape: string | null;
};

const formSchema = z.object({
    chapters: z.coerce.number({
        required_error: "Chapters are required",
        invalid_type_error: "Chapters must be a number",
    }).int().positive(),
})

export function ScrapeForm({ titleToScrape, urlToScrape }: ScrapeProps) {
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

                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${title}.epub`;
                    a.click();

                    URL.revokeObjectURL(url);  // free up storage--remove the blob which was used for this url
                })
                .catch(error => console.error('Error:', error));
        }
    }

    return (
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
    )
}
