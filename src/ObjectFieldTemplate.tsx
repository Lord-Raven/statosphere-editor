import classNames from 'classnames';
import isObject from 'lodash/isObject';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import {
    FormContextType,
    GenericObjectType,
    ObjectFieldTemplateProps,
    ObjectFieldTemplatePropertyType,
    RJSFSchema,
    StrictRJSFSchema,
    UiSchema,
    canExpand,
    descriptionId,
    getTemplate,
    getUiOptions,
    titleId,
} from '@rjsf/utils';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider/context';
import TextArea from "antd/es/input/TextArea";
import {Button} from "antd";
import {Client} from "@gradio/client";
import {useCallback, useState} from "react";

const DESCRIPTION_COL_STYLE = {
    paddingBottom: '8px',
};

const TESTER_STYLE = {
    paddingBottom: '8px',
    paddingLeft: '8px',
    paddingRight: '8px'
};

/** The `ObjectFieldTemplate` is the template to use to render all the inner properties of an object along with the
 * title and description if available. If the object is expandable, then an `AddButton` is also rendered after all
 * the properties.
 *
 * @param props - The `ObjectFieldTemplateProps` for this component
 */
export default function ObjectFieldTemplate<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: ObjectFieldTemplateProps<T, S, F>) {
    const {
        description,
        disabled,
        formContext,
        formData,
        idSchema,
        onAddClick,
        properties,
        readonly,
        required,
        registry,
        schema,
        title,
        uiSchema,
    } = props;
    const uiOptions = getUiOptions<T, S, F>(uiSchema);
    const TitleFieldTemplate = getTemplate<'TitleFieldTemplate', T, S, F>('TitleFieldTemplate', registry, uiOptions);
    const DescriptionFieldTemplate = getTemplate<'DescriptionFieldTemplate', T, S, F>(
        'DescriptionFieldTemplate',
        registry,
        uiOptions
    );
    // Button templates are not overridden in the uiSchema
    const {
        ButtonTemplates: { AddButton },
    } = registry.templates;
    const { colSpan = 24, labelAlign = 'right', rowGutter = 24 } = formContext as GenericObjectType;

    const findSchema = (element: ObjectFieldTemplatePropertyType): S => element.content.props.schema;

    const findSchemaType = (element: ObjectFieldTemplatePropertyType) => findSchema(element).type;

    const findUiSchema = (element: ObjectFieldTemplatePropertyType): UiSchema<T, S, F> | undefined =>
        element.content.props.uiSchema;

    const findUiSchemaField = (element: ObjectFieldTemplatePropertyType) => getUiOptions(findUiSchema(element)).field;

    const findUiSchemaWidget = (element: ObjectFieldTemplatePropertyType) => getUiOptions(findUiSchema(element)).widget;

    const calculateColSpan = (element: ObjectFieldTemplatePropertyType) => {
        const type = findSchemaType(element);
        const field = findUiSchemaField(element);
        const widget = findUiSchemaWidget(element);

        const defaultColSpan =
            properties.length < 2 || // Single or no field in object.
            type === 'object' ||
            type === 'array' ||
            widget === 'textarea'
                ? 24
                : 12;

        if (isObject(colSpan)) {
            const colSpanObj: GenericObjectType = colSpan;
            if (isString(widget)) {
                return colSpanObj[widget];
            }
            if (isString(field)) {
                return colSpanObj[field];
            }
            if (isString(type)) {
                return colSpanObj[type];
            }
        }
        if (isNumber(colSpan)) {
            return colSpan;
        }
        return defaultColSpan;
    };

    const [testInput, setTestInput] = useState("You can try out this classifier here. Replace this field with sample content, then choose to test as input or response and see how the model scores each label.");
    const [classifierResult, setClassifierResult] = useState('');

    const handleTextInputChange = (e: any) => {
        setTestInput(e.target.value);
    }

    let isClassifier = formData && typeof formData === 'object' && "classifications" in formData && formContext && formContext.client;

    const testAsInput = useCallback((input: string, client: Client, formData: any) => {
        let candidateLabelMapping: {[key: string]: string} = {};

        for (let classification of formData.classifications) {
            if (!classification.dynamic) {
                const adjustedLabel = classification.label.replace('{{char}}', 'Chris Doe').replace('{{user}}', 'Kaden Castellanos');
                candidateLabelMapping[adjustedLabel] = classification.label;
            }
        }

        if (Object.keys(candidateLabelMapping).length == 0 || !formData.inputTemplate || !formData.inputHypothesis || !input) {
            setClassifierResult('Fill out input, (non-dynamic) labels, and test phrase before testing.');
            return;
        }

        try {
            let data = {sequence: formData.inputTemplate.replace('{}', input).replace('{{char}}', 'Chris Doe').replace('{{user}}', 'Kaden Castellanos'), candidate_labels: Object.keys(candidateLabelMapping), hypothesis_template: formData.inputHypothesis, multi_label: true};
            console.log(data);
            client.predict("/predict", {data_string: JSON.stringify(data)}).then((response:{data: any}) => {
                console.log(response);
                const responseStructure = JSON.parse(response.data[0]);
                const output = responseStructure.labels.map((value: string, index: number) => {return `${candidateLabelMapping[value]}: ${responseStructure.scores[index]}`}).join('\n');
                setClassifierResult(output);
            }).catch(error => {
                setClassifierResult('Classification failed; check the input fields above. Template fields require an occurrence of "{}".');
                console.error(error);
            });
        } catch(e) {
            setClassifierResult('Error encountered; see console for details.');
            console.log(e);
        }
    }, []);

    const testAsResponse = useCallback((response: string, client: Client, formData: any) => {
        let candidateLabelMapping: {[key: string]: string} = {};

        for (let classification of formData.classifications) {
            if (!classification.dynamic) {
                const adjustedLabel = classification.label.replace('{{char}}', 'Chris Doe').replace('{{user}}', 'Kaden Castellanos');
                candidateLabelMapping[adjustedLabel] = classification.label;
            }
        }

        if (Object.keys(candidateLabelMapping).length == 0 || !formData.responseTemplate || !formData.responseHypothesis || !response) {
            setClassifierResult('Fill out response, labels, and test phrase before testing.');
            return;
        }
        try {
            let data = {sequence: formData.responseTemplate.replace('{}', response).replace('{{char}}', 'Chris Doe').replace('{{user}}', 'Kaden Castellanos'), candidate_labels: Object.keys(candidateLabelMapping), hypothesis_template: formData.responseHypothesis, multi_label: true};
            console.log(data);
            client.predict("/predict", {data_string: JSON.stringify(data)}).then((response:{data: any}) => {
                console.log(response);
                const responseStructure = JSON.parse(response.data[0]);
                const output = responseStructure.labels.map((value: string, index: number) => {return `${candidateLabelMapping[value]}: ${responseStructure.scores[index]}`}).join('\n');
                setClassifierResult(output);
            }).catch(error => {
                setClassifierResult('Classification failed; check the response fields above. Template fields require an occurrence of "{}".');
                console.error(error);
            });
        } catch(e) {
            setClassifierResult('Error encountered; see console for details.');
            console.log(e);
        }
    }, []);

    return (
        <ConfigConsumer>
            {(configProps: ConfigConsumerProps) => {
                const { getPrefixCls } = configProps;
                const prefixCls = getPrefixCls('form');
                const labelClsBasic = `${prefixCls}-item-label`;
                const labelColClassName = classNames(
                    labelClsBasic,
                    labelAlign === 'left' && `${labelClsBasic}-left`
                );

                return (
                    <fieldset id={idSchema.$id}>
                        <Row gutter={rowGutter}>
                            {title && (
                                <Col className={labelColClassName} span={24}>
                                    <TitleFieldTemplate
                                        id={titleId<T>(idSchema)}
                                        title={title}
                                        required={required}
                                        schema={schema}
                                        uiSchema={uiSchema}
                                        registry={registry}
                                    />
                                </Col>
                            )}
                            {description && (
                                <Col span={24} style={DESCRIPTION_COL_STYLE}>
                                    <DescriptionFieldTemplate
                                        id={descriptionId<T>(idSchema)}
                                        description={description}
                                        schema={schema}
                                        uiSchema={uiSchema}
                                        registry={registry}
                                    />
                                </Col>
                            )}
                            {uiSchema?.['ui:grid'] && Array.isArray(uiSchema['ui:grid']) ?
                                uiSchema['ui:grid'].map((ui_row) => {
                                    return Object.keys(ui_row).map((row_item) => {
                                        let element = properties.find((p => p.name === row_item))
                                        if (element) {
                                            return <Col key={element.name} span={ui_row[row_item]}>
                                                {element.content}
                                            </Col>
                                        } else {
                                            return <Col span={ui_row[row_item]}></Col>
                                        }
                                    })

                                })
                                : properties
                                    .filter((e) => !e.hidden)
                                    .map((element: ObjectFieldTemplatePropertyType) => (
                                        <Col key={element.name} span={calculateColSpan(element)}>
                                            {element.content}
                                        </Col>
                                    ))}
                        </Row>

                        {canExpand(schema, uiSchema, formData) && (
                            <Col span={24}>
                                <Row gutter={rowGutter} justify='end'>
                                    <Col flex='192px'>
                                        <AddButton
                                            className='object-property-expand'
                                            disabled={disabled || readonly}
                                            onClick={onAddClick(schema)}
                                            uiSchema={uiSchema}
                                            registry={registry}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        )}
                        {isClassifier && (
                            <Col span={24} style={TESTER_STYLE}>
                                <Row gutter={rowGutter}>
                                    <TextArea value={testInput} onChange={handleTextInputChange}/>
                                </Row>
                                <Row gutter={rowGutter}>
                                    <Col span={12}>
                                        <Button onClick={() => testAsInput(testInput, formContext ? formContext.client : null, formData)}>Test as Input</Button>
                                    </Col>
                                    <Col span={12}>
                                        <Button onClick={() => testAsResponse(testInput, formContext ? formContext.client : null, formData)}>Test as Response</Button>
                                    </Col>
                                </Row>
                                <Row gutter={rowGutter}>
                                    <Col span={24}>
                                        <div style={{whiteSpace: 'pre-line'}}>
                                            {classifierResult}
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            )}
                    </fieldset>
                );
            }}
        </ConfigConsumer>
    );
}