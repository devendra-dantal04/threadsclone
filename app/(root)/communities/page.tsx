import CommunityCard from "@/components/cards/CommunityCard";
import UserCard from "@/components/cards/UserCard";
import { fetchCommunities } from "@/lib/actions/commnunity.actions";
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function page() {

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect('/onboarding')
  }

  const result = await fetchCommunities({
    pageNumber: 1,
    searchString: '',
    pageSize: 25
  });



  return (
    <section>
      <h1 className="head-text mb-10">Communities</h1>

      {/* Search Bar */}

      <div className="mt-14 flex flex-col gap-9">
        {result.communities.length === 0 ? (
          <p className="no-result">No communities</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                bio={community.bio}
                imgUrl={community.image}
                members={community.members}
                username={community.username}
              />
            ))}
          </>
        )}
      </div>

    </section>
  )
}

export default page;
