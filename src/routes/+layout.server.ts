import type { ServerLoadEvent } from "@sveltejs/kit"

export const load = async ({ locals: { getSession } }:ServerLoadEvent) => {
  return {
    session: await getSession(),
  }
}