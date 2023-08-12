'use client'

import React, { useState } from "react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { usePathname, useRouter } from "next/navigation";
import { CommnetValidation } from "@/lib/validations/thread";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.action";


interface Props {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
}

const Comment = ({
            threadId,
            currentUserImg,
            currentUserId
    } : Props) => {



    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(CommnetValidation),
        defaultValues: {
            thread: ''
        },

    });

    const onSubmit = async (values: z.infer<typeof CommnetValidation>) => {
        await addCommentToThread(threadId, values.thread,JSON.parse(currentUserId), pathname);
        
        form.reset();
    }


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-10 flex flex-row justify-start gap-10"
            >
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex items-center  gap-3 w-full">
                            <FormLabel>
                                <Image src={currentUserImg} alt="Profile Photo" width={48} height={48} className="rounded-full object-cover" />
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                               <Input type="text" placeholder="Comment..." className="no-focus text-light-1 outline-none" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="comment-form_btn">Reply</Button>
            </form>
        </Form>
    )
}

export default Comment;