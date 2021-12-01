import {GqlModuleOptions} from '@nestjs/graphql';
import {GraphQLError} from 'graphql';

export function initGraphQlOptions(): GqlModuleOptions {
  return {
    context: ({req, res}) => ({req, res}),
    autoSchemaFile: true,
    formatError: (error: GraphQLError) => {
      if (error.extensions.response !== undefined
        && error.extensions.response.message !== undefined
      ) {
        if (error.extensions.response.message instanceof Array) {
          return new GraphQLError(error.extensions.response.message[0]);
        } else {
          return new GraphQLError(error.extensions.response.message);
        }
      }
      return new GraphQLError(error.message);
    },
  };
}