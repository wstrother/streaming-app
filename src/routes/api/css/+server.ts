import { json } from '@sveltejs/kit'
import type { RequestHandler } from '@sveltejs/kit'

import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import { skeleton } from '@skeletonlabs/tw-plugin'
import typography from '@tailwindcss/typography'

const sourceCSS = '@tailwind components; @tailwind utilities';

export const GET: RequestHandler = async ({ url }) => {
    const classNames = url.searchParams.get('css') ?? ''
    const rawContent = [{raw: classNames, extension: 'html'}]
    // use safelist instead of rawContent
    // pre-render on page load and cache against local storage

    const compiledCss = await postcss([
        tailwindcss({
            content: rawContent,
            plugins: [
                skeleton({themes: {preset: ["skeleton"]}}),
                typography
            ]
        }),
        autoprefixer(),
        cssnano()
    ]).process(sourceCSS)
    

    return json({output: compiledCss.css})
};