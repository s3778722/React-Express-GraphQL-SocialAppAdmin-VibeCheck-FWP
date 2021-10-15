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

  input UserInput {
    email: String,
    name: String,
    password: String
  }

  # Queries (read-only operations).
  type Query {
    all_users: [User],
  }

  # Mutations (modify data in the underlying data-source, i.e., the database).
  type Mutation {
    update_user_isblocked(email: String, isBlocked: Boolean): User,
    update_user(input: UserInput): User,
    delete_user(email: String): Boolean

  }
`);

// The root provides a resolver function for each API endpoint.
graphql.root = {
  // Queries.
  all_users: async () => {
    return await db.user.findAll();
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

// Below are some sample queries that can be used to test GraphQL in GraphiQL.
// Access the GraphiQL web-interface when the server is running here: http://localhost:4000/graphql
/*

{
  all_owners {
    email,
    first_name,
    last_name,
    pets {
      pet_id,
    	name
    }
  }
}

{
  owner(email: "matthew@rmit.edu.au") {
    email,
    first_name,
    last_name
  }
}

{
  owner_exists(email: "matthew@rmit.edu.au")
}

mutation {
  create_owner(input: {
    email: "newuser@rmit.edu.au",
    first_name: "New",
    last_name: "User"
  }) {
    email,
    first_name,
    last_name
  }
}

mutation {
  update_owner(input: {
    email: "matthew@rmit.edu.au",
    first_name: "Matthew",
    last_name: "Bolger"
  }) {
    email,
    first_name,
    last_name
  }
}

mutation {
  delete_owner(email: "newuser@rmit.edu.au")
}

*/
