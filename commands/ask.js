const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask jamo anything!!')
        .addStringOption(op => op.setName("question").setDescription("What do you want to ask?").setRequired(true)),
    async execute( /** @type {ChatInputCommandInteraction}*/ interaction) {
		const question = interaction.options.getString('question') ?? 'No Question!';
        await interaction.deferReply();


        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), parseInt(process.env.TIMEOUT));
        try {
            const body = await fetch(`${process.env.SUZUME}/generate`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    req: question,
                    context: "",
                    stream: false,
                    maxToken: 256,
                    model: ""
                }),
                signal: controller.signal
            });
            clearTimeout(id);
            const json = await body.json();
            await interaction.editReply(`ID: \`${json.req_id}\`\n모델: \`${json.model}\`\n응답: ${json.resp}`)
        } catch (e) {
            clearTimeout(id);
            console.error(e);
            await interaction.editReply("스즈메 백앤드 요청 중 오류가 발생하였습니다.");
        }
    }
}