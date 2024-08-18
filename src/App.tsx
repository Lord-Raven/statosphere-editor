import React from 'react';
import './App.css';
import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import classifierSchema from "./assets/classifier-schema.json";
import promptSchema from "./assets/prompt-schema.json";
import variableSchema from "./assets/variable-schema.json";

const schema: RJSFSchema = {
  title: 'Statosphere Configuration Editor',
  type: 'string',
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Form schema={schema} validator={validator} />
      </header>
    </div>
  );
}

export default App;
