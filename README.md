# How to run with Docker Compose

1. Clone this repository
2. Edit ``docker-compose.yml`` and change the passwords as you want
3. Run ``docker-compose up --build``
4. Wait for the application to be deployed
5. Open your browser and go to ``localhost``

The ports 80 will be used by the webapp and 8080 by the REST API

At this time you can only change the Webapp port at ``docker-compose.yml``. The web service one is hardcoded

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
