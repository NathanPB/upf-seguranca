# How to run the HTTP API

1. Clone this repository
2. Navigate into the ``server`` directory
3. Create a file named ``.env`` with your PostgreSQL database connection credentials and host (example bellow)

```properties
DB_HOST=localhost:5432
DB_USERNAME=the_database_username
DB_PWD=the_database_password
DB_NAME=the_database_name
PORT=8080
```

4. Run ``$ npm install``
5. Run ``$ npm start``

# REST Routes

- **POST** ``/auth`` | **Required Headers**: ``Authorization: email password``

Returns a JSON containing a token along with its creation and expiration date

- **GET** ``/user`` | **Required Headers:** ``Authorization: token``

Returns a JSON array containing all the users in the database

- **POST** ``/user`` | **Required Headers:** ``Authorization: token``, ``email: an_email_address``, ``pwd: an_hashed_pwd`` (should be hashed in the frontend)

Includes a user in the database.

- **DELETE** ``/user/:id`` | **Required Headers:** ``Authorization: token``

Deletes a user from the database. Valid only if the user to delete is the same that the token is linked with. I made this way because I'm planning authorization levels, but for now passing two parameters is a bit useless.

- **PUT** ``/user/:id`` | **Required Headers:** ``Authorization: token``, ``email: an_email_address``. **Optional Headers:** ``pwd: an_hashed_pwd`` (should be hashed in the frontend)

Modify a user in the database. Only the user the token used belongs to can alter its own password, but everyone can alter everyone's email (thats just for demo).

- **GET** ``/user/me`` | **Required Headers:** ``Authorization: token``

Shows informations about the user that the current used token belongs.

- **GET** ``/user/:id`` | **Required Headers:** ``Authorization: token``

Shows informations about the user whose ID passed in the URL belongs to.
