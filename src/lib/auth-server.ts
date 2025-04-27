import { isNullish } from "remeda";
import { auth } from "./auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import { db } from "./db";

const getSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })
    return session
}


export const getUser = async () => {
    const session = await getSession()
    if (isNullish(session)) {
        return null
    }
    const { user } = session
    if (isNullish(user)) {
        return null
    }

    const dbUser = await db.user.findUnique({ 
        where: {
            id: user.id
        }
    })
    if (isNullish(dbUser)) {
        return null
    }
    return dbUser
}


