import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import { skeleton } from '@skeletonlabs/tw-plugin'
import typography from '@tailwindcss/typography'

import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

const sourceCSS = '@tailwind base; @tailwind components; @tailwind utilities';
const config = {
  content: [{ raw: '<div class="bg-red-500"></div>' }],
  plugins: [
  ]
};



export const GET: RequestHandler = async () => {
    const compiledCss = await postcss([
        tailwindcss(config)
    ]).process(sourceCSS)
    
    console.log(compiledCss)

    return json({output: compiledCss})
};