import React, { FunctionComponent, PureComponent, FocusEvent, ChangeEvent } from 'react';
import { Input, FieldSet, SegmentAsync, InlineFormLabel, HorizontalGroup } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from './DataSource';
import { MyDataSourceOptions, MyQuery } from './types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

interface Istate {
  vista?: any | undefined;
  indicator?: any | undefined;
  instance?: any | undefined;
  property1?: any | undefined;
  propertyValue1?: any | undefined;
  property2?: any | undefined;
  propertyValue2?: any | undefined;
  property3?: any | undefined;
  propertyValue3?: any | undefined;
  parentProperty?: any | undefined;
  parentPropertyValue?: any | undefined;
  alias?: any | undefined;
  parentVista?: any | undefined;
  parentInstance?: any | undefined;
  dr?: any | string;
}

const getParentVista = (props: Props) => (props !== undefined ? props.query.parentVista : undefined);
const getVista = (props: Props) => (props !== undefined ? props.query.vista : undefined);
const getInstance = (props: Props) => (props !== undefined ? props.query.instance : undefined);
const getParentInstance = (props: Props) => (props !== undefined ? props.query.parentInstance : undefined);
const getIndicator = (props: Props) => (props !== undefined ? props.query.indicator : undefined);
const getProperty1 = (props: Props) => (props !== undefined ? props.query.property1 : undefined);
const getPropertyValue1 = (props: Props) => (props !== undefined ? props.query.propertyValue1 : undefined);
const getProperty2 = (props: Props) => (props !== undefined ? props.query.property2 : undefined);
const getPropertyValue2 = (props: Props) => (props !== undefined ? props.query.propertyValue2 : undefined);
const getProperty3 = (props: Props) => (props !== undefined ? props.query.property3 : undefined);
const getPropertyValue3 = (props: Props) => (props !== undefined ? props.query.propertyValue3 : undefined);
const getParentProperty = (props: Props) => (props !== undefined ? props.query.parentProperty : undefined);
const getParentPropertyValue = (props: Props) => (props !== undefined ? props.query.parentPropertyValue : undefined);
const getAlias = (props: Props) => (props !== undefined ? props.query.alias : undefined);
const getDr = (props: Props) => (props !== undefined ? props.query.dr : undefined);

const removeText = '-- remove --';
const removeOption: SelectableValue<string> = { label: removeText, value: removeText };

export const SegmentAsyncLabel: FunctionComponent<Partial<any>> = ({ label, labelWidth, children, tooltip }) => {
  return (
    <div>
      <div className="gf-form-inline">
        <div className="gf-form">
          <InlineFormLabel width={labelWidth} className="query-keyword" tooltip={tooltip}>
            {label}
          </InlineFormLabel>
        </div>
        {children}
      </div>
    </div>
  );
};

export class QueryEditor extends PureComponent<Props, Istate> {
  readonly state = {
    useParentVista: false,
    parentVista: getParentVista(this.props),
    parentInstance: getParentInstance(this.props),
    vista: getVista(this.props),
    indicator: getIndicator(this.props),
    instance: getInstance(this.props),
    property1: getProperty1(this.props),
    propertyValue1: getPropertyValue1(this.props),
    property2: getProperty2(this.props),
    propertyValue2: getPropertyValue2(this.props),
    property3: getProperty3(this.props),
    propertyValue3: getPropertyValue3(this.props),
    parentProperty: getParentProperty(this.props),
    parentPropertyValue: getParentPropertyValue(this.props),
    alias: getAlias(this.props),
    dr: getDr(this.props),
  };

  private query: MyQuery | undefined = undefined;

  constructor(props: Props) {
    super(props);
    this.state = Object.assign(this.state, this.props.query);
    this.query = Object.assign(this.state);
  }

  private checkRunQueryInput(event: FocusEvent<HTMLInputElement>) {
    this.checkRunQuery();
  }

  private checkRunQuery() {
    if (this.query === undefined) {
      return;
    }
    if (this.query.vista === undefined) {
      return;
    }
    if (this.query.indicator === undefined) {
      return;
    }
    if (this.query.dr === undefined) {
      return;
    }

    this.props.onRunQuery();
  }

