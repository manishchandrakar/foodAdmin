"use client";

import React, { createContext, useContext } from "react";

/* ─────────────────────────── Types ─────────────────────────────── */

type ClassVal = string | string[] | undefined;

const cls = (v: ClassVal): string =>
  Array.isArray(v) ? v.filter(Boolean).join(" ") : v ?? "";

export interface TableClassNames {
  table?: ClassVal;
  thead?: ClassVal;
  th?: ClassVal;
  tbody?: ClassVal;
  td?: ClassVal;
  tr?: ClassVal;
  wrapper?: ClassVal;
}

export interface ColumnDef {
  uid: string;
  name: string;
}

interface TableCtxValue {
  columnKeys: string[];
  classNames?: TableClassNames;
}

/* Used only to type-check the TableHeader child inside Table */
interface TableHeaderInspectProps {
  columns: ColumnDef[];
}

const TableContext = createContext<TableCtxValue>({ columnKeys: [] });

/* ───────────────────────────── Table ───────────────────────────── */

interface TableProps {
  "aria-label"?: string;
  classNames?: TableClassNames;
  children: React.ReactNode;
  className?: string;
}

export const Table = ({
  "aria-label": ariaLabel,
  classNames,
  children,
  className,
}: TableProps) => {
  // Extract column uid list from the TableHeader child's `columns` prop
  let columnKeys: string[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<TableHeaderInspectProps>(child)) return;
    const cols = child.props.columns;
    if (Array.isArray(cols)) {
      columnKeys = cols.map((c) => c.uid);
    }
  });

  return (
    <TableContext.Provider value={{ columnKeys, classNames }}>
      <div
        className={`w-full overflow-x-auto ${cls(classNames?.wrapper)} ${className ?? ""}`.trim()}
      >
        <table
          aria-label={ariaLabel}
          className={`w-full border-collapse text-sm ${cls(classNames?.table)}`.trim()}
        >
          {children}
        </table>
      </div>
    </TableContext.Provider>
  );
};

/* ─────────────────────────── TableHeader ───────────────────────── */

interface TableHeaderProps<T extends ColumnDef> {
  columns: T[];
  children: (column: T) => React.ReactElement;
}

export function TableHeader<T extends ColumnDef>({
  columns,
  children,
}: TableHeaderProps<T>) {
  const { classNames } = useContext(TableContext);
  return (
    <thead className={cls(classNames?.thead)}>
      <tr>{columns.map((col) => children(col))}</tr>
    </thead>
  );
}

/* ─────────────────────────── TableColumn ───────────────────────── */

interface TableColumnProps {
  children: React.ReactNode;
  className?: string;
}

export const TableColumn = (props: TableColumnProps) => {
 const  { children, className } = props
  const { classNames } = useContext(TableContext);
  return (
    <th className={`${cls(classNames?.th)} ${className ?? ""}`.trim()}>
      {children}
    </th>
  );
};

/* ──────────────────────────── TableBody ────────────────────────── */

interface TableBodyProps<T> {
  items: T[];
  children: (item: T) => React.ReactElement;
  emptyContent?: React.ReactNode;
}

export function TableBody<T>(props: TableBodyProps<T>) {
  const { items, children, emptyContent } = props
  const { classNames, columnKeys } = useContext(TableContext);
  return (
    <tbody className={cls(classNames?.tbody)}>
      {items.length === 0 ? (
        <tr>
          <td
            colSpan={Math.max(columnKeys.length, 1)}
            className="py-10 text-center text-sm text-gray-400"
          >
            {emptyContent ?? "No data"}
          </td>
        </tr>
      ) : (
        items.map((item) => children(item))
      )}
    </tbody>
  );
}

/* ──────────────────────────── TableRow ─────────────────────────── */

interface TableRowProps {
  children: (columnKey: string) => React.ReactElement;
  className?: string;
}

export const TableRow = ({ children, className }: TableRowProps) => {
  const { columnKeys, classNames } = useContext(TableContext);
  return (
    <tr className={`${cls(classNames?.tr)} ${className ?? ""}`.trim()}>
      {columnKeys.map((key) =>
        React.cloneElement(children(key), { key })
      )}
    </tr>
  );
};

/* ──────────────────────────── TableCell ────────────────────────── */

interface TableCellProps {
  children?: React.ReactNode;
  className?: string;
}

export const TableCell = ({ children, className }: TableCellProps) => {
  const { classNames } = useContext(TableContext);
  return (
    <td className={`${cls(classNames?.td)} ${className ?? ""}`.trim()}>
      {children}
    </td>
  );
};
