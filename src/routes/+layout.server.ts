// import { devLogin } from "$lib/supabaseClient"

// devLogin()
export const load = async ({ locals: { getSession } }) => {
    return {
      session: await getSession(),
    }
  }