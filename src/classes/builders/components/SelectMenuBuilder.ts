import { BaseComponent } from '#builderBases';
import {
    SelectMenuBuilder as UnlocalizedBuilder,
    type SelectMenuComponentOptionData,
    type LocalizationMap
} from 'discord.js';

export class SelectMenuBuilder extends BaseComponent<UnlocalizedBuilder> {
    placeholder: string;
    options: SelectMenuComponentOptionData[];

    constructor(customId: string) {
        super();
        this.builder = new UnlocalizedBuilder().setCustomId(customId);
        this.options = [];
    }

    setPlaceholder(placeholder: string) {
        this.placeholder = placeholder;
        return this;
    }

    setDisabled(disabled = true) {
        this.builder.setDisabled(disabled);
        return this;
    }

    setMaxValues(maxValues: number) {
        this.builder.setMaxValues(maxValues);
        return this;
    }

    setMinValues(minValues: number) {
        this.builder.setMinValues(minValues);
        return this;
    }

    setOptions(...options: SelectMenuComponentOptionData[]) {
        this.options = options;
        return this;
    }

    addOptions(...options: SelectMenuComponentOptionData[]) {
        this.options.push(...options);
        return this;
    }

    prepare(locale: keyof LocalizationMap) {
        if (this.placeholder) {
            this.builder.setPlaceholder(this.getOne(this.placeholder, locale));
        }

        this.builder.setOptions(
            this.options.map(option => {
                option.label = this.getOne(option.label, locale);
                return option;
            })
        );

        this.options = [];
        return this;
    }
}
