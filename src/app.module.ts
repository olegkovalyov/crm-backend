import { Module } from '@nestjs/common';
import { UsersModule } from './users/usersModule';

@Module({
  imports: [
    UsersModule,
  ],
})
export class AppModule {
}
