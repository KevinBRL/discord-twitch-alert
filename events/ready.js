const { ActivityType } = require("discord.js");
const cron = require('node-cron');
const axios = require('axios');
const twitchUsername = 'serpentgameplay';

module.exports = async (client) => {

    console.log(`${client.user.tag} succesfully logged in!`);
    client.user.setPresence({
        activities: [{
            name: 'Twitch.tv',
            type: ActivityType.Watching
        }],
        status: 'online'
    });

    console.log('Ready!');

    //getting the channel where you want the message posted
    let channel = client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.CHANNEL_ID);
    let messageSent = false;

    const config = {
        headers: {
            'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
            'client-id': process.env.TWITCH_CLIENT_ID,
        }
    };

    let url = `https://api.twitch.tv/helix/streams?user_login=${twitchUsername}`;
    let url2 = `https://api.twitch.tv/helix/users?login=${twitchUsername}`;

    //setting a schedule that runs every minute to check if the channel is live
    cron.schedule('* * * * *', async () => {

        //getting data
        axios.get(url, config)
            .then(async (res) => {
                if (res.data.data[0] && !messageSent) {

                    let icon = await getProfileImage(url2, config);

                    //send the message to the channel
                    channel.send({
                        content: 'Hey @everyone kom kijken!',
                        embeds: [{
                            author: {
                                name: `${twitchUsername} is live!`,
                                iconURL: icon.data.data[0].profile_image_url,
                                url: `https://twitch.tv/${twitchUsername}`
                            },
                            description: `[${res.data.data[0].title}](https://twitch.tv/${twitchUsername})`,
                            color: 0x6441a5,
                            image: {
                                url: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${twitchUsername}-1920x1080.jpg`
                            },
                            timestamp: new Date().toISOString()
                        }]
                    });

                    messageSent = true;

                } else if (!res.data.data[0]) {
                    messageSent = false;
                }
            })
    });

    //get profile image, this url is not included with the streams part of the Twitch api.
    function getProfileImage() {
        let icon = axios.get(url2, config);
        return icon;
    }

}