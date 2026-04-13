import React, { ChangeEvent, PureComponent } from 'react';
import { InlineField, Input, SecretInput } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions, MySecureJsonData } from './types';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions, MySecureJsonData> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  onURLChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const urlRoot = event.target.value.replace('/ativanet/api', '');
    const jsonData = {
      ...options.jsonData,
      url: event.target.value,
      urlRoot: urlRoot,
    };
    onOptionsChange({ ...options, jsonData, url: urlRoot });
  };

  onClientIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      clientId: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  onClientSecretChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const secureJsonData = {
      ...options.secureJsonData,
      clientSecret: event.target.value,
    };
    onOptionsChange({ ...options, secureJsonData });
  };

  onResetClientSecret = () => {
    const { onOptionsChange, options } = this.props;
    const secureJsonData = {
      ...options.secureJsonData,
      clientSecret: '',
    };
    const secureJsonFields = {
      ...options.secureJsonFields,
      clientSecret: false,
    };
    onOptionsChange({ ...options, secureJsonData, secureJsonFields });
  };

  render() {
    const { options } = this.props;
    const { jsonData, secureJsonFields } = options;

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <InlineField
            label="Ativa Net API URL *"
            labelWidth={20}
            tooltip="The Ativa Net API URL">
            <Input
              width={45}
              onChange={this.onURLChange}
              value={jsonData.url || ''}
              placeholder="https://portal.ativa:31390/ativanet/api"
            />
          </InlineField>
        </div>
        <div className="gf-form">
          <InlineField
            label="Client ID *"
            labelWidth={20}
            tooltip="The Open ID Connect Client ID">
            <Input
              width={45}
              onChange={this.onClientIdChange}
              value={jsonData.clientId || ''}
              placeholder="Client ID"
            />
          </InlineField>
        </div>
        <div className="gf-form">
          <InlineField
            label="Client Secret *"
            labelWidth={20}
            tooltip="The Open ID Connect Client Secret">
            <SecretInput
              width={45}
              onChange={this.onClientSecretChange}
              onReset={this.onResetClientSecret}
              isConfigured={(secureJsonFields && secureJsonFields.clientSecret) as boolean}
              placeholder="Client Secret"
            />
          </InlineField>
        </div>
      </div>
    );
  }
}
