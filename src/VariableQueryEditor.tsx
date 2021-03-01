import React, { PureComponent } from 'react';
import { InlineField, TextArea } from '@grafana/ui';
import { DataSource } from './DataSource';

interface VariableQueryProps {
  query: string;
  onChange: (query?: string) => {};
  datasource: DataSource;
}

export class VariableQueryEditor extends PureComponent<VariableQueryProps> {
  onRefresh = () => {
    // noop
  };

  render() {
    let { query, onChange: onChange } = this.props;
    return (
      <div>
        <InlineField label="Object query" grow={true} labelWidth={20}>
          <TextArea
            value={query || ''}
            placeholder="Object query"
            rows={10}
            css
            onChange={(v) => onChange(v.currentTarget.value)}
          />
        </InlineField>
      </div>
    );
  }
}
