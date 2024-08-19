import React from 'react';
import './App.css';
import Form from '@rjsf/material-ui';
import validator from '@rjsf/validator-ajv8';
import classifierSchema from "./assets/classifier-schema.json";
import promptSchema from "./assets/prompt-schema.json";
import variableSchema from "./assets/variable-schema.json";

const schemaClassifier: any = classifierSchema
const schemaPrompt: any = promptSchema
const schemaVariable: any = variableSchema

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Form schema={schemaClassifier} validator={validator} />
        <Form schema={schemaPrompt} validator={validator} />
        <Form schema={schemaVariable} validator={validator} />
      </header>
    </div>
  );
}

export default App;
