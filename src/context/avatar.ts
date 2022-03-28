import FluorineClient from '@classes/Client';
import { UserContextMenuInteraction, InteractionReplyOptions, GuildMember } from 'discord.js';
import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types/v9';
import { getComponents, getEmbed } from '@util/avatar';

export async function run(client: FluorineClient, interaction: UserContextMenuInteraction<'cached'>): Promise<void> {
    const user = interaction.targetMember ?? interaction.targetUser;

    const replyOptions: InteractionReplyOptions = {
        embeds: [getEmbed(client, interaction, user as unknown as GuildMember, 'guild')]
    };

    if (user instanceof GuildMember && user.avatar) {
        replyOptions.components = [getComponents(client, interaction, user, 'guild')];
    }

    interaction.reply(replyOptions);
}

export const data = new ContextMenuCommandBuilder().setName('Avatar').setType(ApplicationCommandType.User);
