import React, {useState} from 'react';
import {MyMetricFindQuery, MyVariableQuery} from './types';
import {Combobox, ComboboxOption, Field, InlineField, Input} from '@grafana/ui';

interface VariableQueryProps {
  query: MyVariableQuery;
  onChange: (value: MyVariableQuery) => void;
}

function toMyVariableQuery(query: string | MyVariableQuery): MyVariableQuery {
  if (query) {
    if (typeof query === 'string') {
      return JSON.parse(query) as MyVariableQuery;
    } else {
      return query;
    }
  }
  return {} as MyVariableQuery;
}

const getType = (query: MyVariableQuery): string | undefined => {
  if (query && query.query) {
    return JSON.parse(query.query)['type'];
  }
  return undefined;
}

const getFilter = (query: MyVariableQuery): string | undefined => {
  const type = getType(query);
  if ((type === 'instance' || type === 'cinstance') && query && query.query) {
    return JSON.parse(query.query)['filter'];
  }
  return undefined;
}

const getSubfilter = (query: MyVariableQuery): string | undefined => {
  const type = getType(query);
  if (type === 'cinstance' && query && query.query) {
    return JSON.parse(query.query)['subfilter'];
  }
  return undefined;
}

export const VariableQueryEditor = ({ query, onChange }: VariableQueryProps) => {
  const [localQuery, setState] = useState<MyVariableQuery>(toMyVariableQuery(query));
  const type = getType(localQuery);

  if (!type) {
    const updated: MyVariableQuery = {
      ...localQuery,
      query: JSON.stringify({
        type: 'dr',
      }),
    };
    setState(updated);
    onChange(updated);
  }

  const handleChangeType = (option: ComboboxOption) => {
    const type = option.value || 'dr';
    let filter = undefined;
    let subfilter = undefined;

    if (type !== 'dr' && type !== 'vista') {
      filter = getFilter(localQuery);
      if (type === 'cinstance') {
        subfilter = getSubfilter(localQuery);
      }
    }

    const updated: MyVariableQuery = {
      ...localQuery,
      query: JSON.stringify({
        type: type,
        filter: filter,
        subfilter: subfilter,
      }),
    };
    setState(updated);
    onChange(updated);
  };

  const handleChangeFilter = (event: React.FormEvent<HTMLInputElement>) => {
    updateField('filter', event.currentTarget.value);
  };

  const handleChangeSubFilter = (event: React.FormEvent<HTMLInputElement>) => {
    updateField('subfilter', event.currentTarget.value);
  };

  const updateField = (name: string, value: string) => {
    const updated: MyVariableQuery = {
      ...localQuery,
      query: JSON.stringify(updateQuery(localQuery, name, value)),
    };
    setState(updated);
    onChange(updated);
  };

  const updateQuery = (query: MyVariableQuery, name: string, value : string): MyMetricFindQuery => {
    const text = query && query.query ? query.query : '{}';
    const obj = JSON.parse(text) as MyMetricFindQuery;
    return {
      ...obj,
      [name]: value ? value : undefined,
    };
  }

  const comboboxOptions: ComboboxOption[] = ['cinstance', 'dr', 'instance', 'vista'].map((value) => ({
    value: value,
  }));

  return (
    <Field label="Query elements">
    <InlineField label="" transparent={true}>
      <>
      <Field
        label="type"
        description={<table><tr><td>cinstance</td><td>: to list all instances of a vista with a given parent instance</td></tr><tr><td>dr</td><td>: to list all display rates</td></tr><tr><td>instance</td><td>: to list all instances of a vista</td></tr><tr><td>vista</td><td>: to list all vistas</td></tr></table>}
      >
        <Combobox
          onChange={handleChangeType}
          options={comboboxOptions}
          value={type || 'dr'}
          width={30}
        />
      </Field>
      <Field
        label="filter" hidden={!type || type === 'dr' || type === 'vista'}
        description={<table><tr><td>cinstance</td><td>: parent instance tag (basic tag), can be a variable e.g. $myvariable</td></tr><tr><td>instance</td><td>: vista name</td></tr></table>}
      >
        <Input
          type="text"
          placeholder="Enter filter"
          value={getFilter(localQuery) || ''}
          onChange={handleChangeFilter}
          width={30}
          hidden={!type || type === 'dr' || type === 'vista'}
        />
      </Field>
      <Field
        label="subfilter" hidden={!type || type === 'dr' || type === 'vista' || type === 'instance'}
        description={<table><tr><td>cinstance</td><td>: vista name</td></tr></table>}
      >
        <Input
          type="text"
          placeholder="Enter subfilter"
          value={getSubfilter(localQuery) || ''}
          onChange={handleChangeSubFilter}
          width={30}
          hidden={!type || type === 'dr' || type === 'vista' || type === 'instance'}
        />
      </Field>
      </>
    </InlineField>
      </Field>
  );
};
