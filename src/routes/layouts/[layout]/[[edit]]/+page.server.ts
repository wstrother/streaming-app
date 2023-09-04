import type { DatabaseRow } from '$lib/classes/dbProxy'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { redirect, type ServerLoadEvent } from '@sveltejs/kit'
import type { SupabaseClient, User } from '@supabase/supabase-js'


const getLayoutData = async (supabase: SupabaseClient, user: User, layoutName: string): 
    Promise<DatabaseRow<'layouts'>> => {
        let { data, error } = await supabase.from('layouts').select('*')
            .eq('name', layoutName)
            .eq('user_id', user.id)
            .single()
        

        if (error) {
            throw new Error(error.message)
        } 

        return data
}

const getLayoutNodes = async (supabase: SupabaseClient, user: User, layoutID: number): 
    Promise<DatabaseRow<'layout_nodes'>[]> => {
        let { data, error } = await supabase.from('layout_nodes').select(`*`)
            .eq('layout_id', layoutID)
            .eq('user_id', user.id)

        if (error) throw new Error(error.message)
        
        return data ?? []
}

const getStateVariables = async (supabase: SupabaseClient, user: User, layoutID: number): 
    Promise<DatabaseRow<'state_variables'>[]> => {
        let {data, error} = await supabase.from('state_variables').select(`*`)
            .eq('user_id', user.id)
        
        if (error) throw new Error(error.message)
        
        return data ?? []
}

export async function load(
    {params, depends, locals: { supabase, getSession }}) {
        depends('supabase:auth')

        const session = await getSession()
        const { user = null } = session ?? {}
        if (!user) {
            throw redirect(303, '/')
        }

        const { layout='', edit='' } = params

        if (edit && edit !== 'edit') {
            throw redirect(303, `/layouts/${layout}`)
        }

        const layoutData = await getLayoutData(supabase, user, layout)
        const layoutNodeRows = await getLayoutNodes(supabase, user, layoutData.id)
        const stateVariables = await getStateVariables(supabase, user, layoutData.id)

        const imageBaseUrl = `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/user_images/`

        return {
            edit:Boolean(edit),
            user,
            layoutData,
            layoutNodeRows,
            stateVariables,
            imageBaseUrl,
            session
        }
}