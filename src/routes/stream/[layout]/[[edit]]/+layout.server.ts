import { error } from '@sveltejs/kit'

export function load({ params }) {
    if (params.edit && params.edit !== 'edit') {
        throw error(404, 'Layout not found')
    }

    return {
        edit: params.edit === 'edit',
        layout_name: params.layout
    }
}