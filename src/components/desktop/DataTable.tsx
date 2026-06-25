import { ReactNode } from 'react';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
};

export function DataTable<T extends { id: string }>({ columns, data, empty = 'No records found.' }: { columns: Array<Column<T>>; data: T[]; empty?: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
      <Table>
        <THead>
          <TR>
            {columns.map((column) => <TH key={column.key}>{column.header}</TH>)}
          </TR>
        </THead>
        <TBody>
          {data.length === 0 ? (
            <TR><TD colSpan={columns.length} className="py-8 text-center text-slate-500">{empty}</TD></TR>
          ) : (
            data.map((row) => (
              <TR key={row.id}>{columns.map((column) => <TD key={column.key}>{column.render(row)}</TD>)}</TR>
            ))
          )}
        </TBody>
      </Table>
    </div>
  );
}
