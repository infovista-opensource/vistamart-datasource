import React, { PureComponent } from 'react';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { InlineFormLabel, SegmentAsync } from '@grafana/ui';
import { DataSource } from './DataSource';
import { MyDataSourceOptions, AnnotationQuery } from './types';

type Props = QueryEditorProps<DataSource, AnnotationQuery, MyDataSourceOptions> & {
  annotation?: AnnotationQuery;
  onAnnotationChange?: (annotation: AnnotationQuery) => void;
};

interface State {
  vista?: string;
  instance?: string;
  indicator?: string;
}

export class AnnotationEditor extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const anno = props.annotation ?? props.query;
    this.state = {
      vista: anno?.vista,
      instance: anno?.instance,
      indicator: anno?.indicator,
    };
  }

  private notify(patch: Partial<State>): void {
    const anno = this.props.annotation ?? this.props.query;
    this.props.onAnnotationChange?.({ ...anno, ...patch });
  }

  handleChangeVista = (event: SelectableValue<string>): void => {
    const vista = event?.label;
    this.setState({ vista, instance: undefined, indicator: undefined });
    this.notify({ vista, instance: undefined, indicator: undefined });
  };

  handleChangeInstance = (event: SelectableValue<string>): void => {
    const instance = event?.value;
    this.setState({ instance });
    this.notify({ instance });
  };

  handleChangeIndicator = (event: SelectableValue<string>): void => {
    const indicator = event?.label;
    this.setState({ indicator });
    this.notify({ indicator });
  };

  render() {
    const { datasource } = this.props;
    const { vista, instance, indicator } = this.state;

    return (
      <div>
        <div className="gf-form-inline">
          <InlineFormLabel width={8} className="query-keyword">Vista</InlineFormLabel>
          <SegmentAsync
            value={vista ? { label: vista, value: vista } : undefined}
            loadOptions={() => datasource.getAllVista(null)}
            onChange={this.handleChangeVista}
            placeholder="Select a Vista"
            allowCustomValue
          />
        </div>
        <div className="gf-form-inline">
          <InlineFormLabel width={8} className="query-keyword">Instance</InlineFormLabel>
          <SegmentAsync
            value={instance ? { label: instance, value: instance } : undefined}
            loadOptions={() => vista
              ? datasource.getAllInstancesLabel(undefined, vista, null)
              : Promise.resolve([])
            }
            onChange={this.handleChangeInstance}
            placeholder="Select an Instance"
            allowCustomValue
          />
        </div>
        <div className="gf-form-inline">
          <InlineFormLabel width={8} className="query-keyword">Indicator</InlineFormLabel>
          <SegmentAsync
            value={indicator ? { label: indicator, value: indicator } : undefined}
            loadOptions={() => vista
              ? datasource.getAllEventIndicators(vista)
              : Promise.resolve([])
            }
            onChange={this.handleChangeIndicator}
            placeholder="Select an Indicator"
            allowCustomValue
          />
        </div>
      </div>
    );
  }
}
