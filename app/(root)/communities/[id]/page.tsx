import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { communityTabs } from "@/constants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { fetchCommunityDetails } from "@/lib/actions/commnunity.actions";
import UserCard from "@/components/cards/UserCard";

async function page({ params }: { params: { id: string } }) {

    const user = await currentUser();
    if (!user) return null;

    const communityDetails = await fetchCommunityDetails(params.id);

    return <>
        <section>
            <ProfileHeader
                accountId={communityDetails?._id}
                authUserId={user?.id}
                username={communityDetails.username}
                name={communityDetails.name}
                imgUrl={communityDetails.image}
                bio={communityDetails.bio}
                type="Community"
            />

            <div className="mt-9">
                <Tabs className="w-full" defaultValue="threads">
                    <TabsList className="tab"  >
                        {communityTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                <Image src={tab.icon} width={24} height={24} alt={tab.label} className="object-contain" />

                                <p className="max-sm:hidden">{tab.label}</p>

                                {
                                    tab.label === 'Threads' && (
                                        <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                            {communityDetails?.threads?.length}
                                        </p>
                                    )
                                }
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="threads" className="w-full text-light-1">
                                <ThreadsTab
                                    currentUserId={user.id}
                                    accountId={communityDetails._id}
                                    accountType="Community"
                                />
                    </TabsContent>
                    <TabsContent value="members" className="w-full text-light-1">
                        <section className="mt-9 flex flex-col gap-10">
                            {
                                communityDetails?.members.map((member: any) => (
                                    <UserCard 
                                        key={member.id}
                                        id={member.id}
                                        imgUrl={member.image}
                                        name={member.name}
                                        personType="User"
                                        username={member.username}
                                    />
                                ))
                            }
                        </section>
                    </TabsContent>
                    <TabsContent value="requests" className="w-full text-light-1">
                                <ThreadsTab
                                    currentUserId={user.id}
                                    accountId={communityDetails._id}
                                    accountType="Community"
                                />
                    </TabsContent>
                        
                </Tabs>
            </div>


        </section>
    </>
}

export default page