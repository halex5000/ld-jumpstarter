import { config } from 'dotenv'
import chalk from 'chalk';
import { prompt, PromptObject } from 'prompts'
import { appendFile, readFile } from 'fs';
import { promisify } from 'util';
import emoji from 'node-emoji'
import { parse } from 'parse-gitignore'
import axios from 'axios';

const appendFileAsync = promisify(appendFile);
const readFileAsync = promisify(readFile);
const LAUNCH_DARKLY_ACCESS_TOKEN_KEY = "LAUNCH_DARKLY_ACCESS_TOKEN";

const isExtensionIgnored = async (extension: string) => {
    const gitignoreText = await readFileAsync('./.gitignore', 'utf8');
    const ignoredFiles = parse(gitignoreText);
    return ignoredFiles.patterns.includes(extension);
}

const prompts = async () => {
    const isEnvIgnored = await isExtensionIgnored('.env');

    const packageJson = await readFileAsync('./package.json', 'utf-8');
    const { launchdarkly } = JSON.parse(packageJson);
    const hasValidConfig = launchdarkly && launchdarkly.project && launchdarkly.project.flags && launchdarkly.project.flags.length > 0;

    const flagSetupConfirmation = {
        type: 'confirm',
        name: 'flagSetupConfirm',
        message: chalk.blueBright(`Would you like the flags setup for you ${emoji.get('sparkles')}automagically${emoji.get('sparkles')}?`),
    };

    const promptForAccessToken = {
        type: (prev: boolean) => prev && !process.env[LAUNCH_DARKLY_ACCESS_TOKEN_KEY] ? 'password' : null,
        name: 'accessToken',
        message: chalk.blueBright('Please enter your LaunchDarkly access token: '),
        validate: (accessToken: string) => {
            return accessToken && accessToken.startsWith('api-') ? true : 'that doesn\'t look like an access token'
        }
    }; 

    const promptForIgnore = {
        type: () => !isEnvIgnored ? 'confirm' : null,
        name: 'gitignoreConfirm',
        message: chalk.blueBright(`Access tokens should never be shared with anyone, can I add '.env' to your '.gitignore' file?`),
    };

    const promptForFlagSetup = {
        type: (prev: any) => prev ? 'confirm' : null,
        name:  'createFlags',
        message: () => {
            const formatFlags = (flags: any[]) => flags.map(flag => `\t ${flag.name} \n`)
            const message: string = `we'll create the following flags in the ${launchdarkly.project.name} project \n ${formatFlags(launchdarkly.project.flags)}`;
            return message;
        }  
    }

    const prompts = [
        flagSetupConfirmation,
        promptForAccessToken,
        promptForIgnore,
        promptForFlagSetup,
    ];

    let isCancelled = false;

    const response = await prompt(prompts, {
        onCancel: () => {
            console.log(chalk.yellowBright(`${emoji.get('warning')} aborted LaunchDarkly flag setup, please complete flag setup manually`));
            isCancelled = true;
            return false;
        },
        onSubmit: async (prompt: PromptObject, answer: any, answers: any[]) => {
            if (prompt.name === 'flagSetupConfirm') {
                if (!answer) {
                    console.log(emoji.get('thumbsup') + chalk.blueBright(' skipping flag setup, rerun this script anytime if you change your mind'));
                    return true;
                }
                else {
                    if (!hasValidConfig) {
                        console.log(emoji.get('pensive') + chalk.blueBright(' please setup flags manually, the launchdarkly config in your project is incorrect or was not found'));
                        return true;
                    }
                }
            } 
            if (prompt.name === 'accessToken' && answer) {
                await appendFileAsync('./.env', `\n${LAUNCH_DARKLY_ACCESS_TOKEN_KEY}=${answer}`, 'utf8')
                console.log(emoji.get('raised_hands') + chalk.green(` success adding your access token to the .env file!`))
                console.log(emoji.get('wink') + chalk.green(` you can cmd+click on '.env' to see the changes to your file!`))
                config();
            }
            if (prompt.name === 'gitignoreConfirm') {
                if (answer) {
                    await appendFileAsync('./.gitignore', `\n.env`, 'utf8')
                    console.log(emoji.get('shield') + chalk.green(` success adding .env to your .gitignore file!`) + emoji.get('shield'))
                    console.log(emoji.get('first_place_medal') + chalk.green(` thanks for keeping things secure!`))
                    return;
                } else {
                    console.log(emoji.get('warning') + chalk.redBright(` skipped adding .env to your .gitignore, *pretty please* add it manually!`) + emoji.get('warning') )
                    return;
                }
            }
            if (prompt.name === 'createFlags') {
                if (answer) {
                    for (const flag of launchdarkly.project.flags) {
                        try {
                            const response = await axios.post(
                                `https://app.launchdarkly.com/api/v2/flags/${launchdarkly.project.name}`, 
                                flag, 
                                {
                                    headers: {
                                        Authorization: process.env[LAUNCH_DARKLY_ACCESS_TOKEN_KEY],
                                    },
                                    validateStatus: (status: number) => [409, 201].includes(status)
                                }
                            );
                            console.log(emoji.get('raised_hands') + chalk.green(` success creating '${flag.name}' flag in ${launchdarkly.project.name}!`))
                        } catch (error) {
                            if (error.response) {
                                console.log(emoji.get('x') + chalk.red(` failed to create ${flag.name} in ${launchdarkly.project.name}. sorry. \n you can run again or create this flag manually`))
                            }
                        }
                    }
                }
            }
        }
    });
    return {...response, isCancelled};
}

export default async () => {
    config();
    console.log(chalk.blueBright('initializing LaunchDarkly configuration'));
    const flagSetupResponse = await prompts();
}