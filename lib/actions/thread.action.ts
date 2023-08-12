'use server'

import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import Thread from "../models/thread.model";
import { revalidatePath } from "next/cache";

interface Params {
    text: string;
    author: string;
    communityId: string | null;
    path: string;
}


export async function createThread({text, author, communityId, path} : Params) {
    
    try {
        connectToDB();
        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        });

        //Update user model
        await User.findByIdAndUpdate(author, {
            $push: {threads: createdThread._id}
        })

        revalidatePath(path)
    }catch(error: any) {
        console.log(error.message)
    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDB();

    try {

        const skipAmount = (pageNumber - 1) * pageSize;

        const postsQuery  = Thread.find({parentId: {$in: [null, undefined]}})
            .sort({createdAt : 'desc'})
            .skip(skipAmount)
            .limit(pageSize)
            .populate({path: 'author', model: User})
            .populate({path: 'children', populate: { path: 'author', model: 'User', select: "_id name parentId image"}})

        const totalPostCounts = await Thread.countDocuments({
            parentId: {$in: [null, undefined]}
        })

        const posts = await postsQuery.exec();

        const isNext = totalPostCounts > skipAmount + posts.length;

        return {posts, isNext}

    } catch(error: any) {
        throw new Error(`Error fetching thread: ${error.message}`);
    }
}

export async function fetchThreadById(id: string) {    
    connectToDB();

    try {
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: 'User',
                select: '_id id name image'
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: '_id id name parentId image'
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: '_id id name parentId image'
                        }
                    }
                ]
            }).exec();

            return thread;

    }catch(error: any) {
        throw new Error(`error fetching thread ${error.message}`);
    }
}


export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string,
) {
    connectToDB();

    try {

        const originalThread = await Thread.findById(threadId);

        if(!originalThread) throw new Error('Thread not found');

        const commentThread = new Thread({ 
            text: commentText,
            author: userId,
            parentId: threadId
        });

        const savedCommentThread = await commentThread.save();

        originalThread.children.push(savedCommentThread._id);

        await originalThread.save();

        revalidatePath(path);

    }catch(error: any) {
        throw new Error(`Error addding comment to thread ${error.message}`);
    }
}


export async function getActivity(userId: string) {
    try {
        connectToDB();


        const usersThreads = await Thread.find({author: userId});

        const childThreadIds = usersThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children)
        }, [])

        const replies = await Thread.find({
            _id : {$in : childThreadIds},
            author : {$ne: userId}
        }
        ).populate({
            path: 'author',
            model: User,
            select: "name image _id"
        })


        return replies;


    }catch(error: any) {
        throw new Error(`Error fetching activities ${error.message}`);
    }
}