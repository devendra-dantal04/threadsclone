import UserCard from "@/components/cards/UserCard";
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

    const result = await fetchUsers({
        userId: user.id,
        pageNumber: 1,
        pageSize: 20,
        searchString: '',
    });



  return (
    <section>
        <h1 className="head-text mb-10">Search</h1>

        {/* Search Bar */}

        <div className="mt-14 flex flex-col gap-9">
            {result.users.length === 0 ? (
                <p className="no-result">No users</p>
            ): (
                <>
                {result.users.map((user) => (
                    <UserCard 
                        key={user.id}
                        id={user.id}
                        name={user.name}
                        username={user.username}
                        imgUrl={user.image}
                        personType="User"
                    />
                ))}
                </>
            )}
        </div>

    </section>
  )
}

export default page;
