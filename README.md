This is a super simple express api designed to give the secrets UI (also find in this repository) access to a mongo database - plenty of improvements to be made.

You will need a local mongodb running to properly utilize this api in its current state. Additionally, you will need to run "yarn run seed/npm run seed" in order to seed the database with an initial test user with the creds: Username: "testuser"; Password: "password";

The app was designed so that only members with an already existing account can create accounts for other users, so this seeded user will be necessary to gain initial access/demo the app. WARNING: running the seed script will drop the entire Users collection before seeding.
