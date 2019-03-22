import {
    DynamicFormModel,
    DynamicCheckboxModel,
    DynamicInputModel,
    DynamicRadioGroupModel,
    DynamicSelectModel
} from "@ng-dynamic-forms/core";

export const CATEGORY_FORM_MODEL: DynamicFormModel = [
    new DynamicSelectModel({
        id: "principalCategory",
        label: "Category",
        options: [
            {
                label: "Audio",
                value: "audio"
            },
            {
                label: "Viveo",
                value: "video"
            },
            {
                label: "Application",
                value: "application"
            },
            {
                label: "Games",
                value: "games"
            },
            {
                label: "Books",
                value: "books"
            },
        ],
        placeholder: "Select a category..."
    })
];