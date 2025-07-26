import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SeedService } from './services/seed/seed.service';
import { MigrationService } from './services/seed/migration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);

  // Run migration and seed services asynchronously after app starts
  // This prevents blocking the main thread and reduces memory pressure
  setTimeout(() => {
    (async () => {
      try {
        // Run migration service first
        const migrationService = app.get(MigrationService);
        await migrationService.migrateUsers();

        // Run seed service
        const seedService = app.get(SeedService);
        await seedService.seed();
      } catch (error) {
        console.error('❌ Error during startup services:', error);
      }
    })();
  }, 1000); // Wait 1 second after app starts
}
bootstrap();
