import { GlobalExceptionFilter } from '@/common/exceptions/global.exception';
import { GlobalReponseInterceptor } from '@/common/interceptors/global-response.interceptor';
import { GlobalZodValidationPipe } from '@/common/pipes/global-zod-validation.pipe';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const globalPrefix = 'api/v1';

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Register the validation pipe
  app.useGlobalPipes(new GlobalZodValidationPipe());

  // Register the exception filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalInterceptors(new GlobalReponseInterceptor());

  // Set Global Prefix
  app.setGlobalPrefix(globalPrefix);

  //Enable Cross-origin resource sharing (CORS).
  app.enableCors({
    // Allow requests from these origins (comma-separated string from .env, split into array)
    origin: process.env.ORIGINS?.split(',') || ['http://localhost:3000'],

    //preflightContinue: true,
    // Pass preflight (OPTIONS) requests to the next middleware/route handler
    // You can remove this if you're not manually handling OPTIONS routes

    // Allow these headers to be sent in requests from the browser
    allowedHeaders: [
      'Content-Type', // For JSON or form body formats
      'Origin', // Specifies the origin of the request
      'X-Requested-With', // Used to identify Ajax requests
      'Accept', // Indicates acceptable content types
      'Authorization', // Common for passing bearer tokens
    ],

    // Allow client-side JavaScript to access these response headers
    exposedHeaders: [
      'Authorization', // So browser code can read the Authorization token in response headers
    ],

    credentials: true, // Allow sending cookies, Authorization headers, etc., across origins

    optionsSuccessStatus: 204,
    // Return status code 204 for successful preflight responses (some legacy browsers expect 200/204)

    maxAge: 86400, // Cache the preflight response for 1 day (in seconds)

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    // HTTP methods allowed for CORS requests
  });

  // Enable helmet
  await app.register(() => import('@fastify/helmet'), {
    global: true, // Apply Helmet globally to all routes

    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Only allow content from the same origin by default
        scriptSrc: ["'self'"], // Allow scripts from same origin + inline scripts (unsafe)
        styleSrc: ["'self'"], // Allow styles from same origin + inline styles (unsafe)
        imgSrc: ["'self'", 'data:'], // Allow images from same origin + data URIs (e.g., base64 images)
        fontSrc: ["'self'"], // Allow fonts from the same origin
        frameAncestors: ["'self'"], // Prevent the site from being embedded in iframes by other domains (clickjacking protection)
        scriptSrcAttr: ["'none'"], // Disallow JavaScript in HTML element attributes (e.g., `onclick="..."`) to reduce XSS risk
        scriptSrcElem: ["'self'"], // Only allow script files/elements from your origin
      },
    },

    crossOriginEmbedderPolicy: { policy: 'require-corp' }, // Prevents loading cross-origin resources unless they explicitly grant permission (for COEP compliance)

    crossOriginOpenerPolicy: { policy: 'same-origin' }, // Isolates the browsing context group to prevent side-channel attacks (e.g., Spectre)

    crossOriginResourcePolicy: { policy: 'same-origin' }, // Restrict other sites from loading your resources (e.g., images, scripts)

    originAgentCluster: true, // Enables origin-keyed agent clusters for stronger isolation (modern security feature)

    referrerPolicy: { policy: 'same-origin' }, // Only send the `Referer` header to same-origin requests

    xContentTypeOptions: true, // Prevents MIME-sniffing a response away from declared `Content-Type`

    xDnsPrefetchControl: { allow: true }, // Allow DNS prefetching for external domains

    xDownloadOptions: true, // Instructs Internet Explorer to prevent downloads from opening automatically (adds `X-Download-Options: noopen`)

    xFrameOptions: { action: 'sameorigin' }, // Prevent your site from being embedded in frames by other origins (clickjacking protection)

    xPermittedCrossDomainPolicies: { permittedPolicies: 'none' }, // Restricts Adobe Flash and Acrobat from loading data from your domain

    xXssProtection: true, // Enables XSS filtering in older browsers (modern browsers ignore this; kept for legacy support)

    hidePoweredBy: true, // Hides `X-Powered-By` header to obscure the server tech (e.g., "Express" or "Fastify")

    strictTransportSecurity: {
      maxAge: 63072000, // Instructs browsers to only use HTTPS for the next 2 years
      includeSubDomains: true, // Applies the policy to all subdomains
      preload: true, // Requests inclusion in browser preload lists (e.g., Chrome HSTS preload)
    },
  });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');

  console.log(
    `🚀 Application running on: http://localhost:${process.env.PORT}/${globalPrefix}`,
  );
}
bootstrap();
