
/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const fetch = require('node-fetch');
// Imports the Google Cloud client library

// Creates a client

const { WebClient } = require('@slack/web-api');

const SLACK_BOT_TOKEN = ""
const SLACK_CHANNEL_ID = ""
const client = new WebClient(SLACK_BOT_TOKEN);

exports.slackGetMessages = async (req, res) => {
    await joinChannel()
    try {
        const now = Math.floor(new Date().getTime() / 1000);
        const since = now - 86400 * 7;
        const until = now + 86400;

        const messages = [];
        let cursor = null;
        do {
            const options = {
                channel: SLACK_CHANNEL_ID,
                oldest: since,
                latest: until,
                cursor,
                limit: 200,
            };
            const result = await client.conversations.history(options);
            messages.push(...result.messages);
            cursor = result.response_metadata?.next_cursor;
        } while (cursor);
        res.status(200).send({ messages });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
};

async function joinChannel() {
    try {
        // conversations.join APIを呼び出して、指定されたチャンネルにBotユーザーを参加させる
        await client.conversations.join({ channel: SLACK_CHANNEL_ID });
        console.log(`Botユーザーが ${SLACK_CHANNEL_ID} チャンネルに参加しました`);
    } catch (error) {
        console.error(`Botユーザーをチャンネルに参加できませんでした: ${error}`);
    }
}

