# Folio

Folio is a social media platform designed for creatives. The website focuses on the content uploaded by the users. Basic social media features like as posting, commenting, and following users can be done.

## Authors
- Eugenio Pastoral
- Rafael Maderazo
- Kyra Choa

## Features
- Upload photos
- Account management (create, delete, log in, log out)
- Post management (create, edit, delete)
- Profile management (edit)
- Social media actions (like, comment, share)

## Roadmap
- Create HTML designs (DONE)
- Convert to Node.js (DONE)
- Authentication (DONE)
- User actions (DONE)
- Social media actions (DONE)
- Create database (DONE)
- Create controllers (DONE)
- Implement database in the server (DONE)
- Populate database with sample users (DONE)
- Deployment (DONE, ACCESS AT: https://foliodb.herokuapp.com/)
- Debug web server (DONE)
- Finalize the web app design (DONE)

## Libraries
- JQuery
- Bootstrap

## Dependencies
- assert – v2.0.0
- bcrypt – v4.0.1
- bcryptjs – v2.4.3
- body – v5.1.0
- body-parser – v1.19.0
- cjs – v0.0.11
- express – v4.17.1
- express-handlebars – v4.0.0
- express-session – v1.17.0
- filepond – v4.13.0
- filepond-plugin-file-encode – v2.1.5
- filepond-plugin-image-resize – v2.0.4
- grunt – v1.1.0
- grunt-contrib-cssmin – v3.0.0
- grunt-contrib-uglify – v4.0.1
- grunt-contrib-watch – v1.1.0
- hbs – v4.1.1
- image-size – v0.8.3
- install – v0.13.0
- minify – v5.1.1
- mongo – v0.1.0
- mongodb – v2.2.33
- mongoose – v5.9.6
- node-addon-api – v2.0.0
- node-pre-gyp – v0.14.0
- node-supervisor – v1.0.2
- nodemailer – v6.4.6
- npm – v6.14.4
- parser – v0.1.4
- passport – v0.4.1
- passport-local – v1.0.0
- supervisor – v0.12.0
- supervisord – v0.1.0
- typed.js – v2.0.11

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

Prerequisites:
- In order to confirm an account via nodemailer, make sure you allow non secure apps to access your gmail account. This feature can be accessed here: https://myaccount.google.com/lesssecureapps

OPTIONAL: To minify public scripts, run grunt on the folder's directory via command line

1. Create MongoDB database named as folioDB. Create the collections: users, posts, comments, likes, followings, and followers.
2. Import the sample data from JSON files in the folder, **sample data**, to their respective collections.
3. Run the database.
4. Execute index.js.
5. Go to localhost:3000 or https://foliodb.herokuapp.com/. You'll be redirected to the login page. This is the behavior when you haven't logged in yet.
6. To login, enter **eugeniopastoral** and **helloworld** as the username and password respectively. You can use the usernames: **kychoa**, **rafmdrz**, and **kerbychua**. These accounts also have **helloworld** as their password. Alternatively, you can create a new account. Upon creating the account, you'll receive a confirmation email.
![Alt text](/screenshot2.png?raw=true "Login page")
7. If starting fresh, you'll have to follow accounts first. After which, you'll now be able to view and interact with posts. You can also modify your account and profile information. You can also search for other existing users in the database.
![Alt text](/screenshot1.png?raw=true "A email confirmation prompt appears when you haven't confirmed your email yet.")
8. To logout, click the avatar and press logout.

## Stuff to remember

1. After committing changes locally, don't forget to push those changes to the repository.
2. Don't push to **master** immediately. Instead, push to alternative branches. Committing changes to **master** should only be done once the code is finalized.
3. Before committing, proofread your commit message for spelling and grammatical errors.
