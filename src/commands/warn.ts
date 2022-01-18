import FluorineClient from '../classes/Client';
import Embed from '../classes/Embed';
import { CommandInteraction } from 'discord.js';
import createCase from '../util/createCase';
import r from 'rethinkdb';
import modLog from '@util/modLog';
import { SlashCommandBuilder } from '@discordjs/builders';
export async function run(
    client: FluorineClient,
    interaction: CommandInteraction<'cached'>
) {
    if (!interaction.member?.permissions.has('MODERATE_MEMBERS')) {
        return interaction.reply({
            content: client.language.get(
                interaction.locale,
                'WARN_PERMISSIONS_MISSING'
            ),
            ephemeral: true
        });
    }

    const member = interaction.options.getMember('user');
    const reason =
        interaction.options.getString('reason') ??
        client.language.get(interaction.locale, 'NO_REASON');

    if (!member)
        return interaction.reply({
            content: client.language.get(
                interaction.locale,
                'WARN_MEMBER_MISSING'
            ),
            ephemeral: true
        });

    if (reason.length > 1024) {
        return interaction.reply({
            content: client.language.get(
                interaction.locale,
                'REASON_LONGER_THAN_1024'
            ),
            ephemeral: true
        });
    }

    const create = await createCase(
        client,
        interaction?.guild,
        member.user,
        interaction.user,
        'warn',
        reason
    );

    modLog(client, create, interaction.guild);
    const embed = new Embed(client, interaction.locale)
        .setLocaleTitle('WARN_SUCCESS_TITLE')
        .setLocaleDescription('WARN_SUCCESS_DESCRIPTION')
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .addLocaleField({ name: 'WARN_MODERATOR', value: interaction.user.tag })
        .addLocaleField({ name: 'WARN_USER', value: member.user.tag })
        .addLocaleField({ name: 'REASON', value: reason })
        .addLocaleField({ name: 'PUNISHMENT_ID', value: create.id.toString() });
    interaction.reply({ embeds: [embed] });

    r.table('case').insert(create).run(client.conn);
}

export const data = new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn an user from the server')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('Provide an user to warn')
            .setRequired(true)
    );

export const help = {
    name: 'warn',
    description: 'Zwarnuj kogoś z serwera',
    aliases: ['zbanuj'],
    category: 'moderation'
};