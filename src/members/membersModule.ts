import { Module } from '@nestjs/common';
import { MembersResolver } from './resolvers/members.resolver';
import { MembersService } from './services/members.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberSchema } from './schemas/member.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: 3600 * 24 },
      }),
    }),
    MongooseModule.forFeature(
      [
        { name: 'Member', schema: MemberSchema },
      ],
    ),
  ],
  exports: [MembersService, MongooseModule],
  providers: [MembersResolver, MembersService],
})
export class MembersModule {
}
