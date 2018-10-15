# Atlas_Api 
Api from Atlas
Atlas is a school project.

# Before pull request

### /!\ LAUNCH NPM TEST WITH THE LATEST ATLAS_TEST DATABASE. /!\
### /!\ IF ONE TEST IS INVALID DON'T EVEN TRY TO SEND A PULL REQUEST. /!\

Your ticket must be finished and in the "Done" section on Trello.

To be consider as finished you must :
* Finish the dev related to it (obviously)
* Make some unit tests
* Make some doc

You'll also need one reviewer that is not :
## yourself

# How to launch the project ?

First fill the config file in the corresponding folder ``./config/``, here you can copy past this :
```
{
  "DB": database_name,
  "password_db": database_password,
  "user_db": database_username,
  "host": database_host,
  "dialect": database_dialect,          // mysql, postgre...
  "logging": boolean,                   // a boolean to know if you want logging or not the query
  "email": email,                       // email of the mailer account
  "password_gmail": password            // password of the mailer account
}
```

Put this on default.json, dev.json and test.json

# Commit message convention

All messages must be written in English
On the first line, you must follow this pattern : **[ADD / FIX / CHANGE]** file modified (max 50 characters)


Always let a blank line, and, if necessary, start a new paragraph to explicit your first message

## Commits should be like this one:

**[CHANGE] README.md**

More detailed explanatory text, if necessary. I've changed
blablablabla bkabkabeekzeerrzeurizeurei (80 columns)

## You may want to add a list of informations, like that.
* blabla
* nimoft
* nifrisht

# Branch name convention

All names must be written in English

All names must follow this pattern : TICKETNUMBER_NAME

**Example:**
20_RequestProtoPlantNet
