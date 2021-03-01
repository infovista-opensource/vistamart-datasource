import { getBackendSrv } from '@grafana/runtime';
import { DateTime, ScopedVars, SelectableValue } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { map } from 'rxjs/operators';
import { TextToISO8601, ISO8601ToText } from './dr';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions, MyMetricFindValue, MyMetricFindQuery } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.serverUrl = instanceSettings.url;
  }

  serverUrl: any;

  routePath = '/vistaapi';

  private buildBaseUrl(): string {
    return this.serverUrl + this.routePath;
  }

  private parseMetricFindQueryResult2Tag(results: any): MyMetricFindValue[] {
    const res: MyMetricFindValue[] = [];
    results.data.forEach((m: { name: any; tag: any }) => {
      res.push({ text: m.name, value: m.tag });
    });
    return res;
  }

  private parseMetricFindQueryResult2(results: any): MyMetricFindValue[] {
    const res: MyMetricFindValue[] = [];
    results.data.forEach((m: { name: any }) => {
      res.push({ text: m.name });
    });
    return res;
  }

  private parseMetricFindQueryResultTag(
    results: any,
    removeOption: SelectableValue<string> | null,
    addWid?: boolean
  ): Array<SelectableValue<string>> {
    const res = new Array<SelectableValue<string>>();
    if (removeOption !== null) res.push(removeOption);
    results.data.forEach((m: { name: any; tag: any }) => {
      res.push({ label: m.name, value: m.tag });
    });
    return res;
  }

  private parseMetricFindQueryResult(
    results: any,
    removeOption: SelectableValue<string> | null,
    addWid?: boolean
  ): Array<SelectableValue<string>> {
    const res = new Array<SelectableValue<string>>();
    if (removeOption !== null) res.push(removeOption);
    if (addWid !== undefined) {
      results.data.forEach((m: { name: any; wid: any }) => {
        res.push({ label: m.name, value: m.wid });
      });
    } else {
      results.data.forEach((m: { name: any }) => {
        res.push({ label: m.name, value: m.name });
      });
    }
    return res;
  }

  private parseMetricFindQueryResultDr(
    results: any,
    removeOption: SelectableValue<string> | null
  ): Array<SelectableValue<string>> {
    const res = new Array<SelectableValue<string>>();
    if (removeOption !== null) res.push(removeOption);
    results.data.forEach((name: string) => {
      const dr = ISO8601ToText[name];
      res.push({ label: dr, value: name });
    });
    return res;
  }

  private parseMetricFindQueryResultDr2(results: any): MyMetricFindValue[] {
    const res: MyMetricFindValue[] = [];
    results.data.forEach((name: string) => {
      const dr = ISO8601ToText[name];
      res.push({ text: dr });
    });
    return res;
  }

  async getallVista(removeOption: SelectableValue<string>): Promise<Array<SelectableValue<string>>> {
    const result = getBackendSrv()
      .fetch({
        method: 'GET',
        url: this.buildBaseUrl() + '/v1/model/vistas',
        headers: { Range: 'items=1-' },
      })
      .pipe(map((data: any) => this.parseMetricFindQueryResult(data, removeOption, true)))
      .toPromise();
    return result;
  }

  async getallInstances(
    parentInstance: any | undefined,
    vistaName: any | undefined,
    removeOption: SelectableValue<string>
  ): Promise<Array<SelectableValue<string>>> {
    const iVistaName = getTemplateSrv().replace(vistaName.label, {}, this.interpolateVariable);
    let url = this.buildBaseUrl() + '/v1/topology?vistaName=' + encodeURIComponent(iVistaName);
    if (parentInstance !== undefined) {
      const iParentInstance = getTemplateSrv().replace(parentInstance.value, {}, this.interpolateVariable);
      url = url + '&basicTag=' + encodeURIComponent(iParentInstance);
    }
    const result = getBackendSrv()
      .fetch({
        method: 'GET',
        url: url,
        headers: { Range: 'items=1-' },
      })
      .pipe(map((data: any) => this.parseMetricFindQueryResultTag(data, removeOption)))
      .toPromise();
    return result;
  }

  async getallProperties(
    vistaName: any | undefined,
    removeOption: SelectableValue<string>
  ): Promise<Array<SelectableValue<string>>> {
    const iVistaName = getTemplateSrv().replace(vistaName.label, {}, this.interpolateVariable);
    const result = getBackendSrv()
      .fetch({
        method: 'GET',
        url: this.buildBaseUrl() + '/v1/model/properties?vistaName=' + encodeURIComponent(iVistaName),
        headers: { Range: 'items=1-' },
      })
      .pipe(map((data: any) => this.parseMetricFindQueryResult(data, removeOption)))
      .toPromise();
    return result;
  }

  async getallIndicators(
    vistaName: any | undefined,
    removeOption: SelectableValue<string>
  ): Promise<Array<SelectableValue<string>>> {
    const iVistaName = getTemplateSrv().replace(vistaName.label, {}, this.interpolateVariable);
    const result = getBackendSrv()
      .fetch({
        method: 'GET',
        url: this.buildBaseUrl() + '/v1/model/indicators?vistaName=' + encodeURIComponent(iVistaName),
        headers: { Range: 'items=1-' },
      })
      .pipe(map((data: any) => this.parseMetricFindQueryResult(data, removeOption, true)))
      .toPromise();
    return result;
  }

  async getallDr(
    instanceTag: any | undefined,
    indicatorName: any | undefined,
    removeOption: SelectableValue<string>
  ): Promise<Array<SelectableValue<string>>> {
    const result = getBackendSrv()
      .fetch({
        method: 'GET',
        url: this.buildBaseUrl() + '/v1/vistamart/displayRates',
        headers: { Range: 'items=1-' },
      })
      .pipe(map((data: any) => this.parseMetricFindQueryResultDr(data, removeOption)))
      .toPromise();
    return result;
  }

  interpolateVariable = (value: string | string[] | number, variable: any) => {
    return value;
  };

  async metricFindQuery(query: string): Promise<MyMetricFindValue[]> {
    const obj: MyMetricFindQuery = JSON.parse(query);

    const r: MyMetricFindValue[] = [];
    if (obj.type == 'vista') {
      // Vista
      const result = getBackendSrv()
        .fetch({
          method: 'GET',
          url: this.buildBaseUrl() + '/v1/model/vistas',
          headers: { Range: 'items=1-' },
        })
        .pipe(map((data: any) => this.parseMetricFindQueryResult2(data)))
        .toPromise();
      return result;
    }
    if (obj.type == 'instance') {
      // Instance
      const vistaName = getTemplateSrv().replace(obj.filter, {}, this.interpolateVariable);
      const result = getBackendSrv()
        .fetch({
          method: 'GET',
          url: this.buildBaseUrl() + '/v1/topology?vistaName=' + encodeURIComponent(vistaName),
          headers: { Range: 'items=1-' },
        })
        .pipe(map((data: any) => this.parseMetricFindQueryResult2Tag(data)))
        .toPromise();
      return result;
    }
    if (obj.type == 'dr') {
      // Display Rate
      const result = getBackendSrv()
        .fetch({
          method: 'GET',
          url: this.buildBaseUrl() + '/v1/vistamart/displayRates',
          headers: { Range: 'items=1-' },
        })
        .pipe(map((data: any) => this.parseMetricFindQueryResultDr2(data)))
        .toPromise();
      return result;
    }
    if (obj.type == 'cinstance') {
      // Content Instance
      const instanceTag = getTemplateSrv().replace(obj.filter, {}, this.interpolateVariable);
      const vistaName = getTemplateSrv().replace(obj.subfilter, {}, this.interpolateVariable);
      const result = getBackendSrv()
        .fetch({
          method: 'GET',
          url:
            this.buildBaseUrl() +
            '/v1/topology?basicTag=' +
            encodeURIComponent(instanceTag) +
            '&vistaName=' +
            encodeURIComponent(vistaName),
          headers: { Range: 'items=1-' },
        })
        .pipe(map((data: any) => this.parseMetricFindQueryResult2Tag(data)))
        .toPromise();
      return result;
    }
    return r;
  }

  async doRequest(scopedVars: ScopedVars, target: MyQuery, startTime: DateTime, endTime: DateTime) {
    // Add Display Rate
    let dr = '';
    const drQuery = getTemplateSrv().replace(target.dr.label, scopedVars, this.interpolateVariable);
    dr = TextToISO8601[drQuery];
    let url = this.buildBaseUrl() + '/v1/vistamart/data?';
    url = url + 'displayRate=' + encodeURIComponent(dr);

    // Add interval
    url = url + '&interval=' + encodeURIComponent(startTime.toISOString() + '/' + endTime!.toISOString());

    // Iterate on instances
    let gotInstance = false;
    const instancesJson =
      target.instance !== undefined && target.instance !== null
        ? getTemplateSrv().replace(target.instance.value, scopedVars)
        : undefined;
    if (instancesJson !== undefined) {
      if (instancesJson.startsWith('[')) {
        const instances = JSON.parse(instancesJson);
        instances.forEach((instance: string) => {
          url = url + '&instances=' + encodeURIComponent(instance);
        });
        gotInstance = true;
      } else {
        url = url + '&instances=' + encodeURIComponent(instancesJson);
        gotInstance = true;
      }
    }

    // Add vista
    if (!gotInstance) {
      const vista = getTemplateSrv().replace(target.vista.label, scopedVars, this.interpolateVariable);
      if (vista !== undefined) url = url + '&vistas=' + encodeURIComponent(vista);
    }

    // Iterate on indicators
    const indicator = target.indicator !== undefined ? target.indicator.label : undefined;
    if (indicator !== undefined) url = url + '&indicators=' + encodeURIComponent(indicator);

    const result = getBackendSrv().datasourceRequest({
      url: url,
      method: 'GET',
    });

    return result;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const targets = options.targets;
    const scopedVars: ScopedVars = options.scopedVars;

    const promises: any[] = [];
    targets.forEach((target) => {
      const promise = this.doRequest(scopedVars, target, options.range.from, options.range.to).then((response) => {
        const frames: MutableDataFrame[] = [];
        const responses: any[] = response.data;

        var fieldMap: any = {};
        var timeMap: any = {};
        if (responses.length > 0) {
          responses.forEach((response) => {
            const key = '(' + response.indicator.name + ') (' + response.instance.name + ')';
            if (timeMap[response.timestamp] === undefined) {
              timeMap[response.timestamp] = {};
            }
            if (response.values.length > 0) {
              if (response.values[0].value !== undefined) {
                timeMap[response.timestamp][key] = response.values[0].value;
              }
            }
            if (fieldMap[key] === undefined) {
              let tag: string = target.alias !== undefined ? target.alias : '';
              if (tag?.length > 0) {
                tag = tag.replace('$i', response.indicator.name);
                tag = tag.replace('$n', response.instance.name);
                if (response.basicInstance !== null) {
                  tag = tag.replace('$N', response.basicInstance.name);
                  tag = tag.replace('$T', response.basicInstance.tag);
                }
                tag = tag.replace('$t', response.instance.tag);
              } else {
                tag = response.indicator.name + ' (' + response.instance.name + ')';
              }
              const field: any = { name: tag, type: FieldType.number };
              fieldMap[key] = field;
            }
          });
        }

        const fields: any[] = [];
        for (var value in fieldMap) {
          fields.push(fieldMap[value]);
        }

        const frame = new MutableDataFrame({
          refId: target.refId,
          fields: [{ name: 'Time', type: FieldType.time }, ...fields],
        });

        for (var time in timeMap) {
          let valuesMap: any = timeMap[time];
          const values: any[] = [];
          for (var keyMap in valuesMap) {
            let value: any = valuesMap[keyMap as any];
            values.push(value);
          }
          frame.appendRow([time, ...values]);
        }
        frames.push(frame);
        return frames;
      });
      promises.push(promise);
    });
    return Promise.all(promises).then((data) => this.responseToDataQueryResponse(data));
  }

  responseToDataQueryResponse(response: MutableDataFrame<any>[]): DataQueryResponse {
    const v = {
      data: response.flatMap((data) => {
        return data;
      }),
    };
    return v;
  }

  responseToDataQueryResponse2(response: MutableDataFrame<any>[][]): DataQueryResponse {
    const v = {
      data: response.flatMap((data) => {
        return data;
      }),
    };
    return v;
  }

  async test() {
    return getBackendSrv().datasourceRequest({
      url: this.buildBaseUrl() + '/v1/model/vistas',
      headers: { Range: 'items=1-' },
      method: 'GET',
    });
  }

  async testDatasource() {
    const response = await this.test();
    if (response.status === 200) {
      return {
        status: 'success',
        message: 'Success',
      };
    } else {
      return {
        status: 'error',
        message: 'Error',
      };
    }
  }
}
