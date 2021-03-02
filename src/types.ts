import { MetricFindValue, DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyVariableQuery {
  type?: number;
  filter?: string;
}

export interface MyQuery extends DataQuery {
  vista?: any;
  indicator?: any;
  property1?: any;
  propertyValue1?: string;
  property2?: any;
  propertyValue2?: string;
  property3?: any;
  propertyValue3?: string;
  instance?: any;
  dr?: any;
  parentVista?: any;
  parentInstance?: any;
  parentProperty?: any | undefined;
  parentPropertyValue?: any | undefined;
  alias?: string;
}

export interface MyMetricFindValue extends MetricFindValue {
  value?: string;
}

export interface MyMetricFindQuery {
  type: string;
  filter?: string;
  subfilter?: string;
}

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  url?: string;
  urlRoot?: string;
  client_id?: string;
  client_secret?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {}
