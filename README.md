<div id="top"></div>

<br />
<div align="center">
  <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/325/hamburger_1f354.png" alt="Logo" width="80" height="80">

<h3 align="center">Lunchbot</h3>
  <p align="center">
    Set your status at lunch on Slack and see who's away
  </p>
</div>


## About
Lunchbot give you a set of commands to manage your status on Slack, and see who's currently away from their desk.
This app is just me testing out Slack APIs, feel free to use but no guarantees are made on reliability.

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started
Lunchbot first needs to be added to the workspace by the workspace admin, and then to any Slack channels you want to be able to use it in.

The app isn't yet available on the Slack App Directory - so you'll need to self-host in. Lunchbot is a Node.js app using the Bolt for JavaScript SDK, and relies on a MongoDB database for storing installation data.

## Commands

### `/lunch`
Sets yourself at lunch.

**Usage:** `/lunch [<length> {hours | minutes}] `

**Examples**<br/>
`/lunch` - sets yourself at lunch indefinitely<br/>
`/lunch 1 hour` - you can also use `hours`, `hrs`, `hr`, or `h`</br>
`/lunch 30 minutes` - you can also use `minute`, `mins`, `min`, or `m`</br>

### `/brb`
Sets yourself as away temporarily.

**Usage:** `/lunch`

### `/back`
Sets yourself as back, removes any status.

**Usage:** `/back`

### `/here`
Shows who's currently set as on lunch or away.

**Usage:** `/here`

<p align="right">(<a href="#top">back to top</a>)</p>

### Setup
1) Create a new Slack app [here](https://api.slack.com/apps?new_app=1).
   1) The App Name you choose will define how the app appears in Slack. You can use Lunchbot if you want.
   2) Under Basic Information, create a new App-Level Token, and make sure to give it the `connections:write` scope. Copy down the token as you won't be able to see it again.
   3) Under Socket Mode, make sure Enable Socket Mode is switched on.
   4) Under Slash Commands, add the following commands:
      - /lunch
      - /brb
      - /back
      - /here
   5) Under OAuth & Permissions:
      1) Click Add New Redirect URL, and enter the URL of your app, followed by `/slack/oauth_redirect`, like so:
         ```
         https://lunchbot.example.com/slack/oauth_redirect
         ```
      2) Under Scopes > Bot Token Scopes, add the following scopes:
         - channels:read
         - chat:write
         - commands
         - users.profile:read
      3) Under Scopes > User Token Scopes, add the following scopes:
         - channels:read
         - users.profile:write
         - users.profile:read
2) Either set these environment variables up in your hosting platform of choice, or fill in them in the .env file in the root of the project.
    ```dotenv
    SLACK_APP_URL=<the HTTPS URL of the hosted app (don't include a / a the end)>
    SLACK_APP_TOKEN=<the app-level token you copied down earlier>
    SLACK_CLIENT_ID=<find this under Basic Information > App Credentials>
    SLACK_CLIENT_SECRET=<find this under Basic Information > App Credentials>
    MONGO_CONN_STRING=<connection information for the MongoDB database, include username and password, see https://www.mongodb.com/docs/manual/reference/connection-string/#std-label-connections-dns-seedlist>
    ```
3) With the app running, visit the install URL for the app, like so
   ```
   https://lunchbot.example.com/slack/install
   ```
   and follow the instructions to install the Slack app in the workspace.
4) Lunchbot is now available in your workspace. In channels that you want to use it in, send it an invite using the name you set when you created the app (`/invite @Lunchbot`).
5) Run some commands!

The first time a user executes a command, they'll be asked to authorise Lunchbot by going through the OAuth flow, the same as in step 3.

<p align="right">(<a href="#top">back to top</a>)</p>

## Roadmap - updated 23/04/2022
- [ ] Better error handling
- [ ] Better logging setup
- [ ] Create app manifest for easier setup

<p align="right">(<a href="#top">back to top</a>)</p>

## Contact
Ben Tomsett - [@benjitomsett](https://twitter.com/benjitomsett)

GitHub: https://github.com/bentomsett/lunchbot

<p align="right">(<a href="#top">back to top</a>)</p>
