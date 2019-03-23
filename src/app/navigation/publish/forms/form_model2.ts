import { DynamicFormModel, DynamicSelectModel, DynamicInputModel, DynamicTextAreaModel, DynamicRadioGroupModel } from "../../../../../node_modules/@ng-dynamic-forms/core";

export const POST_FORM_MODEL: DynamicFormModel = [
    new DynamicInputModel({
        id: "postTitle",
        label: "Title",
        placeholder: "An awsome title"
    }),
    new DynamicTextAreaModel({
        id: "postBody",
        label: "Description",
        placeholder:"An awsome description"
    }),
    new DynamicRadioGroupModel<string>({

        id: "sampleRadioGroup",
        label: "Sample Radio Group",
        options: [
            {
                label: "Option 1",
                value: "option-1",
            },
            {
                label: "Option 2",
                value: "option-2"
            },
            {
                label: "Option 3",
                value: "option-3"
            }
        ],
        value: "option-3"
    }),
];