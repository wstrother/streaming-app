import postcss from 'postcss'
import tailwindcss from 'tailwindcss'

import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'


const sourceCSS = '@tailwind base; @tailwind components; @tailwind utilities';

export const GET: RequestHandler = async ({ url }) => {
    const classNames = url.searchParams.get('css')
    const rawConfig = {content: [{raw: `<div class="${classNames}"></div>`, extension: 'html'}]}

    const compiledCss = await postcss([
        tailwindcss(rawConfig),
        autoprefixer(),
        cssnano()
    ]).process(sourceCSS)
    

    return json({output: compiledCss.css})
};