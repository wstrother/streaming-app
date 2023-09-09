import { ViteSSGContext } from 'vite-ssg';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { getTailwindCSS } from '$lib/utils';

export function handler(req: IncomingMessage, res: ServerResponse, ctx: ViteSSGContext) {
  const { query } = parse(req.url, true);
  const css = getTailwindCSS(query.css);
  res.end(css);
}