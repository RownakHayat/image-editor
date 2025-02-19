import { FC } from "react"

import { Skeleton } from "@/components/ui/skeleton"

type IDataTable = {
  columns: number
  dataSource: number
}

const TableSkeleton: FC<IDataTable> = ({ dataSource, columns }) => {
  const rows = []

  for (let i = 0; i < dataSource; i++) {
    const cells = []

    for (let j = 0; j < columns; j++) {
      cells.push(
        <td key={j} className="p-3 text-gray-600">
          <Skeleton className="h-[20px] w-full rounded bg-gray-300 dark:bg-slate-700" />
        </td>
      )
    }

    rows.push(
      <tr
        key={i}
        className="border text-center even:bg-slate-100 dark:even:dark:bg-background"
      >
        {cells}
      </tr>
    )
  }

  return (
    <div className="overflow-auto">
      <table className="w-full bg-white dark:bg-background">
        <thead className="bg-[#D6DDFF] text-black dark:bg-background">
          <tr>
            {[...Array(columns)].map((_, i) => (
              <th key={i} className="p-3 text-gray-600">
                <Skeleton className="h-[20px] w-full rounded bg-gray-300 dark:bg-slate-700" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="rounded-xl">{rows}</tbody>
      </table>
    </div>
  )
}

export default TableSkeleton
