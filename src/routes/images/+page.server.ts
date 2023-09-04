import { redirect, type ServerLoadEvent } from '@sveltejs/kit'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import type { SupabaseClient, User } from '@supabase/supabase-js'

const getImageData = async (supabase: SupabaseClient, user: User) => {
    let { data, error } = await supabase.storage.from('user_images').list(user.id)

    if (error) throw new Error(error.message)

    return data ?? []
}

export async function load({depends, locals: { supabase, getSession }}:ServerLoadEvent) {
    depends('supabase:auth')

    const session = await getSession()
    const { user = null } = session ?? {}
    if (!user) {
        throw redirect(303, '/')
    }

    const imageData = await getImageData(supabase, user)

    const imageBaseUrl = `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/user_images/${user.id}/`

    return {
        imageData,
        imageBaseUrl,
        user
    }
    
}