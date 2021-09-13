import { DataSource } from './DataSource';

export class AnnotationQueryEditor {
    static templateUrl = 'partials/annotations.editor.html';
  
    // @ts-ignore
    private datasource?: DataSource;

    annotation: any;

    vistaOptions: Array<{ text: string; value: string }>;
  
    constructor() {

      this.annotation!.vista = this.annotation!.vista || '';
      this.annotation!.instance = this.annotation!.instance || '';
      this.annotation!.indicator = this.annotation!.indicator || '';
      
      // @ts-ignore
      this.annotation.datasourceId = this.datasource.id;
      this.vistaOptions = [];
      this.initDropdowns();
    }

    async initDropdowns() {
      await this.getVistas();
    }

    async getVistas() {

      return this.datasource!.getallVista(null).then((subs: any[]) => {
        subs.forEach(sub => {
          this.vistaOptions.push({text: sub.label, value:sub.label});
        });
      });
    }

    getVistaOptions() : any {
      return this.vistaOptions;
    }

    getIndicatorOptions() : any {
      return this.datasource!.getallEventIndicators(this.annotation.vista).then((indicators: any[]) => {
        let options : any[] = [];
        indicators.forEach(indicator => {
          options.push({text : indicator.label, value: indicator.label});
        });
        return options;
      });
    }

    getInstanceOptions() : any {
      return this.datasource!.getallInstancesLabel(undefined, this.annotation.vista, null).then((instances: any[]) => {
        let options : any[] = [];
        instances.forEach(instance => {
          options.push({text : instance.name, value: instance.tag});
        });
        return options;
      });
    }

    onChangeVista() : any {
      this.annotation!.indicator = undefined;
      this.annotation!.instance = undefined;
    }

    onChangeIndicator() : any {
    }

    onChangeInstance() : any {
    }
  }