  handleChangeVista = (event: SelectableValue<any>) => {
    this.query!.instance = undefined;
    this.query!.indicator = undefined;
    this.query!.dr = undefined;
    this.query!.vista = removeOption !== event ? event : undefined;

    this.setState({ instance: undefined });
    this.setState({ indicator: undefined });
    this.setState({ dr: undefined });
    this.setState({ vista: removeOption !== event ? event : undefined });

    this.props.onChange({ ...this.props.query, dr: undefined, vista: event, parentVista: undefined });
    this.checkRunQuery();
  };

  handleChangeIndicator = (event: SelectableValue<any>) => {
    this.query!.indicator = removeOption !== event ? event : undefined;
    this.query!.dr = undefined;

    this.setState({ dr: undefined });
    this.setState({ indicator: removeOption !== event ? event : undefined });

    this.props.onChange({ ...this.props.query, dr: undefined, indicator: removeOption !== event ? event : undefined });
    this.checkRunQuery();
  };

  handleChangeInstance = (event: SelectableValue<any>) => {
    this.query!.instance = removeOption !== event ? event : undefined;
    this.setState({ instance: removeOption !== event ? event : undefined });

    this.props.onChange({ ...this.props.query, instance: removeOption !== event ? event : undefined });
    this.checkRunQuery();
  };

  handleChangeDisplayRate = (event: SelectableValue<any>) => {
    this.query!.dr = removeOption !== event ? event : undefined;

    this.setState({ dr: removeOption !== event ? event : undefined });

    this.props.onChange({ ...this.props.query, dr: removeOption !== event ? event : undefined });
    this.checkRunQuery();
  };

  handleChangeParentVista = (event: SelectableValue<any>) => {
    this.query!.parentVista = removeOption !== event ? event : undefined;
    this.query!.parentInstance = undefined;

    this.setState({ parentInstance: undefined });
    this.setState({ parentVista: removeOption !== event ? event : undefined });

    this.props.onChange({ ...this.props.query, parentVista: removeOption !== event ? event : undefined });
    this.checkRunQuery();
  };

  handleChangeParentInstance = (event: SelectableValue<any>) => {
    this.query!.parentInstance = removeOption !== event ? event : undefined;

    this.setState({ parentInstance: removeOption !== event ? event : undefined });

    this.props.onChange({ ...this.props.query, parentInstance: removeOption !== event ? event : undefined });
    this.checkRunQuery();
  };

  handleChangeProperty1 = (event: SelectableValue<any>) => {
    this.query!.property1 = removeOption !== event ? event : undefined;
    this.setState({ property1: removeOption !== event ? event : undefined });
    this.props.onChange({ ...this.props.query, property1: removeOption !== event ? event : undefined });
    this.checkRunQuery();
  };

  handleChangePropertyValue1 = (event: ChangeEvent<HTMLInputElement>) => {
    this.query!.propertyValue1 = event.target.value;
    this.setState({ propertyValue1: removeOption !== event ? event.target.value : undefined });
    this.props.onChange({ ...this.props.query, propertyValue1: event.target.value });
  };

  handleChangeProperty2 = (event: SelectableValue<any>) => {
    this.query!.property2 = removeOption !== event ? event : undefined;
    this.setState({ property2: removeOption !== event ? event : undefined });
    this.props.onChange({ ...this.props.query, property2: removeOption !== event ? event : undefined });
    this.checkRunQuery();
  };

  handleChangePropertyValue2 = (event: ChangeEvent<HTMLInputElement>) => {
    this.query!.propertyValue2 = event.target.value;
    this.setState({ propertyValue2: removeOption !== event ? event.target.value : undefined });
    this.props.onChange({ ...this.props.query, propertyValue2: event.target.value });
  };

  handleChangeProperty3 = (event: SelectableValue<any>) => {
    this.query!.property3 = removeOption !== event ? event : undefined;
    this.setState({ property3: removeOption !== event ? event : undefined });
    this.props.onChange({ ...this.props.query, property3: removeOption !== event ? event : undefined });
    this.checkRunQuery();
  };

  handleChangePropertyValue3 = (event: ChangeEvent<HTMLInputElement>) => {
    this.query!.propertyValue3 = event.target.value;
    this.setState({ propertyValue3: removeOption !== event ? event.target.value : undefined });
    this.props.onChange({ ...this.props.query, propertyValue3: event.target.value });
  };

