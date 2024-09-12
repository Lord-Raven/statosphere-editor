import './App.css';
import {Button, ConfigProvider, Input, theme} from 'antd';
import classifierSchema from "./assets/classifier-schema.json";
import contentSchema from "./assets/content-schema.json";
import functionSchema from "./assets/function-schema.json";
import variableSchema from "./assets/variable-schema.json";
import classifierUiSchema from "./assets/classifier-ui-schema.json";
import contentUiSchema from "./assets/content-ui-schema.json";
import functionUiSchema from "./assets/function-ui-schema.json";
import variableUiSchema from "./assets/variable-ui-schema.json";
import {BlurForm} from "./BlurForm";
import React, {useCallback, useEffect, useState} from "react";
import { CopyOutlined } from '@ant-design/icons';

function App() {

    const [classifierData, setClassifierData] = useState({});
    const [classifierJson, setClassifierJson] = useState('[]');

    const [contentData, setContentData] = useState({});
    const [contentJson, setContentJson] = useState('[]');

    const [functionData, setFunctionData] = useState({});
    const [functionJson, setFunctionJson] = useState('[]');

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
    }, [formCopyFlag]);

    const handleJsonChange = useCallback((json: string) => {
        setFullJson(json);
        let data = JSON.parse(json);
        setClassifierJson(JSON.stringify(data.classifiers));
        setContentJson(JSON.stringify(data.content));
        setFunctionJson(JSON.stringify(data.functions));
        setVariableJson(JSON.stringify(data.variables));
    }, [fullJson, classifierData, contentData, functionData, variableData, classifierJson, contentJson, functionJson, variableJson]);

    const handleJsonBlur = useCallback(() => {
        try {
            let data = JSON.parse(fullJson);
            setClassifierData(data.classifiers);
            setContentData(data.content);
            setFunctionData(data.functions);
            setVariableData(data.variables);
        } catch (error) {
            console.log(error);
        }
    }, [fullJson, classifierData, contentData, functionData, variableData, classifierJson, contentJson, functionJson, variableJson]);

    useEffect(() => {
        let newJson = `{"classifiers":${classifierJson ?? '[]'},"content":${contentJson ?? '[]'},"functions":${functionJson ?? '[]'},"variables":${variableJson ?? '[]'}}`;
        if (newJson == '{"classifiers":[],"content":[],"functions":[],"variables":[]}') {
            newJson = '';
        }
        setFullJson(newJson);
    }, [fullJson, classifierJson, contentJson, functionJson, variableJson]);

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
                />

                <h1>Functions</h1>
                <BlurForm
                    schema={functionSchema}
                    uiSchema={functionUiSchema}
                    formData={functionData}
                    formJson={functionJson}
                    setFormData={setFunctionData}
                    setFormJson={setFunctionJson}
                />

                <h1>Classifiers</h1>
                <BlurForm
                    schema={classifierSchema}
                    uiSchema={classifierUiSchema}
                    formData={classifierData}
                    formJson={classifierJson}
                    setFormData={setClassifierData}
                    setFormJson={setClassifierJson}
                />

                <h1>Content Modifiers</h1>
                <BlurForm
                    schema={contentSchema}
                    uiSchema={contentUiSchema}
                    formData={contentData}
                    formJson={contentJson}
                    setFormData={setContentData}
                    setFormJson={setContentJson}
                />
                <br/>
                <div style={footerStyle}>
                    <header className="App-footer">
                        <div style={inputStyle}>
                            <Input value={fullJson}
                                   onChange={(e) => handleJsonChange(e.target.value)}
                                   onBlur={() => handleJsonBlur()}
                                   placeholder="Build structure above or paste JSON here."/>
                            <Button onClick={handleCopy} type={formCopyStatus ? "default" : "primary"} icon={formCopyStatus ? null : <CopyOutlined />} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '5vw' }}>{formCopyStatus ? 'Copied!' : ''}</Button>
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
