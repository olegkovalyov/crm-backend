import { Module } from '@nestjs/common';
import { UsersResolver } from './resolvers/users.resolver';
import { UsersService } from './services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: 'User', schema: UserSchema },
      ],
    ),
  ],
  exports: [UsersService, MongooseModule],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {
}
