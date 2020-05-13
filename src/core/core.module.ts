import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    GraphQLModule.forRoot({
      context: ({ req }) => ({ req }),
      autoSchemaFile: true,
    }),
    MongooseModule.forRoot('mongodb+srv://olegkovalyov:445507ok@clevermoney-nt7jk.mongodb.net/test?retryWrites=true&w=majority',
      { autoIndex: true }),
    AuthModule,
  ],
  exports: [AuthModule],
})
export class CoreModule {
}
