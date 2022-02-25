import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dbConfig } from './config/db.config';
import { UserModule } from './user/user.module';
import { TestBedModule } from './test-bed/test-bed.module';
import { LoggerModule } from './logger/logger.module';
import { APP_FILTER } from '@nestjs/core';
import { LogExceptionFilter } from './common/filter/log-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(dbConfig)],
      inject: [dbConfig.KEY],
      useFactory: (dbConfigService: ConfigType<typeof dbConfig>) => {
        return {
          type: 'mssql',
          host: dbConfigService.host,
          port: dbConfigService.port,
          username: dbConfigService.userName,
          password: dbConfigService.password,
          database: dbConfigService.database,
          synchronize: true,
          autoLoadEntities: true,
          extra: {
            trustServerCertificate: true,
          },
        };
      },
    }),
    TestBedModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: LogExceptionFilter,
    },
  ],
})
export class AppModule {}
