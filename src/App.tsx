import React from 'react';
import './App.css';
import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';
import classifierSchema from "./assets/classifier-schema.json";
import promptSchema from "./assets/prompt-schema.json";
import variableSchema from "./assets/variable-schema.json";
import variableUiSchema from "./assets/variable-ui-schema.json";
import ObjectFieldTemplate from './ObjectFieldTemplate';

const schemaClassifier: any = classifierSchema;
const schemaPrompt: any = promptSchema;
const schemaVariable: any = variableSchema;
const uiSchemaVariable: any = variableUiSchema;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Statosphere Configuration Builder
      </header>
      <h1>Variables</h1>
      <Form
        schema={schemaVariable}
        validator={validator}
        templates={{ObjectFieldTemplate: ObjectFieldTemplate}}
        uiSchema={uiSchemaVariable}
          />
      <h1>Classifiers</h1>
      <Form schema={schemaClassifier} validator={validator}/>
      <h1>Prompt</h1>
      <Form schema={schemaPrompt} validator={validator}/>
    </div>
  );
}

export default App;
