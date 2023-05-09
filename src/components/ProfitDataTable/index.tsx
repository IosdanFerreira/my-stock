import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';

import styles from './styles.module.scss';

interface DataType {
  key: React.Key;
  client: string;
  description: string;
  value: Number;
  date: string;
}

interface ITableProps {
  data: Array<DataType>;
}

export function ProfitDataTable({data}: ITableProps) {

  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    function updateSize() {
      setHeight(window.innerHeight);
    }
    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Cliente',
      dataIndex: 'client',
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      render: (value: string) => {

        const formatedValue = parseFloat(value);

        if (formatedValue > 0) {
          return (
            <span className={styles.high__value}>
             R$ {formatedValue.toFixed(2).replace('.', ',')}
            </span>
          );
        }
      }
    },
    {
      title: 'Data',
      dataIndex: 'date',
    },
  ];

  return (
    <>
      <div className={styles.table__container}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: height > 900 ? 9 : 5 }}
          className={styles.table}
        />
      </div>
    </>
  );
}
