import { config } from 'dotenv'
import chalk from 'chalk';
import { prompt, PromptObject } from 'prompts'
import { appendFile, readFile } from 'fs';
import { promisify } from 'util';
import emoji from 'node-emoji'
import { parse } from 'parse-gitignore'

const appendFileAsync = promisify(appendFile);
const readFileAsync = promisify(readFile);
const VITE_LAUNCHDARKLY_CLIENT_ID_KEY = "VITE_LAUNCHDARKLY_CLIENT_ID";

const isExtensionIgnored = async (extension: string) => {
    const gitignoreText = await readFileAsync('./.gitignore', 'utf8');
    const ignoredFiles = parse(gitignoreText);
    return ignoredFiles.patterns.includes(extension);
}

const promptForClientSetup = async () => {
    const isEnvIgnored = await isExtensionIgnored('.env');
    const clientId = process.env[VITE_LAUNCHDARKLY_CLIENT_ID_KEY];
    if (!clientId || !isEnvIgnored) {
        
        let isCancelled = false;

        const confirmClientIdSetup = {
            type: () => !clientId ? 'confirm' : null,
            name: 'clientIdSetup',
            message: chalk.blueBright(`May I add your client ID to your '.env' file ${emoji.get('sparkles')}automagically${emoji.get('sparkles')}?`),
        };

        const getClientId = {
            type: (prev: boolean) => prev ? 'text' : null,
            name: 'clientId',
            message: chalk.blueBright('Please paste your LaunchDarkly client ID'),
            validate: (clientId: string) => clientId && clientId.startsWith('62') ? true : 'That doesn\'t look like a client ID, please try again'
        };

        const updateGitIgnore = {
            type: (prev: string) => prev || !isEnvIgnored ? 'confirm' : null,
            name: 'gitignoreConfirm',
            message: chalk.blueBright(`.env files should never be committed in Git, can I add '.env' to your '.gitignore' file?`),
        };

        const onCancel = () => {
            console.log(chalk.yellowBright(`${emoji.get('warning')} aborted client initialization`));
            isCancelled = false;
        };

        const onSubmit = async (prompt: PromptObject, answer: any) => {
            if (prompt.name === 'clientId' && answer) {
                await appendFileAsync('./.env', `\n${VITE_LAUNCHDARKLY_CLIENT_ID_KEY}=${answer}`, 'utf8')
                console.log(emoji.get('raised_hands') + chalk.green(` success adding your client ID to the .env file!`))
                console.log(emoji.get('wink') + chalk.green(` you can cmd+click on '.env' to see the changes to your file!`))
            }
            if (prompt.name === 'gitignoreConfirm') {
                if (answer) {
                    await appendFileAsync('./.gitignore', `\n.env`, 'utf8')
                    console.log(emoji.get('shield') + chalk.green(` success adding .env to your .gitignore file!`) + emoji.get('shield'))
                    console.log(emoji.get('first_place_medal') + chalk.green(` thanks for keeping things secure!`))
                    return;
                } else {
                    console.log(emoji.get('warning') + chalk.green(` don't forget to gitignore your .env file!`))
                    return;
                }
            }
        };

        const response = await prompt(
            [   //prompts
                confirmClientIdSetup,
                getClientId,
                updateGitIgnore,
            ], 
            {   //handlers
                onCancel,
                onSubmit,
            }
        );

        return {...response, isCancelled};
    }
    return true;
}

export default async () => {
    config();
    console.log(chalk.blueBright('initializing LaunchDarkly client configuration'));
    console.log(chalk.blueBright('ctrl + c to abort setup'));
    const clientSetupResponse = await promptForClientSetup();
    if (clientSetupResponse && clientSetupResponse.isCancelled) {
        console.log(`${emoji.get('white_check_mark')} you're all set!`);
        console.log(`${emoji.get('champagne')} let's go pop some flags! ${emoji.get('champagne')}`);
        console.log(`${emoji.get('information_source')}  you probably need to restart your application now to get the new env changes`);
    }
}