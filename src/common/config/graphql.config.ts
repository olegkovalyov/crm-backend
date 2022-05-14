import {GqlModuleOptions} from '@nestjs/graphql';
import {GraphQLError} from 'graphql';
import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';

export function initGraphQlOptions(): any{
  return {
    driver: ApolloDriver,
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
    context: ({req, res}) => ({req, res}),
    autoSchemaFile: true,
    // formatError: (error: GraphQLError) => {
    //   if (error.extensions.response !== undefined
    //     && error.extensions.response.message !== undefined
    //   ) {
    //     if (error.extensions.response.message instanceof Array) {
    //       return new GraphQLError(error.extensions.response.message[0]);
    //     } else {
    //       return new GraphQLError(error.extensions.response.message);
    //     }
    //   }
    //   return new GraphQLError(error.message);
    // },
  };
}