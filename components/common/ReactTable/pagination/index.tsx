import {
  pageChangeNext,
  pageChangePrev,
  perPageChange,
} from "@/store/zustand/formSetting";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormSetting } from "../../hooks/useFormSetting";
import { DOTS, usePageHook } from "../../hooks/usePageHook";

type Props = {
  pagination: any;
};

const Pagination = ({ pagination }: Props) => {
  const { current_page, total, per_page, last_page } = pagination || {};

  let siblingCount = 1;
  let totalCount = total;
  let pageSize = per_page;
  let currentPage = current_page;

  const { paginationRange } = usePageHook({
    totalCount,
    pageSize,
    siblingCount,
    currentPage,
  });

  const { pageChange } = useFormSetting();
  const [pageRange, setPageRange] = useState(per_page?.toString());
  const paginationRanges = (e: any) => {
    setPageRange(e);
    perPageChange(e);
  };

  return (
    <div className="mt-8 flex flex-col md:flex-row items-center justify-between p-5 sm:p-2 bg-white w-full">
      <div className="flex gap-2 items-center">
        <div className="text-secondary">Showing</div>
        <Select value={pageRange} onValueChange={paginationRanges}>
          <SelectTrigger className="w-[130px] h-8 mt-0">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="500">500</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="text-secondary">
          of <span>{total}</span> Entries
        </div>
      </div>

      <div className="flex gap-4 items-center justify-center md:justify-end mt-4 md:mt-0">
        <div className="flex items-center rounded border-2 border-[#D1D5DB] bg-white dark:bg-background dark:border-slate-700">
          <button
            className="w-8 h-8 border-r-2 flex items-center justify-center"
            disabled={currentPage === 1}
            onClick={() => pageChangePrev(currentPage - 1)}
          >
            <ChevronLeft />
          </button>
          {paginationRange?.map((pageNumber: any, index: any) => {
            if (pageNumber === DOTS) {
              return (
                <button
                  className="h-8 w-8 border-r-2 flex items-center justify-center"
                  key={index}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                </button>
              );
            }
            return (
              <button
                key={index}
                className={`h-8 w-8 border-r-2 flex items-center justify-center ${pageNumber === currentPage ? "bg-[#D1D5DB] dark:bg-slate-700" : ""}`}
                onClick={() => pageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            className="w-8 h-8 flex items-center justify-center"
            onClick={() => pageChangeNext(currentPage + 1)}
            disabled={currentPage === last_page}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