  handleChangeParentProperty = (event: SelectableValue<any>) => {
    this.query!.parentProperty = removeOption !== event ? event : undefined;

    this.setState({ parentProperty: removeOption !== event ? event : undefined });

    this.props.onChange({ ...this.props.query, parentProperty: removeOption !== event ? event : undefined });
    this.checkRunQuery();
  };

  handleChangeParentPropertyValue = (event: ChangeEvent<HTMLInputElement>) => {
    this.query!.parentPropertyValue = event.target.value;

    this.setState({ parentPropertyValue: removeOption !== event ? event.target.value : undefined });

    this.props.onChange({ ...this.props.query, parentPropertyValue: event.target.value });
    this.checkRunQuery();
  };

  handleChangeAlias = (event: ChangeEvent<HTMLInputElement>) => {
    this.query!.alias = event.target.value;

    this.setState({ alias: removeOption !== event ? event.target.value : undefined });

    this.props.onChange({ ...this.props.query, alias: event.target.value });
    this.checkRunQuery();
  };

  render() {
    return (
      <>
        <div style={{ width: '100%' }}>
          <FieldSet label="Parent Instance filtering (optional)">
            <SegmentAsyncLabel label="PARENT VISTA :" grow={true} labelWidth={10}>
              <SegmentAsync
                loadOptions={() => this.props.datasource.getallVista(removeOption)}
                onChange={this.handleChangeParentVista}
                allowCustomValue={true}
                value={this.state.parentVista}
                placeholder="Select an parent vista"
              />
            </SegmentAsyncLabel>
            <SegmentAsyncLabel label="PARENT INSTANCE :" grow={true} labelWidth={10}>
              <SegmentAsync
                loadOptions={() =>
                  this.props.datasource.getallInstances(undefined, this.state.parentVista, removeOption)
                }
                onChange={this.handleChangeParentInstance}
                allowCustomValue={true}
                width={40}
                value={this.state.parentInstance}
                placeholder="Select an Parent Instance"
              />
            </SegmentAsyncLabel>
            <HorizontalGroup>
              <SegmentAsyncLabel label="PARENT PROPERTY :" grow={true} labelWidth={10}>
                <SegmentAsync
                  loadOptions={() => this.props.datasource.getallProperties(this.state.parentVista, removeOption)}
                  onChange={this.handleChangeParentProperty}
                  allowCustomValue={true}
                  value={this.state.parentProperty}
                  placeholder="Select an parent Property"
                />
              </SegmentAsyncLabel>
              <SegmentAsyncLabel label="PARENT PROPERTY VALUE :" grow={true} labelWidth={15}>
                <Input
                  css
                  width={40}
                  value={this.state.parentPropertyValue}
                  onChange={this.handleChangeParentPropertyValue}
                  onBlur={(event: FocusEvent<HTMLInputElement>) => this.checkRunQueryInput(event)}
                  placeholder="Enter the property value"
                />
              </SegmentAsyncLabel>
            </HorizontalGroup>
          </FieldSet>
          <FieldSet label="Main parameters">
            <SegmentAsyncLabel label="VISTA :" grow={true} labelWidth={10}>
              <SegmentAsync
                loadOptions={() => this.props.datasource.getallVista(removeOption)}
                onChange={this.handleChangeVista}
                allowCustomValue={true}
                value={this.state.vista}
                placeholder="Select an vista"
              />
            </SegmentAsyncLabel>
            <SegmentAsyncLabel label="INDICATOR :" grow={true} labelWidth={10}>
              <SegmentAsync
                loadOptions={() => this.props.datasource.getallIndicators(this.state.vista, removeOption)}
                onChange={this.handleChangeIndicator}
                allowCustomValue={true}
                value={this.state.indicator}
                placeholder="Select an indicator"
              />
            </SegmentAsyncLabel>
            <SegmentAsyncLabel label="INSTANCE :" grow={true} labelWidth={10}>
              <SegmentAsync
                loadOptions={() =>
                  this.props.datasource.getallInstances(this.state.parentInstance, this.state.vista, removeOption)
                }
                onChange={this.handleChangeInstance}
                allowCustomValue={true}
                width={40}
                value={this.state.instance}
                placeholder="Select an Instance"
              />
            </SegmentAsyncLabel>
            <SegmentAsyncLabel label="DISPLAY RATE :" grow={true} labelWidth={10}>
              <SegmentAsync
                onChange={this.handleChangeDisplayRate}
                loadOptions={() =>
                  this.props.datasource.getallDr(
                    this.state.instance !== undefined ? this.state.instance.value : undefined,
                    this.state.indicator.label,
                    removeOption
                  )
                }
                value={this.state.dr}
                allowCustomValue={true}
                placeholder="Select a Display Rate"
              />
            </SegmentAsyncLabel>
            <HorizontalGroup>
              <SegmentAsyncLabel label="PROPERTY 1 :" grow={true} labelWidth={10}>
                <SegmentAsync
                  width={30}
                  loadOptions={() => this.props.datasource.getallProperties(this.state.vista, removeOption)}
                  onChange={this.handleChangeProperty1}
                  allowCustomValue={true}
                  value={this.state.property1}
                  placeholder="Select an Property"
                />
              </SegmentAsyncLabel>
              <SegmentAsyncLabel label="PROPERTY VALUE 1 :" grow={true} labelWidth={10}>
                <Input
                  css
                  width={40}
                  value={this.state.propertyValue1}
                  onChange={this.handleChangePropertyValue1}
                  onBlur={(event: FocusEvent<HTMLInputElement>) => this.checkRunQueryInput(event)}
                  placeholder="Enter the property value"
                />
              </SegmentAsyncLabel>
            </HorizontalGroup>
            <HorizontalGroup>
              <SegmentAsyncLabel label="PROPERTY 2 :" grow={true} labelWidth={10}>
                <SegmentAsync
                  loadOptions={() => this.props.datasource.getallProperties(this.state.vista, removeOption)}
                  onChange={this.handleChangeProperty2}
                  allowCustomValue={true}
                  value={this.state.property2}
                  placeholder="Select an Property"
                />
              </SegmentAsyncLabel>
              <SegmentAsyncLabel label="PROPERTY VALUE 2 :" grow={true} labelWidth={10}>
                <Input
                  css
                  width={40}
                  value={this.state.propertyValue2}
                  onChange={this.handleChangePropertyValue2}
                  onBlur={(event: FocusEvent<HTMLInputElement>) => this.checkRunQueryInput(event)}
                  placeholder="Enter the property value"
                />
              </SegmentAsyncLabel>
            </HorizontalGroup>
            <HorizontalGroup>
              <SegmentAsyncLabel label="PROPERTY 3 :" grow={true} labelWidth={10}>
                <SegmentAsync
                  width={40}
                  loadOptions={() => this.props.datasource.getallProperties(this.state.vista, removeOption)}
                  onChange={this.handleChangeProperty3}
                  allowCustomValue={true}
                  value={this.state.property3}
                  placeholder="Select an Property"
                />
              </SegmentAsyncLabel>
              <SegmentAsyncLabel label="PROPERTY VALUE 3 :" grow={true} labelWidth={10}>
                <Input
                  css
                  width={40}
                  value={this.state.propertyValue3}
                  onChange={this.handleChangePropertyValue3}
                  onBlur={(event: FocusEvent<HTMLInputElement>) => this.checkRunQueryInput(event)}
                  placeholder="Enter the property value"
                />
              </SegmentAsyncLabel>
            </HorizontalGroup>
          </FieldSet>
          <FieldSet label="Display Options">
            <SegmentAsyncLabel
              label="ALIAS :"
              grow={true}
              labelWidth={10}
              tooltip="$i: Indicator Name, $t: Instance Tag, $n: Instance Name, $N: Basic Instance Tag, $N: Basic Instance Name, Any other text: The typed text"
            >
              <Input
                css
                width={40}
                value={this.state.alias}
                onChange={this.handleChangeAlias}
                onBlur={(event: FocusEvent<HTMLInputElement>) => this.checkRunQueryInput(event)}
                placeholder="Enter an alias value"
              />
            </SegmentAsyncLabel>
          </FieldSet>
        </div>
      </>
    );
  }
}
