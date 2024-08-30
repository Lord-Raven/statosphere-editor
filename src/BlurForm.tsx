import {ArrayFieldTitleProps} from "@rjsf/utils";
import React, {useCallback, useMemo, useState} from "react";
import fastJson from "fast-json-stringify";
import Form from "@rjsf/antd";
import validator from "@rjsf/validator-ajv8";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import ArrayFieldTemplate from "./ArrayFieldTemplate";
import ArrayFieldItemTemplate from "./ArrayFieldItemTemplate";
import TextareaWidget from "./TextareaWidget";
import {Button, Input} from "antd";
import {CopyToClipboard} from "react-copy-to-clipboard";

const ArrayFieldTitleTemplate = React.memo((props: ArrayFieldTitleProps) => {
    const {title} = props;
    return <div style={{float: "left"}}>{title}</div>;
});

interface BlurFormProps {
    schema: any;
    uiSchema: any;
}

export const BlurForm: React.FC<BlurFormProps> = ({schema, uiSchema}) => {
    const [formData, setFormData] = useState({});
    const [formJson, setFormJson] = useState('');
    const [formCopyStatus, setFormCopyStatus] = useState(false);
    const formStringify = useMemo(() => fastJson(schema), [schema]);
    const inputStyle = {display: 'flex', paddingLeft: '8px', paddingRight: '8px'};

    const onCopyStatus = () => {
        setFormCopyStatus(true);
        setTimeout(() => setFormCopyStatus(false), 1500);
    };

    const handleDataChange = useCallback((data: any) => {
        setFormData(data);
    }, []);

    const handleJsonChange = useCallback((data: string) => {
        setFormJson(data);
    }, []);

    const handleDataBlur = useCallback(() => {
        try {
            setFormJson(formStringify(formData));
        } catch (error) {
            console.log(error);
            setFormJson(JSON.stringify(formData));
        }
    }, [formData, formStringify]);

    const handleJsonBlur = useCallback(() => {
        try {
            setFormData(JSON.parse(formJson));
        } catch (error) {
            console.log(error);
        }
    }, [formJson]);

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
            <div style={inputStyle}>
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
