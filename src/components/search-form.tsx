"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

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


const formSchema = z.object({
    keyword: z.string().min(2).max(40),
})

type SearchFormProps = {
    keywordCallback: (keyword: string) => void;
};

export function SearchForm({ keywordCallback }: SearchFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            keyword: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        toast({
            title: "You searched for the following book:",
            description: (
                `${values.keyword}`
            ),
        })
        keywordCallback(values.keyword);
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>1. Search for a Book</CardTitle>
                <CardDescription>Search our librari of books.</CardDescription>
            </CardHeader>
            <CardContent className="flex space-x-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="keyword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Search Form</FormLabel>
                                    <FormControl>
                                        <Input placeholder="supreme magus.." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the title of the book you are searching for.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Search</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
