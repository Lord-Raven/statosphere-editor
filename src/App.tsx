import './App.css';
import {Button, ConfigProvider, Input, theme} from 'antd';
import classifierSchema from "./assets/schemas/classifier-schema.json";
import contentSchema from "./assets/schemas/content-schema.json";
import functionSchema from "./assets/schemas/function-schema.json";
import generatorSchema from "./assets/schemas/generator-schema.json";
import variableSchema from "./assets/schemas/variable-schema.json";
import classifierUiSchema from "./assets/schemas/classifier-ui-schema.json";
import contentUiSchema from "./assets/schemas/content-ui-schema.json";
import functionUiSchema from "./assets/schemas/function-ui-schema.json";
import generatorUiSchema from "./assets/schemas/generator-ui-schema.json";
import variableUiSchema from "./assets/schemas/variable-ui-schema.json";
import referenceMd from "./assets/markdown/reference.md";
import {BlurForm} from "./BlurForm";
import React, {useCallback, useEffect, useState} from "react";
import { CopyOutlined } from '@ant-design/icons';
import {Client} from "@gradio/client";
import { Tabs } from 'antd';
import ReactMarkdown from 'react-markdown';

const {TabPane} = Tabs;

function App() {

    const [client, setClient] = useState<Client | null>(null);
    const [referenceMarkdown, setReferenceMarkdown] = useState("");

    // Yes, this is an API key, right here in the code! But it's cool, because it only works for this service and the service rejects other domains anyway.
    useEffect(() => {
        Client.connect("Ravenok/statosphere-backend", {hf_token: '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'}).then(client => setClient(client));
        fetch(referenceMd).then((res) => res.text()).then((text) => setReferenceMarkdown(text));
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
                <Tabs size={"large"}>
                    <TabPane tab="Variables" key="1">
                        <BlurForm
                            schema={variableSchema}
                            uiSchema={variableUiSchema}
                            formData={variableData}
                            formJson={variableJson}
                            setFormData={setVariableData}
                            setFormJson={setVariableJson}
                            client={null}
                        />
                    </TabPane>
                    <TabPane tab="Functions" key="2">
                        <BlurForm
                            schema={functionSchema}
                            uiSchema={functionUiSchema}
                            formData={functionData}
                            formJson={functionJson}
                            setFormData={setFunctionData}
                            setFormJson={setFunctionJson}
                            client={null}
                        />
                    </TabPane>
                    <TabPane tab="Generators" key="3">
                        <BlurForm
                            schema={generatorSchema}
                            uiSchema={generatorUiSchema}
                            formData={generatorData}
                            formJson={generatorJson}
                            setFormData={setGeneratorData}
                            setFormJson={setGeneratorJson}
                            client={client}
                        />
                    </TabPane>
                    <TabPane tab="Classifiers" key="4">
                        <BlurForm
                            schema={classifierSchema}
                            uiSchema={classifierUiSchema}
                            formData={classifierData}
                            formJson={classifierJson}
                            setFormData={setClassifierData}
                            setFormJson={setClassifierJson}
                            client={client}
                        />
                    </TabPane>
                    <TabPane tab="Content Modifiers" key="5">
                        <BlurForm
                            schema={contentSchema}
                            uiSchema={contentUiSchema}
                            formData={contentData}
                            formJson={contentJson}
                            setFormData={setContentData}
                            setFormJson={setContentJson}
                            client={null}
                        />
                    </TabPane>
                    <TabPane tab="Reference" key="6">
                        <div style={{textAlign: "left", margin: "1em"}}>
                            <ReactMarkdown>{referenceMarkdown}</ReactMarkdown>
                        </div>
                    </TabPane>
                </Tabs>
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
