# LD Jumpstarter



Unofficial jumpstarter for projects using LaunchDarkly.



## Easy to use, takes care of basic tasks for your Node.js projects using LaunchDarkly

### Prerequisites

You have an active LaunchDarkly account, it's easy to set one up!

Just go [here](https://launchdarkly.com/pricing/) and select the Starter package if you're just getting started, no obligation to continue after your trial is up

### Initialize your project with client information

```shell
# prompts for your client ID 
# adds it to your .env file (creates .env if it doesn't exist)
# also prompts to add .env to your .gitignore if it's not ignored already
npx ld-jumpstarter initialize
```



### Setup flags from the command line for easy project setup the first time

```shell
# prompts for an access token for your account
# adds it to your .env file (creates .env if it doesn't exist)
# also prompts to add .env to your .gitignore if it's not ignored already
npx ld-jumpstarter create
```

#### Prerequisites

You have an access token from your LaunchDarkly account.
You can create one [here](https://app.launchdarkly.com/settings/authorization/tokens/new).

1. Your access token will need admin permissions.
2. Give it a meaningful name so you'll know why you created it later.
3. Make sure you get the token after you created it. You only get to see it once.







