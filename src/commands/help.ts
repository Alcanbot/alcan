import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import {
    CommandInteraction,
    EmbedFieldData,
    MessageActionRow,
    MessageSelectMenu
} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';

export async function run(
    client: FluorineClient,
    interaction: CommandInteraction
) {
    const category = interaction.options.getString('category');
    const commands = client.applicationCommands.chatInput.filter(
        c => c.category === category && !c.dev
    );

    const fields: EmbedFieldData[] = commands.map(c => ({
        name: `/${c.data.name}`,
        value: c.data.description
    }));

    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle(`HELP_TITLE_${category.toUpperCase()}`)
        .setFields(fields);

    const row = new MessageActionRow().addComponents([
        new MessageSelectMenu()
            .setCustomId(`help:${interaction.user.id}`)
            .setOptions([
                {
                    label: client.i18n.t('FUN', { lng: interaction.locale }),
                    value: 'fun',
                    emoji: '🎮',
                    default: category === 'fun'
                },
                {
                    label: client.i18n.t('TOOLS', { lng: interaction.locale }),
                    value: 'tools',
                    emoji: '🛠️',
                    default: category === 'tools'
                },
                {
                    label: client.i18n.t('MODERATION', {
                        lng: interaction.locale
                    }),
                    value: 'moderation',
                    emoji: '🔨',
                    default: category === 'moderation'
                }
            ])
    ]);

    interaction.reply({
        embeds: [embed],
        components: [row]
    });
}

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display the list of commands')
    .addStringOption(option =>
        option
            .setName('category')
            .setDescription('The category to display')
            .addChoices([
                ['Fun', 'fun'],
                ['Tools', 'tools'],
                ['Moderation', 'moderation']
            ])
            .setRequired(true)
    );

export const category: Category = 'tools';
