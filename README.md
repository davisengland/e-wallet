# Getting Started with Lease End App

## Installation guidelines

## Step 1

### Install developer tools

VSCode - https://code.visualstudio.com/download  
Xcode - https://apps.apple.com/us/app/xcode/id497799835?mt=12 (for Mac users)  
Postico - https://eggerapps.at/postico/

## Step 2

### Install  necessary environments, package managers, packages, etc.

git  
node - If v16 or later, node must be downgraded (preferably v15.12.10)  
homebrew - `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`  
yarn - `brew install yarn`

## Step 3

### Add new user to Lease-End organization on GitHub

Once user is added, they will have access to repositories.

Clone the Lease End app and api repositories to local machine using `git clone` followed by the url of the repository that is being cloned.  
_frontend_ - `leaseend-app`  
_backend_ - `leaseend-api`

## Step 4

### Install dependencies

Install all dependencies for both of the repositories on local machine using `yarn install` in the root of each respective project.

The dependencies will be defined in the `package.json` file.

## Step 5

### Starting leaseend-app and leaseend-api

Run `yarn start` in both the app and api to run both local instances together.

If working on only one of the two, the deployed version can be used for the side that is not being updated by using `yarn start:remote`.