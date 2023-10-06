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
            const payload = await fetchBookContent(urlToScrape, 0, values.chapters);
            
            convertToEpub(payload);
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
