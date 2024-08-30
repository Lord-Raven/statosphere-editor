import './App.css';
import {ConfigProvider, theme} from 'antd';
import classifierSchema from "./assets/classifier-schema.json";
import contentSchema from "./assets/content-schema.json";
import functionSchema from "./assets/function-schema.json";
import variableSchema from "./assets/variable-schema.json";
import classifierUiSchema from "./assets/classifier-ui-schema.json";
import contentUiSchema from "./assets/content-ui-schema.json";
import functionUiSchema from "./assets/function-ui-schema.json";
import variableUiSchema from "./assets/variable-ui-schema.json";
import {BlurForm} from "./BlurForm";


function App() {

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
                />

                <h1>Functions</h1>
                <BlurForm
                    schema={functionSchema}
                    uiSchema={functionUiSchema}
                />

                <h1>Classifiers</h1>
                <BlurForm
                    schema={classifierSchema}
                    uiSchema={classifierUiSchema}
                />

                <h1>Content Modifications</h1>
                <BlurForm
                    schema={contentSchema}
                    uiSchema={contentUiSchema}
                />
            </ConfigProvider>
            <header className="App-footer">
                Visit <a href='https://venus.chub.ai/extensions/Ravenok/statosphere-3704059fdd7e'>the stage</a> for more information or examples.
            </header>
        </div>
    );
}

export default App;
