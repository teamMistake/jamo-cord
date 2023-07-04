const { DiscordInteractions } = require("slash-commands");


let interaction = new DiscordInteractions({
    applicationId: process.env.APPLICATION_ID    ,
    authToken: "bot token",
    publicKey: "discord-provided public key",
});