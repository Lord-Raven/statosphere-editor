import './App.css';
import {Button, ConfigProvider, Input, theme} from 'antd';
import classifierSchema from "./assets/classifier-schema.json";
import contentSchema from "./assets/content-schema.json";
import functionSchema from "./assets/function-schema.json";
import generatorSchema from "./assets/generator-schema.json";
import variableSchema from "./assets/variable-schema.json";
import classifierUiSchema from "./assets/classifier-ui-schema.json";
import contentUiSchema from "./assets/content-ui-schema.json";
import functionUiSchema from "./assets/function-ui-schema.json";
import generatorUiSchema from "./assets/generator-ui-schema.json";
import variableUiSchema from "./assets/variable-ui-schema.json";
import {BlurForm} from "./BlurForm";
import React, {useCallback, useEffect, useState} from "react";
import { CopyOutlined } from '@ant-design/icons';
import {Client} from "@gradio/client";

function App() {

    const [client, setClient] = useState<Client | null>(null);

    // Yes, this is an API key, right here in the code! But it's cool, because it only works for this service and the service rejects other domains anyway.
    useEffect(() => {
        Client.connect("Ravenok/statosphere-backend", {hf_token: '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'}).then(client => setClient(client));
    }, []);

    const [classifierData, setClassifierData] = useState({});
    const [classifierJson, setClassifierJson] = useState('[]');

    const [contentData, setContentData] = useState({});
    const [contentJson, setContentJson] = useState('[]');

    const [functionData, setFunctionData] = useState({});
    const [functionJson, setFunctionJson] = useState('[]');

    const [generatorData, setGeneratorData] = useState({});
    const [generatorJson, setGeneratorJson] = useState('[]');

    const [variableData, setVariableData] = useState({});
    const [variableJson, setVariableJson] = useState('[]');

    const [fullJson, setFullJson] = useState('');

    const inputStyle = {display: 'flex', paddingLeft: '8px', paddingRight: '8px'};
    const footerStyle = {
        position: 'fixed' as 'fixed',
        bottom: 0,
        width: '100%',
        boxShadow: '0 -2px 0px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'center',
    };


    const [formCopyFlag, setFormCopyFlag] = useState(false);
    const [formCopyStatus, setFormCopyStatus] = useState(false);

    const handleCopy = useCallback(() => {
            setFormCopyFlag(true);
    }, []);

    const handleJsonChange = useCallback((json: string) => {
        setFullJson(json);
        let data = JSON.parse(json);
        setClassifierJson(JSON.stringify(data.classifiers));
        setContentJson(JSON.stringify(data.content));
        setFunctionJson(JSON.stringify(data.functions));
        setGeneratorJson(JSON.stringify(data.generators));
        setVariableJson(JSON.stringify(data.variables));
    }, []);

    const handleJsonBlur = useCallback(() => {
        try {
            let data = JSON.parse(fullJson);
            setClassifierData(data.classifiers);
            setContentData(data.content);
            setFunctionData(data.functions);
            setGeneratorData(data.generators);
            setVariableData(data.variables);
        } catch (error) {
            console.log(error);
        }
    }, [fullJson]);

    useEffect(() => {
        let newJson = `{"classifiers":${classifierJson ?? '[]'},"content":${contentJson ?? '[]'},"functions":${functionJson ?? '[]'},"generators":${generatorJson ?? '[]'},"variables":${variableJson ?? '[]'}}`;
        if (newJson === '{"classifiers":[],"content":[],"functions":[],"generators":[],"variables":[]}') {
            newJson = '';
        }
        setFullJson(newJson);
    }, [fullJson, classifierJson, contentJson, functionJson, generatorJson, variableJson]);

    useEffect(() => {
        if (formCopyFlag) {
            setFormCopyStatus(true);
            navigator.clipboard.writeText(fullJson).then(() => {
                setTimeout(() => {setFormCopyStatus(false); setFormCopyFlag(false)}, 1500);
            });
        }
    }, [formCopyFlag, fullJson]);

    return (
        <div className="App">
            <header className="App-header">
                Statosphere Configuration Builder
            </header>
            <ConfigProvider theme={{algorithm: [theme.darkAlgorithm, theme.compactAlgorithm]}}>
                <h1>Variables</h1>
                <BlurForm
                    schema={variableSchema}
                    uiSchema={variableUiSchema}
                    formData={variableData}
                    formJson={variableJson}
                    setFormData={setVariableData}
                    setFormJson={setVariableJson}
                    client={null}
                />

                <h1>Functions</h1>
                <BlurForm
                    schema={functionSchema}
                    uiSchema={functionUiSchema}
                    formData={functionData}
                    formJson={functionJson}
                    setFormData={setFunctionData}
                    setFormJson={setFunctionJson}
                    client={null}
                />

                <h1>Generators</h1>
                <BlurForm
                    schema={generatorSchema}
                    uiSchema={generatorUiSchema}
                    formData={generatorData}
                    formJson={generatorJson}
                    setFormData={setGeneratorData}
                    setFormJson={setGeneratorJson}
                    client={client}
                />

                <h1>Classifiers</h1>
                <BlurForm
                    schema={classifierSchema}
                    uiSchema={classifierUiSchema}
                    formData={classifierData}
                    formJson={classifierJson}
                    setFormData={setClassifierData}
                    setFormJson={setClassifierJson}
                    client={client}
                />

                <h1>Content Modifiers</h1>
                <BlurForm
                    schema={contentSchema}
                    uiSchema={contentUiSchema}
                    formData={contentData}
                    formJson={contentJson}
                    setFormData={setContentData}
                    setFormJson={setContentJson}
                    client={null}
                />
                <br/>
                <div style={footerStyle}>
                    <header className="App-footer">
                        <div style={inputStyle}>
                            <Input value={fullJson}
                                   onChange={(e) => handleJsonChange(e.target.value)}
                                   onBlur={() => handleJsonBlur()}
                                   placeholder="Build structure above or paste JSON here."/>
                            <Button onClick={handleCopy} type={formCopyStatus ? "default" : "primary"}
                                    icon={formCopyStatus ? null : <CopyOutlined/>} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '5vw'
                            }}>{formCopyStatus ? 'Copied!' : ''}</Button>
                        </div>
                        <div>
                            Visit <a href='https://venus.chub.ai/extensions/Ravenok/statosphere-3704059fdd7e'>the
                            stage</a> for more
                            information or examples.
                        </div>
                    </header>
                </div>
            </ConfigProvider>
        </div>
    );
}

export default App;
