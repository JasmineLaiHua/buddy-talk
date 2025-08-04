import { gql } from '@apollo/client';

export const FETCH_MORE_MESSAGES = gql`
  query FetchMoreMessages(
    $channelId: String!
    $messageId: String!
    $old: Boolean!
  ) {
    fetchMoreMessages(channelId: $channelId, messageId: $messageId, old: $old) {
      userId
      messageId
      text
      datetime
    }
  }
`;

export const FETCH_LATEST_MESSAGES = gql`
  query FetchLatestMessages($channelId: String!) {
    fetchLatestMessages(channelId: $channelId) {
      messageId
      text
      userId
      datetime
    }
  }
`;

export const GET_ERROR_MESSAGES = gql`
  query GetErrorMessages {
    errorMessages @client {
      messageId
      userId
      text
      datetime
      status
      channelId
      __typename
    }
  }
`;
