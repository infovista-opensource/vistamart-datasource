import {getBackendSrv, getTemplateSrv} from '@grafana/runtime';
import {map} from 'rxjs/operators';
import {ISO8601ToText, TextToISO8601} from './dr';
import * as he from 'he';
import {
  AnnotationEvent,
  AnnotationSupport,
  createDataFrame,
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  DateTime,
  FieldType,
  ScopedVars,
  SelectableValue,
} from '@grafana/data';

import {AnnotationQuery, MyDataSourceOptions, MyMetricFindQuery, MyMetricFindValue, MyQuery, MyVariableQuery} from './types';

import {firstValueFrom, of} from 'rxjs';
import {MyVariableSupport} from "./variableSupport";
import {AnnotationEditor} from './AnnotationEditor';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.serverUrl = instanceSettings.url;
    this.uid = instanceSettings.uid;
    this.variables = new MyVariableSupport(this);
  }

  serverUrl: any;

  routePath = '/ativanet/api';
  datamartPath = '/v1/datamart';
  modelPath = '/v1/model';
  topologyPath = '/v1/topology';

  uid: any;

  annotations: AnnotationSupport<AnnotationQuery> = {
    QueryEditor: AnnotationEditor as any,
    prepareQuery: (anno) => ({
      refId: anno.refId ?? 'annotations',
      instance: anno.instance,
      indicator: anno.indicator,
    }),
    processEvents: (anno, data) => {
      const frame = data[0];
      if (!frame || frame.length === 0) {
        return of([]);
      }
      const timeField = frame.fields.find(f => f.name === 'time');
      const timeEndField = frame.fields.find(f => f.name === 'timeEnd');
      const titleField = frame.fields.find(f => f.name === 'title');
      const textField = frame.fields.find(f => f.name === 'text');
      const tagsField = frame.fields.find(f => f.name === 'tags');
      const events: AnnotationEvent[] = [];
      for (let i = 0; i < frame.length; i++) {
        events.push({
          time: timeField?.values[i],
          timeEnd: timeEndField?.values[i],
          title: titleField?.values[i],
          text: textField?.values[i],
          tags: tagsField?.values[i],
          isRegion: true,
          annotation: anno,
        });
      }
      return of(events);
    },
  };

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
    const res = [];
    if (removeOption !== null) {
      res.push(removeOption);
    }
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
    const res = [];
    if (removeOption !== null) {
      res.push(removeOption);
    }
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
    const res = [];
    if (removeOption !== null) {
      res.push(removeOption);
    }
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

  async getAllVista(removeOption: SelectableValue<string> | null): Promise<Array<SelectableValue<string>>> {
    return await firstValueFrom(getBackendSrv()
      .fetch({
        method: 'GET',
        url: this.buildBaseUrl() + this.modelPath + '/vistas',
        headers: {Range: 'items=1-'},
      })
      .pipe(map((data: any) => this.parseMetricFindQueryResult(data, removeOption, true)))
    );
  }

  async getAllInstancesLabel(
    parentInstance: any | undefined,
    vistaName: string | undefined,
    removeOption: SelectableValue<string> | null
  ): Promise<Array<SelectableValue<string>>> {
    const iVistaName = getTemplateSrv().replace(vistaName, {}, this.interpolateVariable);
    let url = this.buildBaseUrl() + this.topologyPath + '?vistaName=' + encodeURIComponent(iVistaName);
    if (parentInstance !== undefined) {
      const iParentInstance = getTemplateSrv().replace(parentInstance.value, {}, this.interpolateVariable);
      url = url + '&basicTag=' + encodeURIComponent(iParentInstance);
    }
    return await firstValueFrom(
      getBackendSrv().fetch({
        method: 'GET',
        url: url,
        headers: {Range: 'items=1-'},
      })
        .pipe(map((data: any) => this.parseMetricFindQueryResultTag(data, removeOption)))
    );
  }

  async getAllInstances(
    parentInstance: any | undefined,
    vistaName: any | undefined,
    removeOption: SelectableValue<string>
  ): Promise<Array<SelectableValue<string>>> {
    const iVistaName = getTemplateSrv().replace(vistaName.label, {}, this.interpolateVariable);
    let url = this.buildBaseUrl() + this.topologyPath + '?vistaName=' + encodeURIComponent(iVistaName);
    if (parentInstance !== undefined) {
      const iParentInstance = getTemplateSrv().replace(parentInstance.value, {}, this.interpolateVariable);
      url = url + '&basicTag=' + encodeURIComponent(iParentInstance);
    }
    return await firstValueFrom(getBackendSrv()
      .fetch({
        method: 'GET',
        url: url,
        headers: {Range: 'items=1-'},
      })
      .pipe(map((data: any) => this.parseMetricFindQueryResultTag(data, removeOption)))
    );
  }

  async getAllProperties(
    vistaName: any | undefined,
    removeOption: SelectableValue<string>
  ): Promise<Array<SelectableValue<string>>> {
    const iVistaName = getTemplateSrv().replace(vistaName.label, {}, this.interpolateVariable);
    return await firstValueFrom(getBackendSrv()
      .fetch({
        method: 'GET',
        url: this.buildBaseUrl() + this.modelPath + '/properties?vistaName=' + encodeURIComponent(iVistaName),
        headers: {Range: 'items=1-'},
      })
      .pipe(map((data: any) => this.parseMetricFindQueryResult(data, removeOption)))
    );
  }

  async getAllEventIndicators(vistaName: string): Promise<Array<SelectableValue<string>>> {
    const iVistaName = getTemplateSrv().replace(vistaName, {}, this.interpolateVariable);
    return await firstValueFrom(getBackendSrv()
      .fetch({
        method: 'GET',
        url: this.buildBaseUrl() + this.modelPath + '/indicators?vistaName=' + encodeURIComponent(iVistaName) + '&type=event',
        headers: {Range: 'items=1-'},
      })
      .pipe(map((data: any) => this.parseMetricFindQueryResult(data, null, true)))
    );
  }

  async getAllIndicators(
    vistaName: any | undefined,
    removeOption: SelectableValue<string> | null
  ): Promise<Array<SelectableValue<string>>> {
    const iVistaName = getTemplateSrv().replace(vistaName.label, {}, this.interpolateVariable);
    return await firstValueFrom(getBackendSrv()
      .fetch({
        method: 'GET',
        url: this.buildBaseUrl() + this.modelPath + '/indicators?vistaName=' + encodeURIComponent(iVistaName),
        headers: {Range: 'items=1-'},
      })
      .pipe(map((data: any) => this.parseMetricFindQueryResult(data, removeOption, true)))
    );
  }

  async getAllDr(
    instanceTag: any | undefined,
    indicatorName: any | undefined,
    removeOption: SelectableValue<string>
  ): Promise<Array<SelectableValue<string>>> {
    return await firstValueFrom(getBackendSrv()
      .fetch({
        method: 'GET',
        url: this.buildBaseUrl() + this.datamartPath + '/displayRates',
        headers: {Range: 'items=1-'},
      })
      .pipe(map((data: any) => this.parseMetricFindQueryResultDr(data, removeOption)))
    );
  }

  interpolateVariable = (value: string | string[] | number, variable: any) => {
    return value;
  };

  async metricFindQuery(query: MyVariableQuery | string, options?: any): Promise<MyMetricFindValue[]> {
    const obj = toMyMetricFindValue(query);

    if (obj.type === 'vista') {
      // Vista
      return await firstValueFrom(getBackendSrv()
        .fetch({
          method: 'GET',
          url: this.buildBaseUrl() + this.modelPath + '/vistas',
          headers: {Range: 'items=1-'},
        })
        .pipe(map((data: any) => this.parseMetricFindQueryResult2(data)))
      );
    }
    if (obj.type === 'instance') {
      // Instance
      const vistaName = getTemplateSrv().replace(obj.filter, {}, this.interpolateVariable);
      return await firstValueFrom(getBackendSrv()
        .fetch({
          method: 'GET',
          url: this.buildBaseUrl() + this.topologyPath + '?vistaName=' + encodeURIComponent(vistaName),
          headers: {Range: 'items=1-'},
        })
        .pipe(map((data: any) => this.parseMetricFindQueryResult2Tag(data)))
      );
    }
    if (obj.type === 'dr') {
      // Display Rate
      return await firstValueFrom(getBackendSrv()
        .fetch({
          method: 'GET',
          url: this.buildBaseUrl() + this.datamartPath + '/displayRates',
          headers: {Range: 'items=1-'},
        })
        .pipe(map((data: any) => this.parseMetricFindQueryResultDr2(data)))
      );
    }
    if (obj.type === 'cinstance') {
      // Content Instance
      const instanceTag = getTemplateSrv().replace(obj.filter, {}, this.interpolateVariable);
      const vistaName = getTemplateSrv().replace(obj.subfilter, {}, this.interpolateVariable);
      return await firstValueFrom(getBackendSrv()
        .fetch({
          method: 'GET',
          url:
            this.buildBaseUrl() +
            this.topologyPath +
            '?basicTag=' +
            encodeURIComponent(instanceTag) +
            '&vistaName=' +
            encodeURIComponent(vistaName),
          headers: {Range: 'items=1-'},
        })
        .pipe(map((data: any) => this.parseMetricFindQueryResult2Tag(data)))
      );
    }
    return [];
  }

  async doRequest(scopedVars: ScopedVars, target: MyQuery, startTime: DateTime, endTime: DateTime) {
    // Add Display Rate
    let dr: string;
    const drQuery = getTemplateSrv().replace(target.dr.label, scopedVars, this.interpolateVariable);
    dr = TextToISO8601[drQuery];
    let url = this.buildBaseUrl() + this.datamartPath + '/data?';
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
      if (vista !== undefined) {
        url = url + '&vistas=' + encodeURIComponent(vista);
      }
    }

    // Iterate on indicators
    const indicator = target.indicator !== undefined ? target.indicator.label : undefined;
    if (indicator !== undefined) {
      url = url + '&indicators=' + encodeURIComponent(indicator);
    }

    return await firstValueFrom(getBackendSrv().fetch({
      url: url,
      method: 'GET',
    }));
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const targets = options.targets;
    const scopedVars: ScopedVars = options.scopedVars;

    // Handle annotation queries routed via AnnotationSupport.prepareQuery
    const annotationTarget = targets.find(t => t.instance !== undefined && t.indicator !== undefined && t.dr === undefined);
    if (annotationTarget) {
      const templatedInstance = getTemplateSrv().replace(annotationTarget.instance, {}, (value: any) => value);
      const response = await this.doEventsRequest(options.range.from, options.range.to, templatedInstance, annotationTarget.indicator);
      const events = this.responseToAnnotationEvent(response, annotationTarget);
      const frame = createDataFrame({
        refId: annotationTarget.refId,
        fields: [
          { name: 'time',    type: FieldType.time,   values: events.map(e => e.time) },
          { name: 'timeEnd', type: FieldType.time,   values: events.map(e => e.timeEnd) },
          { name: 'title',   type: FieldType.string, values: events.map(e => e.title) },
          { name: 'text',    type: FieldType.string, values: events.map(e => e.text) },
          { name: 'tags',    type: FieldType.other,  values: events.map(e => e.tags) },
        ],
      });
      return { data: [frame] };
    }

    const promises: any[] = [];
    targets.forEach((target) => {
      const promise = this.doRequest(scopedVars, target, options.range.from, options.range.to).then((response) => {
        const frames: DataFrame[] = [];
        const responses: any[] = response.data as any[];

        const fieldMap: any = {};
        const timeMap: any = {};
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
              fieldMap[key] = {name: tag, type: FieldType.number};
            }
          });
        }

        // Build values arrays per field from timeMap (fieldMap key = raw key, value.name = display tag)
        const timeValues: any[] = [];
        const fieldValues: Record<string, any[]> = {};
        for (const key of Object.keys(fieldMap)) {
          fieldValues[key] = [];
        }
        for (const time in timeMap) {
          timeValues.push(time);
          for (const key of Object.keys(fieldMap)) {
            fieldValues[key].push(timeMap[time][key] ?? null);
          }
        }

        const frame = createDataFrame({
          refId: target.refId,
          fields: [
            { name: 'Time', type: FieldType.time, values: timeValues },
            ...Object.keys(fieldMap).map(key => ({
              ...fieldMap[key],
              values: fieldValues[key],
            })),
          ],
        });
        frames.push(frame);
        return frames;
      });
      promises.push(promise);
    });
    return Promise.all(promises).then((data) => this.responseToDataQueryResponse(data));
  }

  responseToDataQueryResponse(response: Array<Array<DataFrame>>): DataQueryResponse {
    return {
      data: response.flatMap((data) => {
        return data;
      }),
    };
  }

  computeEventDescription(event: any): string {
    return '<br>' + 'Instance: ' + he.encode(event.instance.name);
  }

  responseToAnnotationEvent(response: any, annotation: any): AnnotationEvent[] {
    const events: AnnotationEvent[] = [];
    response.data.forEach(
      (element: {
        description: string;
        timestart: any;
        timeend: any;
        indicator: any;
        severity: any;
        conditionalType: any;
      }) => {
        const event: AnnotationEvent = { title: he.encode(element.indicator.name), isRegion: true };
        event.time = Date.parse(element.timestart);
        event.timeEnd = Date.parse(element.timeend);
        event.text = this.computeEventDescription(element);
        event.title = he.encode(element.description);
        event.tags = [he.encode(element.severity), he.encode(element.conditionalType)];
        event.annotation = annotation;
        events.push(event);
      }
    );
    return events;
  }

  async doEventsRequest(startTime: DateTime, endTime: DateTime, instance: string, indicator: string) {
    let url = this.buildBaseUrl() + this.datamartPath + '/events?';

    // Add interval
    url = url + 'interval=' + encodeURIComponent(startTime.toISOString() + '/' + endTime!.toISOString());

    // Iterate on instances
    url = url + '&instance=' + encodeURIComponent(instance);
    url = url + '&indicator=' + encodeURIComponent(indicator);

    return await firstValueFrom(getBackendSrv().fetch({
      url: url,
      method: 'GET',
    }));
  }

  async test() {
    return await firstValueFrom(getBackendSrv().fetch({
      url: this.buildBaseUrl() + this.modelPath + '/vistas',
      headers: { Range: 'items=1-' },
      method: 'GET',
    }));
  }

  async testDatasource() {
    const r = await this.updateRealm()
    if (r.status !== 'success') {
      return {
        status: 'success',
        message: 'Success',
      };
    }

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

  async getRealm() {
    return await firstValueFrom(getBackendSrv().fetch({
      url: this.serverUrl + '/ers-user-management/realms',
      method: 'GET',
    }))
  }

  async getDatasource() {
    return await firstValueFrom(getBackendSrv().fetch({
      url: '/api/datasources/uid/' + this.uid,
      method: 'GET',
      params: {accesscontrol:true}
    }))
  }

  async putDatasource(data: any) {
    return await firstValueFrom(getBackendSrv().fetch({
      url: '/api/datasources/uid/' + this.uid,
      method: 'PUT',
      data: data,
    }))
  }

  async updateRealm() {
    const getRealmResponse = await this.getRealm();
    if (getRealmResponse.status !== 200) {
      return {
        status: 'error',
        message: 'Error in realm',
      };
    }

    const getDatasourceResponse = await this.getDatasource();
    if (getDatasourceResponse.status !== 200) {
      return {
        status: 'error',
        message: 'Error in getting settings',
      };
    }

    const realmResp: any = getRealmResponse.data as any

    let data: any = getDatasourceResponse.data as any

    if (realmResp.realm === data.jsonData.realm) {
      return {
        status: 'success',
        message: 'Success',
      };
    }

    data.jsonData.realm = realmResp.realm

    const putDatasourceResponse = await this.putDatasource(data);
    if (putDatasourceResponse.status !== 200) {
      return {
        status: 'error',
        message: 'Error in getting settings',
      };
    }

    return {
      status: 'success',
      message: 'Success',
    };
  }
}

function toMyMetricFindValue(query: string | MyVariableQuery): MyMetricFindQuery {
  if (query) {
    if (typeof query === 'string') {
      return JSON.parse(query) as MyMetricFindQuery;
    } else {
      return toMyMetricFindValue(query.query);
    }
  }
  return {} as MyMetricFindQuery;
}
