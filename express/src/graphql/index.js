const { buildSchema } = require("graphql");
const db = require("../database");
const argon2 = require("argon2");

const graphql = {};

// GraphQL.
// Construct a schema, using GraphQL schema language
graphql.schema = buildSchema(`
  # The GraphQL types are declared first.

  # NOTE: The owner and pet are pseudo-joined; whilst they are related, how they are related is an implementation detail
  # that is NOT exposed in the GraphQL schema. This can be seen with the Pet type which has no field linking it to
  # an owner. That said an owner has many pets and this is exposed within the GraphQL schema by association.
  # Behind the scenes the database pet table has an additional field called email which is a FK to owner.

  type User {
    email: String,
    name: String,
    date: String,
    imgUrl: String,
    password_hash: String
    isBlocked: Boolean
  }

  type Post {
    post_id: Int
    text: String,
    userEmail: String,
    imgUrl: String,
    date: String,
    dateData: String,
    user: [User]
    comments: [Comment]
  }

  type Comment {
    comment_id: Int
    text: String,
    date: String,
    userEmail: String
    postPostId: Int,
    post: [Post],
    user: [User]
  }

  input UserInput {
    email: String,
    name: String,
    password: String
  }

  # Queries (read-only operations).
  type Query {
    all_users: [User],
    all_posts: [Post],
    all_comments: [Comment],
  }

  # Mutations (modify data in the underlying data-source, i.e., the database).
  type Mutation {
    update_user_isblocked(email: String, isBlocked: Boolean): User,
    update_user(input: UserInput): User,
    update_post(post_id: Int, text: String): Post,
    update_comment(comment_id: Int, text: String): Comment,
    delete_user(email: String): Boolean
  }
`);

// The root provides a resolver function for each API endpoint.
graphql.root = {
  // Queries.
  all_users: async () => {
    return await db.user.findAll();
  },

  all_posts: async () => {
    return await db.post.findAll({ include: [db.comment, db.user] });
  },

  all_comments: async () => {
    return await db.comment.findAll({ include: [db.post, db.user] });
  },

  // Mutations.
  delete_user: async (args) => {
    const user = await db.user.findByPk(args.email);

    if (user === null) return false;

    // First remove all pets owned by the owner.
    await user.destroy();

    return true;
  },

  update_user_isblocked: async (args) => {
    const user = await db.user.findByPk(args.email);

    // Update owner fields.
    user.isBlocked = args.isBlocked;

    await user.save();

    return user;
  },
  update_post: async (args) => {
    const post = await db.post.findByPk(args.post_id);

    // Update owner fields.
    post.text = args.text;

    await post.save();

    return post;
  },
  update_comment: async (args) => {
    const comment = await db.comment.findByPk(args.comment_id);

    // Update owner fields.
    comment.text = args.text;

    await comment.save();

    return comment;
  },

  update_user: async (args) => {
    const user = await db.user.findByPk(args.input.email);
    if (args.input.password) {
      const hash = await argon2.hash(args.input.password, {
        type: argon2.argon2id,
      });
      if (args.input.password !== user.password_hash) {
        user.password_hash = hash;
      }
    }

    user.email = args.input.email;
    user.name = args.input.name;

    await user.save();

    return user;
  },
};

module.exports = graphql;
