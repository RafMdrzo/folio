# Folio

Folio is a social media platform designed for creatives. The website focuses on the content uploaded by the users. Basic social media features like as posting, commenting, and following users can be done.

## Authors
- Eugenio Pastoral
- Rafael Maderazo
- Kyra Choa

## Features
- Upload photos (aspect ratio of 4:5 or 1:1)
- Account management (create, delete, log in)
- Post management (create, edit, delete)
- Profile management (edit)
- Social media actions (like, comment, share)

## Roadmap
- Create HTML designs (DONE)
- Convert to Node.js (DONE)
- Authentication (MISSING: HASHING)
- User actions (DONE)
- Social media actions (DONE)
- Create database (DONE)
- Create controllers (DONE)
- Implement database in the server (DONE)
- Populate database with sample users (STARTED)
- Deployment (DONE, ACCESS AT: https://foliodb.herokuapp.com/  LINK TO HEROKU REPOSITORY: https://github.com/RafMdrzo/s11g1 **SHOULD BE EVEN WITH THIS REPOSITORY'S MASTER** )
- Debug web server (STARTED)
- Finalize the web app design (STARTED)

## Dependencies
- Node.js
- MongoDB
- Mongoose
- Express
- Express Handlebars
- Express Session
- Body Parser
- Image-Size

## How to setup this GitHub repository in your machine

1. Install [Git](https://git-scm.com/downloads) if you haven't yet.
2. After installation, open Terminal or Command Prompt clone this repository by entering the following:
`git clone https://github.com/ccapdev1920T2/s11g1`
3. Set your commit email address in Git by executing the command:
`git config --global user.email "your@email.com"`
4. Check if the email address is updated by running this command:
`git config --global user.email`
5. Start contributing!

## How to run
Accessing the app via the Heroku deployment is easier since the database is already being hosted in the cloud. Do note that it also has the same sample data.

For exporting and importing the sample data, we used MongoDB Compass.

Pre-Requisites:
- In order to confirm an account via nodemailer, make sure you allow non secure apps to access your gmail account. This feature can be accessed here: https://myaccount.google.com/lesssecureapps

OPTIONAL: To minify public scripts, run grunt on the folder's directory via command line
1. Create MongoDB database named as folioDB. Create the collections: users, posts, comments, likes, followings, and followers.
2. Import the sample data from JSON files in the folder, **sample data**, to their respective collections.
3. Run the database.
4. Execute index.js.
5. Go to localhost:3000 or https://foliodb.herokuapp.com/. You'll be redirected to the login page. This is the behavior when you haven't logged in yet.
6. To login, enter **eugeniopastoral** and **helloworld** as the username and password respectively. Alternatively, you can use the usernames: **kychoa**, **rafmdrz**, and **kerbychua**. These accounts also have **helloworld** as their password.
7. You'll now be able to view and interact with posts. You can also modify your account and profile information. 
   You can also search for other existing users in the database.
8. To logout, click the avatar and press logout.

## Stuff to remember

1. After committing changes locally, don't forget to push those changes to the repository.
2. Don't push to **master** immediately. Instead, push to alternative branches. Committing changes to **master** should only be done once the code is finalized.
3. Before committing, proofread your commit message for spelling and grammatical errors.
