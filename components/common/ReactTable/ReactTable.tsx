import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { FC, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import TableSkeleton from "../Skeleton/TableSkeleton";
import { useFormSetting } from "../hooks/useFormSetting";
import Pagination from "./pagination";


type IDataTable = {
    columns: ColumnDef<any>[]
    dataSource: any
    paginationOff?: boolean
    setSelectedRows?: any
    refVal?: any
    isLoading?: boolean
}

const ReactTable: FC<IDataTable> = ({
    dataSource,
    columns,
    paginationOff = true,
    setSelectedRows,
    refVal,
    isLoading,
}) => {
    const filteredColumns = columns.filter((column: any) => column?.id !== undefined);

    const { filterSearchText, setFilterSearchText } = useFormSetting()
    const [globalFilter] = useDebounce(filterSearchText, 1000)
    const { data, pagination } = dataSource || {}
    const [rowSelection, setRowSelection] = useState<any>({})

    useEffect(() => {
        let result: any = []
        dataSource?.data?.map((singleItem: any, index: number) => {
            const keys = Object.keys(rowSelection)
            keys?.map((keysItem: string) => {
                if (Number(keysItem) === index) {
                    result.push(singleItem)
                }
            })
        })
    }, [rowSelection, dataSource])

    const table = useReactTable({
        data: data || [].length === 0,
        columns: filteredColumns,
        state: {
            rowSelection,
        },
        onGlobalFilterChange: setFilterSearchText,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
        <div className="relative h-full">
            <div className="overflow-auto md:overflow-visible z-1 rounded h-full">
                {isLoading ? (
                    <TableSkeleton dataSource={20} columns={6} />
                ) : (
                    <table className="w-full bg-white dark:bg-background rounded-lg" ref={refVal}>
                        <thead className="bg-[rgba(12,176,77,0.1)]  text-[rgba(12,176,77,0.1)] ">
                            {table &&
                                table?.getHeaderGroups()?.map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header, idx) => (
                                            <th
                                                key={idx}
                                                colSpan={header.colSpan}
                                                className={`p-3 text-left w-fit font-[14px] text-gray-600 dark:text-gray-200 `}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        className={`flex text-left gap-2 items-center ${header.id === "status" && "justify-left"
                                                            } ${header.id === "menu_position" && "justify-center"
                                                            } ${header.id === "action" && "justify-left"}`}
                                                    >
                                                        <div>
                                                            <h3>{flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}</h3>
                                                        </div>
                                                    </div>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                        </thead>
                        <tbody className="rounded-xl border-[#D6DDFF] ">
                            {table?.getRowModel().rows.length === 0 ? (
                                <tr className="rounded">
                                    <th colSpan={table?.getHeaderGroups()[0]?.headers?.length}>
                                        <div className="h-[calc(100vh-40vh)] bg-slate-50">
                                            <div className="h-full w-full flex flex-col justify-center items-center">
                                                <p>No Data Found!</p>
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            ) : (
                                table?.getRowModel().rows?.map((row: any) => (
                                    <tr
                                        key={row.id}
                                        className={`border-b  ${row?.original?.status === 0 ? "bg-slate-100" : ""
                                            } dark:${row?.original?.status === 0 ? "bg-slate-700" : ""}`}
                                    >
                                        {row.getVisibleCells().map((cell: any) => (
                                            <td
                                                key={cell.id}
                                                className={`p-3 text-gray-600 break-words w-fit h-fit border-[#D6DDFF] border-b-[1px] border-r-[1px] dark:${row?.original?.status === 0
                                                    ? "text-slate"
                                                    : "text-white"
                                                    }`}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            {paginationOff && (
                <div className="">
                    <Pagination pagination={dataSource?.pagination} />
                </div>
            )}
        </div>


    )
}

{/* <TableSkeleton dataSource={20} columns={table?.getHeaderGroups().length} /> */ }

export default ReactTable
