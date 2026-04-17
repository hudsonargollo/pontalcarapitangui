export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // If it's a file request (has extension), let it through
  if (/\.\w+$/.test(url.pathname)) {
    return context.next();
  }
  
  // If it's an API request, let it through
  if (url.pathname.startsWith('/api/')) {
    return context.next();
  }
  
  // For all other requests, serve index.html (SPA routing)
  return context.next();
}
