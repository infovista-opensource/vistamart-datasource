import React, { useState } from 'react';
import {MyVariableQuery} from './types';
import {Field, TextArea, useStyles2} from '@grafana/ui';
import {GrafanaTheme2} from "@grafana/data";
import {css} from "@emotion/css";

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

function getStyles(theme: GrafanaTheme2) {
  return {
    textarea: css({
      whiteSpace: 'pre-wrap',
      minHeight: theme.spacing(4),
      height: 'auto',
      overflow: 'auto',
      padding: `${theme.spacing(0.75)} ${theme.spacing(1)}`,
      width: 'inherit',

      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    }),
  };
}

export const VariableQueryEditor = ({ query, onChange }: VariableQueryProps) => {
  const [localQuery, setState] = useState<MyVariableQuery>(toMyVariableQuery(query));

  const handleChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const updated: MyVariableQuery = {
      ...localQuery,
      query: event.currentTarget.value,
    };
    setState(updated);
    onChange(updated);
  };

  const styles = useStyles2(getStyles);

  return (
    <Field label="Object query">
      <TextArea
        rows={5}
        cols={52}
        type="text"
        aria-label="Object query"
        placeholder="Enter object query"
        value={localQuery.query || ''}
        onChange={handleChange}
        className={styles.textarea}
      />
    </Field>
  );
};
