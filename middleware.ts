// middleware1.ts
import { authMiddleware } from '@clerk/nextjs/server';

export default authMiddleware({
  // Configure public routes or other options as needed
  publicRoutes: ['/', '/api/public'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};