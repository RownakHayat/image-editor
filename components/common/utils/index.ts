export const IndexSerial = (
    page: number,
    pageSize: number,
    index: number,
    orderBy?: string,
    total?: number
) => {
    let current_page = Number(page)
    let perPageSize = Number(pageSize)
    let row_index = Number(index) + 1
    let serial_num
    if (orderBy === "ASC") {
        serial_num =
            (total || 10) - (perPageSize * (current_page - 1) + (row_index - 1))
    } else {
        serial_num = perPageSize * (current_page - 1) + row_index
    }
    return serial_num < 10 ? "0" + serial_num : serial_num
}
