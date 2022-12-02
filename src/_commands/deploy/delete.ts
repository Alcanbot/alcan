import { Embed, type FluorineClient } from '#classes';
import { type ChatInputCommandInteraction, Routes, SlashCommandSubcommandBuilder } from 'discord.js';

export async function run(client: FluorineClient, interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const name = interaction.options.getString('command');
    let guildId = interaction.options.getString('guild');
    if (guildId === 'this') {
        guildId = interaction.guild.id;
    }

    try {
        const { commands } = client.guilds.cache.get(guildId) ?? client.application;

        const route = guildId
            ? Routes.applicationGuildCommands(client.user.id, guildId)
            : Routes.applicationCommands(client.user.id);

        // @ts-expect-error
        await commands.fetch();

        if (name === 'all') {
            await client.rest.put(route, {
                body:
                    guildId && commands.cache.some(c => c.name === 'deploy')
                        ? [client.commands.chatInput.get('deploy').data.toJSON()]
                        : []
            });
        } else {
            const command = commands.cache.find(c => c.name === name);

            if (!command) {
                return interaction.editReply(`Command \`${name}\` not found. Are you sure it was deployed?`);
            }

            await command.delete();
            return interaction.editReply(`Deleted \`${name}\`.`);
        }

        interaction.editReply('Deleted all commands.');
    } catch (error) {
        const embed = new Embed(client, interaction.locale)
            .setTitle('Failed')
            .setDescription(`\`\`\`js\n${error}\n${error.stack}\`\`\``);
        interaction.editReply({ embeds: [embed] });
    }
}

export const data = new SlashCommandSubcommandBuilder()
    .setName('delete')
    .setDescription('Delete application commands')
    .addStringOption(option =>
        option.setName('command').setDescription('Provide a command to delete').setRequired(true)
    )
    .addStringOption(option => option.setName('guild').setDescription('Provide a guild to deploy').setRequired(false));