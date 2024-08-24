import {
    getTemplate,
    getUiOptions,
    ArrayFieldTemplateProps,
    ArrayFieldTemplateItemType,
    FormContextType,
    GenericObjectType,
    RJSFSchema,
    StrictRJSFSchema,
} from '@rjsf/utils';
import classNames from 'classnames';
import { Col, Row, ConfigProvider } from 'antd';
import { useContext } from 'react';

export default function ArrayFieldTemplate<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: ArrayFieldTemplateProps<T, S, F>) {
    const {
        canAdd,
        className,
        disabled,
        formContext,
        idSchema,
        items,
        onAddClick,
        readonly,
        registry,
        required,
        schema,
        title,
        uiSchema,
    } = props;
    const uiOptions = getUiOptions<T, S, F>(uiSchema);
    const ArrayFieldDescriptionTemplate = getTemplate<'ArrayFieldDescriptionTemplate', T, S, F>(
        'ArrayFieldDescriptionTemplate',
        registry,
        uiOptions
    );
    const ArrayFieldItemTemplate = getTemplate<'ArrayFieldItemTemplate', T, S, F>(
        'ArrayFieldItemTemplate',
        registry,
        uiOptions
    );
    const ArrayFieldTitleTemplate = getTemplate<'ArrayFieldTitleTemplate', T, S, F>(
        'ArrayFieldTitleTemplate',
        registry,
        uiOptions
    );
    // Button templates are not overridden in the uiSchema
    const {
        ButtonTemplates: { AddButton },
    } = registry.templates;
    const { labelAlign = 'left', rowGutter = 16 } = formContext as GenericObjectType;

    const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
    const prefixCls = getPrefixCls('form');
    const labelClsBasic = `${prefixCls}-item-label`;
    const labelColClassName = classNames(
        labelClsBasic,
        labelAlign === 'left' && `${labelClsBasic}-left`
        // labelCol.className,
    );

    const BTN_GRP_STYLE = {
        width: '100%',
    };

    return (
        <fieldset className={className} id={idSchema.$id}>
            <Row gutter={rowGutter}>
                {(uiOptions.title || title) && (
                    <Col className={labelColClassName} span={23}>
                        <ArrayFieldTitleTemplate
                            idSchema={idSchema}
                            required={required}
                            title={uiOptions.title || title}
                            schema={schema}
                            uiSchema={uiSchema}
                            registry={registry}
                        />
                    </Col>
                )}

                {canAdd && (
                    <Col span={1}>
                        <AddButton
                            className='array-item-add'
                            disabled={disabled || readonly}
                            onClick={onAddClick}
                            uiSchema={uiSchema}
                            registry={registry}
                            style={BTN_GRP_STYLE}
                        />
                    </Col>
                )}
            </Row>
            <Row gutter={rowGutter}>
                <Col className='row array-item-list' span={24}>
                    {items &&
                        items.map(({ key, ...itemProps }: ArrayFieldTemplateItemType<T, S, F>) => (
                            <ArrayFieldItemTemplate key={key} {...itemProps} />
                        ))}
                </Col>

            </Row>
        </fieldset>
    );
}