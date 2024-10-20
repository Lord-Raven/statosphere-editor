import { Col, Row } from 'antd';
import {ArrayFieldTemplateItemType, FormContextType, RJSFSchema, StrictRJSFSchema} from '@rjsf/utils';

const BTN_STYLE = {
    width: '100%',
};

/** The `ArrayFieldItemTemplate` component is the template used to render an items of an array.
 *
 * @param props - The `ArrayFieldTemplateItemType` props for the component
 */
export default function ArrayFieldItemTemplate<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: ArrayFieldTemplateItemType<T, S, F>) {
    const {
        children,
        disabled,
        hasMoveDown,
        hasMoveUp,
        hasRemove,
        hasToolbar,
        index,
        onDropIndexClick,
        onReorderClick,
        readonly,
        registry,
        uiSchema
    } = props;
    const { MoveDownButton, MoveUpButton, RemoveButton } = registry.templates.ButtonTemplates;
    const { rowGutter = 16, toolbarAlign = 'top' } = registry.formContext;
    return (
        <Row align={toolbarAlign} key={`array-item-${index}`} gutter={rowGutter}>
            <Col span={23}><div style={{backgroundColor: '#ffffff11'}}>{children}</div>
            </Col>
            {hasToolbar && (
                <Col span={1}>
                    {(hasMoveUp || hasMoveDown) && (
                        <Row>
                            <MoveUpButton
                                disabled={disabled || readonly || !hasMoveUp}
                                onClick={onReorderClick(index, index - 1)}
                                style={BTN_STYLE}
                                uiSchema={uiSchema}
                                registry={registry}
                            />
                        </Row>
                    )}
                    {(hasMoveUp || hasMoveDown) && (
                        <Row>
                            <MoveDownButton
                                disabled={disabled || readonly || !hasMoveDown}
                                onClick={onReorderClick(index, index + 1)}
                                style={BTN_STYLE}
                                uiSchema={uiSchema}
                                registry={registry}
                            />
                        </Row>
                    )}
                    {hasRemove && (
                        <Row>
                            <RemoveButton
                                disabled={disabled || readonly}
                                onClick={onDropIndexClick(index)}
                                style={BTN_STYLE}
                                uiSchema={uiSchema}
                                registry={registry}
                            />
                        </Row>
                    )}
                </Col>
            )}
        </Row>
    );
}