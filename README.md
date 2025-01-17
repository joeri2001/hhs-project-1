﻿
# hhs-project-1

## Installation to get the Frontend running. (Git, Cloning the repository and NodeJS install.)

### To get the repo running locally we need to install git as a command line tool, clone the repository via SSH and install NodeJS to run a local server to see what you're doing.

First, you need to install [Git](https://git-scm.com/downloads). This is the tool we'll use to clone the repository and start working on the project together.

Now you can write `git` in the command line and see a list of potential commands, if you see a list of git commands you did it correctly, elsewise try restarting your terminal and try to run the command again.

Now to clone the repository, to clone the repo you will need to make an SSH key to connect securely with the repo.

To do this we will go into our terminal, and make sure we see:
`C:\Users\[your-username]\.ssh\`
Most likely you'll not see the .ssh part so you'll need run `cd .ssh` to get there. (cd means change directory)

Here we'll create an ssh key by running ```ssh-keygen -t ed25519 -C "your_email@example.com"```
You will get asked to fill in a name for the file, leave this EMPTY and click enter.
Now enter a password that you can remember because you'll need to fill this in on every push/pull/commit/etc.

Now you need to go to the files you just created and copy the file contents of `id_ed25519.pub`.

Then on [this](https://github.com/settings/keys) web page you click "new ssh key" and paste the file contents of the `id_ed25519.pub` in the key field and you add a title like "school laptop" to know what the key is for.

Now run `git clone git@github.com:joeri2001/hhs-project-1.git` in the directory where you want to clone the repository. For example I have it in `C:\Users\joeri\Documents\Code`

Congratulations we now have the GitHub repository on our local machine.

Now you'll want to run the frontend to work on it, so you do a directory change into the project's folder and then into the frontend folder (`cd hhs-project-1/frontend`).

Here we'll need to install [NodeJS](https://nodejs.org/en) for our local server.
Complete this installer and check the validity of the installation in the terminal by running `node -v` and `npm -v`.

Now in the frontend folder, in your terminal (e.g. `C:\Users\joeri\Documents\Code\hhs-project-1\frontend`) you have to run `npm i` to install all the NodeJS packages that we use.

Now finally, you can run `npm run dev` and in your browser go to `localhost:3000` and you'll be greeted by our landing page.

For questions dm me.
