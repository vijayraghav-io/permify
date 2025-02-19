import React, {useState} from 'react'
import {Allotment} from 'allotment'
import "allotment/dist/style.css";
import Schema from "./schema";
import Visualizer from "./visualizer";
import {Button, Card, Radio} from "antd";
import {
    CheckCircleOutlined,
    CopyOutlined,
    ExclamationCircleOutlined,
    ExpandOutlined, FullscreenExitOutlined,
} from "@ant-design/icons";
import Relationships from "./particials/data/relationships";
import Attributes from "./particials/data/attributes";
import {useShapeStore} from "../../state/shape";
import Enforcement from "./enforcement";

function Output(props) {
    const [dataSelected, setDataSelected] = useState('relationships');
    const [schemaSelected, setSchemaSelected] = useState('schema');
    const [isOpen, setIsOpen] = useState(false);

    const {runAssertions, runLoading, scenariosError, assertionCount} = useShapeStore();

    const {schema} = useShapeStore();

    const onDataSelectedChange = ({target: {value}}) => {
        setDataSelected(value);
    };

    const onSchemaSelectedChange = ({target: {value}}) => {
        setSchemaSelected(value);
    };

    const [isSchemaCopied, setIsSchemaCopied] = useState(false);

    function copySchema(text) {
        if ('clipboard' in navigator) {
            setIsSchemaCopied(true)
            return navigator.clipboard.writeText(JSON.stringify(text));
        } else {
            return document.execCommand('copy', true, text);
        }
    }

    const renderDataComponent = () => {
        switch (dataSelected) {
            case "relationships":
                return <Relationships/>;
            case "attributes":
                return <Attributes/>;
            default:
                return null;
        }
    }

    const renderSchemaComponent = () => {
        switch (schemaSelected) {
            case "schema":
                return <Schema/>;
            case "visualizer":
                return <Visualizer/>;
            default:
                return null;
        }
    }

    const [allotmentStatus, setAllotmentStatus] = React.useState("default");

    const open = () => {
        setAllotmentStatus("open")
        setIsOpen(!isOpen)
    };

    const reset = () => {
        setAllotmentStatus("default")
        setIsOpen(!isOpen)
    };

    return (
        <div>
            {!props.loading &&
                <>
                    <div style={{height: '100vh'}} className="ml-10 mr-10">
                        <Allotment vertical defaultSizes={[100, 100]} >
                            <Allotment.Pane snap visible={!isOpen}>
                                <Allotment>
                                    <Allotment.Pane snap>
                                        <Card title={
                                            <Radio.Group defaultValue="schema" buttonStyle="solid"
                                                         onChange={onSchemaSelectedChange}
                                                         value={schemaSelected} optionType="button">
                                                <Radio.Button value="schema">Schema</Radio.Button>
                                                <Radio.Button value="visualizer">Visualizer</Radio.Button>
                                            </Radio.Group>
                                        } className="mr-10" extra={<Button onClick={() => {
                                            copySchema(schema)
                                        }} icon={<CopyOutlined/>}>{isSchemaCopied ? 'Copied!' : 'Copy'}</Button>}>
                                            {renderSchemaComponent()}
                                        </Card>
                                    </Allotment.Pane>
                                    <Allotment.Pane snap>
                                        <Card title="Enforcement" className="ml-10"
                                              extra={<div style={{display: 'flex', alignItems: 'center'}}>
                                                  <Button
                                                      icon={assertionCount === 0 ? null : scenariosError.length > 0 ?
                                                          <ExclamationCircleOutlined/> :
                                                          <CheckCircleOutlined/>}
                                                      type="primary"
                                                      loading={runLoading}
                                                      onClick={() => {
                                                          runAssertions()
                                                      }}>Run</Button>
                                              </div>}>
                                            <Enforcement/>
                                        </Card>
                                    </Allotment.Pane>
                                </Allotment>
                            </Allotment.Pane>
                            <Allotment.Pane snap>
                                <Card title={
                                    <Radio.Group
                                        defaultValue="relationships"
                                        buttonStyle="solid"
                                        onChange={onDataSelectedChange}
                                        value={dataSelected}
                                    >
                                        <Radio.Button value="relationships">Relationships</Radio.Button>
                                        <Radio.Button value="attributes">Attributes</Radio.Button>
                                    </Radio.Group>} className="mt-10" extra={
                                    allotmentStatus === "default" ?
                                        <Button className="ml-auto" icon={<ExpandOutlined/>} onClick={open}/>
                                        :
                                        <Button className="ml-auto" icon={<FullscreenExitOutlined/>}
                                                onClick={reset}/>
                                }>
                                    {renderDataComponent()}
                                </Card>
                            </Allotment.Pane>
                        </Allotment>
                    </div>
                </>
            }
        </div>
    );
}


export default Output;
