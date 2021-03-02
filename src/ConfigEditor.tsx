import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions } from './types';

const { FormField, SecretFormField } = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  onURLChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const urlRoot = event.target.value.replace('/api', '');
    const jsonData = {
      ...options.jsonData,
      url: event.target.value,
      urlRoot: urlRoot,
    };
    onOptionsChange({ ...options, jsonData, url: urlRoot });
  };

  onClientIDChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      client_id: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  onClientSecretChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      client_secret: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  onResetClientSecret = () => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      client_secret: '',
    };
    onOptionsChange({ ...options, jsonData });
  };

  render() {
    const { options } = this.props;
    const { jsonData } = options;

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <FormField
            label="VistaPortal URL"
            labelWidth={15}
            inputWidth={20}
            onChange={this.onURLChange}
            value={jsonData.url || ''}
            placeholder="VistaPortal URL"
          />
        </div>
        <div className="gf-form">
          <FormField
            label="VistaPortal OAuth2 Client ID"
            labelWidth={15}
            inputWidth={20}
            onChange={this.onClientIDChange}
            value={jsonData.client_id || ''}
            placeholder="VistaPortal OAuth2 Client ID"
          />
        </div>
        <div className="gf-form">
          <SecretFormField
            isConfigured={(jsonData && jsonData.client_secret?.length! > 24) as boolean}
            label="VistaPortal OAuth2 Client Secret"
            labelWidth={15}
            inputWidth={20}
            onReset={this.onResetClientSecret}
            onChange={this.onClientSecretChange}
            value={jsonData.client_secret || ''}
            placeholder="VistaPortal OAuth2 Client Secret"
          />
        </div>
      </div>
    );
  }
}
