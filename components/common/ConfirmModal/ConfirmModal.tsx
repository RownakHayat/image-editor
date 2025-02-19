import Swal from "sweetalert2";

export const confirm = (api: any, id: any, others?: any, refetch?: any) => {
    Swal.fire({
        title: others?.title || "Are you sure?",
        text: others?.text || "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: others?.button_text || "Confirm",
    }).then(async (result: any) => {
        if (result.isConfirmed) {
            const response = await api(id)
            if (response?.data?.code === 200) {
                if (refetch) {
                    refetch()
                }
                Swal.fire({
                    title: "Success",
                    text: "Data Updated Successfully!",
                    icon: "success",
                })
            } else {
                Swal.fire({
                    title: "Error",
                    text: response?.error?.data?.errors[0],
                    icon: "error",
                })
            }
        }
    })
}

export const confirmWithData = (api: any, data: any, others?: any, refetch?: any) => {
    Swal.fire({
        text: others?.text || "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:others?.confirm_color || "#3085d6",
        cancelButtonColor: others?.cancel_color || "#d33",
        confirmButtonText: others?.confirm_text || "Confirm",
        cancelButtonText: others?.cancel_text || "Cancel",
    }).then(async (result: any) => {
        if (result.isConfirmed) {
            const response = await api(data)
            if (response?.data?.code === 200) {
                if (refetch) {
                    refetch()
                }
                Swal.fire({
                    title: "Success",
                    text: "Data Updated Successfully!",
                    icon: "success",
                })
            } else {
                Swal.fire({
                    title: "Error",
                    text: response?.error?.data?.errors[0],
                    icon: "error",
                })
            }
        }
    })
}