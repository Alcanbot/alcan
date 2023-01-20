import type { ContextMenuCommandBuilder, SlashCommandBuilder, SlashCommandSubcommandBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Collection,
    CommandInteraction,
    ContextMenuCommandInteraction,
    Interaction,
    MessageComponentInteraction,
    ModalSubmitInteraction,
    SlashCommandAttachmentOption,
    SlashCommandBooleanOption,
    SlashCommandChannelOption,
    SlashCommandIntegerOption,
    SlashCommandMentionableOption,
    SlashCommandNumberOption,
    SlashCommandRoleOption,
    SlashCommandStringOption,
    SlashCommandSubcommandGroupBuilder,
    SlashCommandUserOption,
    TextInputComponent,
    ContextMenuCommandBuilder as DjsContextMenuCommandBuilder,
    SlashCommandBuilder as DjsSlashCommandBuilder,
    SlashCommandSubcommandBuilder as DjsSlashCommandSubcommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    ModalBuilder,
    SelectMenuBuilder,
    SelectMenuOptionBuilder,
    TextInputBuilder
} from 'discord.js';

export type Category = 'fun' | 'tools' | 'moderation' | 'economy';

type Replace<Interface, Property extends keyof Interface, NewType> = Omit<Interface, Property> & {
    [P in Property]: NewType;
};

export interface NonCommandInteractionData {
    exists: boolean;
    name: string;
}

export type ComponentData = {
    exists: boolean;
    name: string;
    authorOnly: boolean;
};

export interface BaseCommand {
    onInteraction(
        client: FluorineClient,
        interaction: Interaction,
        value?: Collection<string, TextInputComponent> | string
    ): Promise<void>;
    onCommand(client: FluorineClient, interaction: CommandInteraction): Promise<void>;
    onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction): Promise<void>;
    onContextMenuCommand(client: FluorineClient, interaction: ContextMenuCommandInteraction): Promise<void>;
    onComponent(client: FluorineClient, interaction: MessageComponentInteraction, value?: string): Promise<void>;
    onModal: (
        client: FluorineClient,
        interaction: ModalSubmitInteraction,
        fields: Collection<string, TextInputComponent>
    ) => Promise<void>;
    onAutocomplete: (
        client: FluorineClient,
        interaction: AutocompleteInteraction,
        focusedName: string,
        focusedValue: string | number
    ) => Promise<void>;

    dev?: boolean;

    slashCommandData: SlashCommandBuilder | SlashCommandSubcommandBuilder;
    contextMenuCommandData: ContextMenuCommandBuilder;

    category: Category;
    cooldown?: number;

    componentData: ComponentData;
    modalData: NonCommandInteractionData;
}

export type Command = Partial<BaseCommand>;

export type ChatInputCommand = Pick<BaseCommand, 'slashCommandData' | 'category'> &
    Replace<Command, 'slashCommandData', SlashCommandBuilder>;

export type ChatInputSubcommand = Pick<BaseCommand, 'slashCommandData'> &
    Replace<Omit<Command, 'dev' | 'category'>, 'slashCommandData', SlashCommandSubcommandBuilder>;

export type ContextMenuCommand = Pick<BaseCommand, 'contextMenuCommandData'> & Command;
export type Component = Pick<BaseCommand, 'componentData'> & Command;
export type Modal = Pick<BaseCommand, 'modalData'> & Command;

export type CommandResolvable =
    | DjsSlashCommandBuilder
    | DjsSlashCommandSubcommandBuilder
    | DjsContextMenuCommandBuilder
    | SlashCommandSubcommandGroupBuilder;

export type OptionResolvable =
    | SlashCommandAttachmentOption
    | SlashCommandBooleanOption
    | SlashCommandChannelOption
    | SlashCommandIntegerOption
    | SlashCommandMentionableOption
    | SlashCommandNumberOption
    | SlashCommandRoleOption
    | SlashCommandStringOption
    | SlashCommandUserOption;

export type ComponentResolvable =
    | ActionRowBuilder
    | ButtonBuilder
    | ModalBuilder
    | TextInputBuilder
    | SelectMenuBuilder;

export type ApplicationCommandBuilderResolvable = CommandResolvable | OptionResolvable;
export type BuilderResolvable = ApplicationCommandBuilderResolvable | ComponentResolvable | EmbedBuilder;

export interface Event {
    run: (client: FluorineClient, ...args: any) => void;
}

export interface PhishingLink {
    url: string;
}

export interface ShopItemConstructor {
    guildId: bigint;
    name: string;
    description: string;
    price: number;
    role?: bigint;
}
