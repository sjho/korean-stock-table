import { Table, Thead, Tbody, Tr, Th, Td, chakra } from "@chakra-ui/react"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy, useFilters } from "react-table"
import React from 'react';

function CompanyTable({columns, data, slice}) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setFilter,
    } = useTable({columns, data}, useFilters, useSortBy)
    return (
        <Table {...getTableProps()} size="sm">
            <Thead>
                {headerGroups.map((headerGroup) => (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                    <Th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        isNumeric={column.isNumeric}
                        borderColor="gray.500"
                        borderBottom="2px"
                        backgroundColor="gray.50"
                    >
                        {column.render("Header")}
                        <chakra.span pl="4">
                        {column.isSorted ? (
                            column.isSortedDesc ? (
                            <TriangleDownIcon aria-label="sorted descending" />
                            ) : (
                            <TriangleUpIcon aria-label="sorted ascending" />
                            )
                        ) : null}
                        </chakra.span>
                    </Th>
                    ))}
                </Tr>
                ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
                {rows.slice((slice)*10, (slice+1)*10).map((row) => {
                prepareRow(row)
                return (
                    <Tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                        <Td
                            {...cell.getCellProps()}
                            isNumeric={cell.column.isNumeric}
                            borderColor="gray.500"
                            backgroundColor="orange.50"
                        >
                        {
                            cell.render("Cell")
                        }
                        </Td>
                    ))}
                    </Tr>
                )
                })}
            </Tbody>
        </Table>
    )
}

export default CompanyTable;