import {ArrayFieldTitleProps} from "@rjsf/utils";
import React, {useState} from "react";
import fastJson from "fast-json-stringify";
import Form from "@rjsf/antd";
import validator from "@rjsf/validator-ajv8";
import ObjectFieldTemplate from "../ObjectFieldTemplate";
import ArrayFieldTemplate from "../ArrayFieldTemplate";
import ArrayFieldItemTemplate from "../ArrayFieldItemTemplate";
import TextareaWidget from "../TextareaWidget";
import {Button, Input} from "antd";
import {CopyToClipboard} from "react-copy-to-clipboard";

function ArrayFieldTitleTemplate(props: ArrayFieldTitleProps) {
    const {title} = props;
    return <div style={{float: "left"}}>{title}</div>;
}

interface BlurFormProps {
    schema: any;
    uiSchema: any;
}

export const BlurForm: React.FC<BlurFormProps> = ({schema, uiSchema}) => {
    const [formData, setFormData] = useState({});
    const [formJson, setFormJson] = useState('');
    const [formCopyStatus, setFormCopyStatus] = useState(false);
    const formStringify = fastJson(schema);

    const onCopyStatus = () => {
        setFormCopyStatus(true);
        setTimeout(() => setFormCopyStatus(false), 1500);
    };

    const handleDataChange = (data: any) => {
        setFormData(data);
    };

    const handleJsonChange = (data: string) => {
        setFormJson(data);
    };

    const handleDataBlur = () => {
        try {
            setFormJson(formStringify(formData));
        } catch (error) {
            console.log(error);
            setFormJson(JSON.stringify(formData));
        }
    };

    const handleJsonBlur = () => {
        try {
            setFormData(JSON.parse(formJson));
        } catch (error) {
            console.log(error);
        }
    };

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
            <div style={{display: 'flex', paddingLeft: '8px', paddingRight: '8px'}}>
                <Input value={formJson}
                       onChange={(e) => handleJsonChange(e.target.value)}
                       onBlur={() => handleJsonBlur()}
                       placeholder="Build structure above or paste JSON here."/>
                <CopyToClipboard text={formJson} onCopy={() => onCopyStatus()}
                                 className="button" data-clipboard-action="copy"
                                 data-clipboard-target="#classifierInput">
                    <Button danger={formCopyStatus}>{formCopyStatus ? 'Copied!' : 'Copy'}</Button>
                </CopyToClipboard>
            </div>
        </div>
    );
};
