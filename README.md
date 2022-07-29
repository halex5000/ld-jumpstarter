# LD Jumpstarter



:warning: Experimental Unofficial Jumpstarter for projects using LaunchDarkly.
Created by alexhardman@launchdarkly.com for scaffolding projects quickly.

This is **not** part of the official production LaunchDarkly toolset although it was created and is maintained by a Dark Launcher and it is powered by LaunchDarkly.

## Easy to use, makes getting started in LaunchDarkly even easier

### FAQ

#### What does this do?

There's two modes of usage here, either `initialize` a project which is just taking the SDK key you've copied from the LaunchDarkly console and injecting it into your `.env` file,  `gitignoring` your `.env` file so you don't accidentally check it in because now you have secrety stuff in there.

The other mode of operation is `create` which does just that, it uses config in your project to drive the creation of flags in LaunchDarkly using the LaunchDarkly APIs to create flags.

#### Why use this?

When we're first learning something new, getting things out of the way helps us focus on the things we're there to learn.
To get you up and running the fastest, I like to kickstart your learning with code/comments/narrative that helps you tune in and get working fast.

By avoiding manual setup, you're up and working faster and less likely to make mistakes that either hinder your learning or leave you in a pickle like leaking out secrets by checking in your `.env`

#### How do I use this?

The very best way to use this tool is to use `npx` which means you don't have to install it, you just run the module with `npx` inside your project and NPM will take care of installing/updating as needed, you'll get prompted on the command line for what to do next.

The config for this is currently in `package.json` which limits it to Node.js projects, but coming soon is file based config that allows for YAML/JSON config files so you can use it in any project or just where you have a config file.

#### Why did you build this?

I create a lot of new projects and whenever I create a new project, I need to create new flags for that project, plus, folks that use my demos to learn LaunchDarkly have to do the same, so I wanted to make it easier for both of us.

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


## COMING SOON

- support for config not in `package.json`
- GIF/images to demonstrate the expected experience
- better prompting/parameter passing to allow you to point to config files anywhere, including remote links in Github!







