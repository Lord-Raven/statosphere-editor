import {ArrayFieldTitleProps} from "@rjsf/utils";
import React, {Dispatch, SetStateAction, useCallback, useMemo, useState} from "react";
import fastJson from "fast-json-stringify";
import Form from "@rjsf/antd";
import validator from "@rjsf/validator-ajv8";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import ArrayFieldTemplate from "./ArrayFieldTemplate";
import ArrayFieldItemTemplate from "./ArrayFieldItemTemplate";
import TextareaWidget from "./TextareaWidget";
import {Client} from "@gradio/client";

const ArrayFieldTitleTemplate = React.memo((props: ArrayFieldTitleProps) => {
    const {title} = props;
    return <div style={{float: "left"}}>{title}</div>;
});

interface BlurFormProps {
    schema: any;
    uiSchema: any;
    formData: any;
    formJson: string;
    setFormData:  Dispatch<SetStateAction<{}>>;
    setFormJson:  Dispatch<SetStateAction<string>>;
    client: Client|null;
}

export const BlurForm: React.FC<BlurFormProps> = ({schema, uiSchema, formData, formJson, setFormData, setFormJson, client}) => {
    const formStringify = useMemo(() => fastJson(schema), [schema]);

    const handleDataChange = useCallback((data: any, id: string|undefined) => {
        setFormData(data);
        if (id && ['root', 'classifiers', 'updates'].includes(id.slice(id.lastIndexOf('_') + 1))) {
            let json = '';
            try {
                json = formStringify(data);
            } catch (error) {
                console.log(error);
                json = JSON.stringify(data);
            }
            setFormJson(json);
        }
    }, [formData, formJson, formStringify]);

    const handleDataBlur = useCallback(() => {

        let json = '';
        try {
            json = formStringify(formData);
        } catch (error) {
            console.log(error);
            json = JSON.stringify(formData);
        }
        setFormJson(json);
    }, [formData, formJson, formStringify]);

    return (
        <div>
            <Form
                schema={schema}
                uiSchema={uiSchema}
                onBlur={() => handleDataBlur()}
                onChange={(e, id) => handleDataChange(e.formData, id)}
                formData={formData}
                formContext={{descriptionLocation: 'tooltip', client: client}}
                validator={validator}
                templates={{
                    ObjectFieldTemplate: ObjectFieldTemplate,
                    ArrayFieldTemplate: ArrayFieldTemplate,
                    ArrayFieldItemTemplate: ArrayFieldItemTemplate,
                    ArrayFieldTitleTemplate: ArrayFieldTitleTemplate
                }}
                widgets={{
                    TextareaWidget: TextareaWidget
                }}
            />
        </div>
    );
};
