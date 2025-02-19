import { toast } from "react-hot-toast"

const useToast = () => {
  const ToastSuccess = (value?: any) => toast.success(value || "Success")
  const ToastError = (value?: any) => toast.error(value || "Error")

  return {
    ToastSuccess,
    ToastError,
  }
}

export default useToast
