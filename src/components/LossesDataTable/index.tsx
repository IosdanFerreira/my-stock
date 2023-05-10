import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import styles from './styles.module.scss';

interface DataType {
  key: React.Key;
  client: string;
  description: string;
  value: Number;
  date: string;
  actions: React.ReactNode;
}

interface ITableProps {
  data: Array<DataType>;
}

export function LossesDataTable({data}: ITableProps) {

  // Define a quantidade de linhas da tabela baseado no altura da tela
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    function updateSize() {
      setHeight(window.innerHeight);
    }
    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Definição dos dados da tabela
  const tableData = data.map((item, index) => ({ ...item, key: index }));
  
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
            <span className={styles.low__value}>
             R$ - {formatedValue.toFixed(2).replace('.', ',')}
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
          dataSource={[...tableData].reverse()}
          pagination={{ pageSize: height > 900 ? 9 : 5 }}
          className={styles.table}
        />
      </div>
    </>
  );
}
