"use client";
import React, { useEffect, useState } from 'react';
import { useTable, Column, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { PoolListing } from '@/routers/types';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import Link from 'next/link';

const PoolListingsTable: React.FC = () => {
  const [poolListings, setPoolListings] = useState<PoolListing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [filterInput, setFilterInput] = useState<string>('');

  useEffect(() => {
    const fetchPoolListings = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/pool');
        if (!response.ok) {
          throw new Error('Failed to fetch pool listings');
        }
        const data = await response.json();
        setPoolListings(data);
        setError(undefined);
      } catch (error: any) {
        setError(error?.message || 'Failed to fetch pool listings');
      } finally {
        setLoading(false);
      }
    };

    fetchPoolListings();
  }, []);

  // Define table columns
  const columns: Column<PoolListing>[] = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Pool Title', accessor: 'pool_title' },
      { Header: 'Availability Date', accessor: 'availability_date' },
      { Header: 'Blockout Dates', accessor: 'blockout_dates' },
      { Header: 'Pool Address', accessor: 'pool_address' },
      { Header: 'City', accessor: 'city' },
      { Header: 'State', accessor: 'state' },
      { Header: 'Zip Code', accessor: 'zip_code' },
      { Header: 'Phone Number', accessor: 'phone_number' },
      { Header: 'Pool Width', accessor: 'pool_width' },
      { Header: 'Pool Length', accessor: 'pool_length' },
      { Header: 'Pool Depth', accessor: 'pool_depth' },
      {
        Header: 'Actions',
        id: 'actions', // Unique ID to avoid duplication
        Cell: ({ row }: { row: { original: PoolListing } }) => (
          <Link href={`/Dashboard/mylisting/pooldetails/${row.original.id}`} passHref>
            <div className="btn btn-xs btn-info">
              More Details
            </div>
          </Link>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    prepareRow,
    state: { pageIndex, pageSize, globalFilter },
    gotoPage,
    setGlobalFilter,
    pageOptions,
  } = useTable<PoolListing>(
    {
      columns,
      data: poolListings,
      initialState: { pageIndex: 0, pageSize: 5 } as any,
    },
    useGlobalFilter, // Hook for global filtering
    useSortBy,
    usePagination
  ) as any;

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || undefined;
    setGlobalFilter(value);
    setFilterInput(value || '');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container-fluid mt-4">
      <div className="card">
        <div className="card-header text-white" style={{ background: "#000" }}><h3>Pool Listings</h3></div>
        <div className="card-body">
          <div className="mb-3">
            <input
              value={filterInput}
              onChange={handleFilterChange}
              placeholder="Search Pool listings..."
              className="form-control"
            />
          </div>
          <div className="table-responsive">
            <table {...getTableProps()} className="table table-bordered">
              <thead>
                {headerGroups.map((headerGroup: { getHeaderGroupProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; headers: any[]; }, i: React.Key | null | undefined) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                    {headerGroup.headers.map((column, j) => (
                      <th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        key={j}
                      >
                        {column.render('Header')}
                        <span>
                          {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="bg-white divide-y divide-gray-200"
              >
                {page.map((row: { getRowProps: () => React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; id: React.Key | null | undefined; cells: any[]; }, i: any) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={row.id}> {/* Ensure key prop is unique for each row */}
                      {row.cells.map((cell, j) => (
                        <td
                          {...cell.getCellProps()}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          key={j}
                        >
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex-1 flex justify-between">
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaAngleDoubleLeft size={20} />
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaAngleDoubleRight size={20} />
              </button>
            </div>
          </div>

          <div className="mt-2 text-center">
            <span className="text-sm text-gray-700">
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <span className="ml-3">
              | Go to page:{' '}
              <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                className="border rounded w-20 px-2"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolListingsTable;
