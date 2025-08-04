import { IMessage } from '@/interfaces/message';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

// export const errorMessagesVar = makeVar<IMessage[]>([]);

const httpLink = createHttpLink({
  uri: 'https://angular-test-backend-yc4c5cvnnq-an.a.run.app/graphql',
  headers: {
    'Content-Type': 'application/json',
  },
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        errorMessages: {
          read(existing: IMessage[]) {
            return existing;
          },
          merge(existing: IMessage[] = [], incoming: IMessage[]) {
            if (!existing.length) return incoming || [];

            if (!incoming || !incoming.length) return existing;

            const merged = [...existing, ...incoming];
            const setOfMessageId = new Set<string>();
            const uniqueMessages: IMessage[] = [];

            for (const message of merged) {
              const messageId = message.messageId;

              if (!setOfMessageId.has(messageId)) {
                setOfMessageId.add(messageId);
                uniqueMessages.push(message);
              }
            }

            return uniqueMessages;
          },
        },
      },
    },
  },
});

await persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
  key: 'app-local-storage',
});

export const client = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
