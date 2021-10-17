import { request, gql } from "graphql-request";

// --- Constants ----------------------------------------------------------------------------------
const GRAPH_QL_URL = "http://localhost:4000/graphql";

// --- Owner ---------------------------------------------------------------------------------------
async function getUsers() {
  // Simply query with no parameters.
  const query = gql`
    {
      all_users {
        email
        name
        date
        imgUrl
        password_hash
        isBlocked
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);

  return data.all_users;
}

async function getPosts() {
  // Simply query with no parameters.
  const query = gql`
    {
      all_posts {
        post_id
        text
        userEmail
        imgUrl
        date
        dateData
        comments {
          comment_id
          text
          date
          userEmail
          postPostId
        }
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);

  return data.all_posts;
}

async function getComments() {
  // Simply query with no parameters.
  const query = gql`
    {
      all_comments {
        comment_id
        text
        date
        userEmail
        postPostId
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);

  return data.all_posts;
}

async function deleteUser(email) {
  const query = gql`
    mutation ($email: String) {
      delete_user(email: $email)
    }
  `;

  const variables = { email };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.delete_user;
}

async function updateUserIsBlocked(email, isBlocked) {
  const query = gql`
    mutation ($email: String, $isBlocked: Boolean) {
      update_user_isblocked(email: $email, isBlocked: $isBlocked) {
        email
        name
        isBlocked
      }
    }
  `;

  const variables = { email, isBlocked };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.update_user_isblocked;
}

async function updatePost(post_id, text) {
  const query = gql`
    mutation ($post_id: Int, $text: String) {
      update_post(post_id: $post_id, text: $text) {
        post_id
        text
        userEmail
        imgUrl
        date
        dateData
      }
    }
  `;

  const variables = { post_id, text };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.update_post;
}

async function updateComment(comment_id, text) {
  const query = gql`
    mutation ($comment_id: Int, $text: String) {
      update_comment(comment_id: $comment_id, text: $text) {
        comment_id
        text
        date
        userEmail
        postPostId
      }
    }
  `;

  const variables = { comment_id, text };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.update_comment;
}

async function updateUser(user) {
  const query = gql`
    mutation ($email: String, $name: String, $password: String) {
      update_user(input: { email: $email, name: $name, password: $password }) {
        email
        name
        password_hash
      }
    }
  `;

  const variables = user;

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.update_user;
}

export {
  getUsers,
  getPosts,
  getComments,
  deleteUser,
  updateUserIsBlocked,
  updateUser,
  updatePost,
  updateComment,
};
