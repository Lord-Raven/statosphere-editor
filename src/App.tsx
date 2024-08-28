import React, {useState} from 'react';
import './App.css';
import Form from '@rjsf/antd';
import {Button, ConfigProvider, Input, theme} from 'antd';
import validator from '@rjsf/validator-ajv8';
import classifierSchema from "./assets/classifier-schema.json";
import contentSchema from "./assets/content-schema.json";
import variableSchema from "./assets/variable-schema.json";
import classifierUiSchema from "./assets/classifier-ui-schema.json";
import contentUiSchema from "./assets/content-ui-schema.json";
import variableUiSchema from "./assets/variable-ui-schema.json";
import ObjectFieldTemplate from './ObjectFieldTemplate';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {ArrayFieldTitleProps} from "@rjsf/utils";
import ArrayFieldTemplate from "./ArrayFieldTemplate";
import ArrayFieldItemTemplate from "./ArrayFieldItemTemplate";
import TextareaWidget from "./TextareaWidget";
import fastJson from "fast-json-stringify";

const schemaClassifier: any = classifierSchema;
const schemaContent: any = contentSchema;
const schemaVariable: any = variableSchema;
const uiSchemaClassifier: any = classifierUiSchema;
const uiSchemaContent: any = contentUiSchema;
const uiSchemaVariable: any = variableUiSchema;

const classifierStringify = fastJson(classifierSchema);
const contentStringify = fastJson(contentSchema);
const variableStringify = fastJson(variableSchema);


function ArrayFieldTitleTemplate(props: ArrayFieldTitleProps) {
    const {title} = props;
    return <div style={{float: "left"}}>{title}</div>;
}

function App() {
    const [classifierData, setClassifierData] = useState({});
    const [classifierJson, setClassifierJson] = useState('');
    const [contentData, setContentData] = useState({});
    const [contentJson, setContentJson] = useState('');
    const [variableData, setVariableData] = useState({});
    const [variableJson, setVariableJson] = useState('');
    const [classifierCopyStatus, setClassifierCopyStatus] = useState(false);
    const [contentCopyStatus, setContentCopyStatus] = useState(false);
    const [variableCopyStatus, setVariableCopyStatus] = useState(false);

    const handleChange = (value: any, setData: React.Dispatch<React.SetStateAction<{}>>, setJson: React.Dispatch<React.SetStateAction<string>>, stringify: (arg: any) => string) => {
        if (typeof value === "string") {
            setData(JSON.parse(value));
            setJson(value);
        } else {
            setData(value);
            try {
                setJson(stringify(value));
            } catch (error) {
                console.log(error);
                setJson(JSON.stringify(value));
            }
        }
    };

    const onCopyStatus = (setStatus: React.Dispatch<React.SetStateAction<boolean>>) => {
        setStatus(true);
        setTimeout(() => setStatus(false), 1500);
    };

    return (
        <div className="App">
            <header className="App-header">
                Statosphere Configuration Builder
            </header>
            <ConfigProvider theme={{algorithm: [theme.darkAlgorithm, theme.compactAlgorithm]}}>
                <h1>Variables</h1>
                <Form
                    schema={schemaVariable}
                    uiSchema={uiSchemaVariable}
                    onBlur={() => {
                        handleChange(FormData, setVariableData, setVariableJson, variableStringify)
                    }}
                    formData={variableData}
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
                    <Input id="variableInput" value={variableJson}
                           onChange={(e) => handleChange(e.target.value, setVariableData, setVariableJson, variableStringify)}
                           placeholder="Build structure above or paste JSON here."/>
                    <CopyToClipboard text={variableJson} onCopy={() => onCopyStatus(setVariableCopyStatus)}
                                     className="button" data-clipboard-action="copy"
                                     data-clipboard-target="#variableInput">
                        <Button danger={variableCopyStatus}>{variableCopyStatus ? 'Copied!' : 'Copy'}</Button>
                    </CopyToClipboard>
                </div>

                <h1>Classifiers</h1>
                <Form
                    schema={schemaClassifier}
                    uiSchema={uiSchemaClassifier}
                    onBlur={() => {
                        handleChange(FormData, setClassifierData, setClassifierJson, classifierStringify)
                    }}
                    formData={classifierData}
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
                    <Input id="classifierInput" value={classifierJson}
                           onChange={(e) => handleChange(e.target.value, setClassifierData, setClassifierJson, classifierStringify)}
                           placeholder="Build structure above or paste JSON here."/>
                    <CopyToClipboard text={classifierJson} onCopy={() => onCopyStatus(setClassifierCopyStatus)}
                                     className="button" data-clipboard-action="copy"
                                     data-clipboard-target="#classifierInput">
                        <Button danger={classifierCopyStatus}>{classifierCopyStatus ? 'Copied!' : 'Copy'}</Button>
                    </CopyToClipboard>
                </div>

                <h1>Content Modifications</h1>
                <Form
                    schema={schemaContent}
                    uiSchema={uiSchemaContent}
                    onBlur={() => {
                        handleChange(FormData, setContentData, setContentJson, contentStringify)
                    }}
                    formData={contentData}
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
                    <Input id="contentInput" value={contentJson}
                           onChange={(e) => handleChange(e.target.value, setContentData, setContentJson, contentStringify)}
                           placeholder="Build structure above or paste JSON here."/>
                    <CopyToClipboard text={contentJson} onCopy={() => onCopyStatus(setContentCopyStatus)}
                                     className="button" data-clipboard-action="copy"
                                     data-clipboard-target="#contentInput">
                        <Button danger={contentCopyStatus}>{contentCopyStatus ? 'Copied!' : 'Copy'}</Button>
                    </CopyToClipboard>
                </div>
            </ConfigProvider>
            <header className="App-footer">
                Visit <a href='https://venus.chub.ai/extensions/Ravenok/statosphere-3704059fdd7e'>the stage</a> for more information or examples.
            </header>
        </div>
    );
}

export default App;
