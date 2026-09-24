export interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Attempt asset fetch
    try {
      const res = await env.ASSETS.fetch(request);
      if (res.status < 400) {
        return res;
      }
    } catch (err) {
      // Continue to fallback
    }

    // SPA fallback: return index.html for React Router
    const fallbackUrl = new URL('/index.html', request.url);
    return env.ASSETS.fetch(new Request(fallbackUrl.toString(), request));
  },
};
