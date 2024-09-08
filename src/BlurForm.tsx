import {ArrayFieldTitleProps} from "@rjsf/utils";
import React, {Dispatch, SetStateAction, useCallback, useMemo, useState} from "react";
import fastJson from "fast-json-stringify";
import Form from "@rjsf/antd";
import validator from "@rjsf/validator-ajv8";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import ArrayFieldTemplate from "./ArrayFieldTemplate";
import ArrayFieldItemTemplate from "./ArrayFieldItemTemplate";
import TextareaWidget from "./TextareaWidget";

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
}

export const BlurForm: React.FC<BlurFormProps> = ({schema, uiSchema, formData, formJson, setFormData, setFormJson}) => {
    const formStringify = useMemo(() => fastJson(schema), [schema]);

    const handleDataChange = useCallback((data: any) => {
        setFormData(data);
    }, [formData]);

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
                onChange={(e) => handleDataChange(e.formData)}
                formData={formData}
                formContext={{descriptionLocation: 'tooltip'}}
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
