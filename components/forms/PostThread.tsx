'use client'

import React, { ChangeEvent, useState } from "react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { usePathname, useRouter } from "next/navigation";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.action";
import { useOrganization } from "@clerk/nextjs";


interface Props {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };

    btnTitle: string;
}

  
function PostThread({userId}: {userId: string}) {

    const router = useRouter();
    const pathname = usePathname();

    const {organization} = useOrganization();

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            accountId: userId
        },

    });

   const onSubmit = async (values: z.infer<typeof ThreadValidation>)  => {
        console.log('ORG ID', organization)
       await createThread(
           {
               text: values.thread,
               author: userId,
               communityId: organization ? organization.id : null,
               path: pathname
           }
       );

        router.push('/')
    }

  return <>
      <Form {...form}>
        <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-10 flex flex-col justify-start gap-10"
        >
              <FormField
                  control={form.control}
                  name="thread"
                  render={({ field }) => (
                      <FormItem className="flex flex-col gap-3 w-full">
                          <FormLabel className="form-input_label text-light-2 text-base-semibold">
                              Content
                          </FormLabel>
                          <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                              <Textarea rows={15} {...field} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
              />

              <Button type="submit" className="bg-primary-500">Post Thread </Button>
        </form>
      </Form>
  </>;
}

export default PostThread;
