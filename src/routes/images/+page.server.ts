import { error as routeError } from '@sveltejs/kit'
import { supabase } from "$lib/supabaseClient"
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { devLogin } from '$lib/devLogin'

const getImageData = async (user_id: string) => {
    let { data, error } = await supabase.storage.from('user_images').list(user_id)

    if (error) throw new Error(error.message)

    return data ?? []
}

export async function load() {
    try {
        const user = await devLogin()

        const imageData = await getImageData(user.id)

        const imageBaseUrl = `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/user_images/${user.id}/`

        return {
            imageData,
            imageBaseUrl
        }
    }
    
     catch {
        throw routeError(404, 'Layout not found')
    }
}