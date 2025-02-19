import { useCallback, useState } from "react";
import { useDebounce } from "use-debounce";
import useToast from "../hooks/useToast";

export const imageToBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file[0]);
  });
};

export const listArrayModify = (data: any, listName: string) => {
  return data?.length > 0
    ? data?.map((item: any) => {
        const newItem = {
          id: item?.id?.toString(),
          [`${listName}_name`]:
            item?.[`${listName}_name`] ||
            item?.name ||
            item?.organization_name ||
            item?.appointment_name,
        };
        return newItem;
      })
    : [];
};

export const listArrayDaynamicModify = (
  data: any,
  listName: string,
  fieldName: string
) => {
  return data?.length > 0
    ? data?.map((item: any) => {
        const newItem = {
          id: item?.id?.toString(),
          [`${listName}_name`]: item?.[`${listName}_name`] || item[fieldName],
        };
        return newItem;
      })
    : [];
};

export const listArrayDaynamicModifyCustomId = (
  data: any,
  listName: string,
  fieldName: string,
  idField: string
) => {
  return data?.length > 0
    ? data?.map((item: any) => {
        const newItem = {
          id: item[idField].toString(),
          [`${listName}_name`]: item?.[`${listName}_name`] || item[fieldName],
        };
        return newItem;
      })
    : [];
};

export const requisitionArrayModify = (data: any, listName: string) => {
  return data?.length > 0
    ? data?.map((item: any) => {
        const newItem = {
          id: item?.id?.toString(),
          [`${listName}_name`]:
            item?.[`${listName}_name`] ||
            item?.name ||
            item?.requisition_status_name ||
            item?.appointment_name,
        };
        return newItem;
      })
    : [];
};

export const listArrayForWorkSection = (data: any, listName: string) => {
  return data?.length > 0
    ? data?.map((item: any) => {
        const newItem = {
          id: item?.id?.toString(),
          [`${listName}_name`]:
            item?.[`${listName}_name`] || item?.name || item?.work_section_name,
        };
        return newItem;
      })
    : [];
};

export const listArrayForPriorityName = (data: any, listName: string) => {
  return data?.length > 0
    ? data?.map((item: any) => {
        const newItem = {
          id: item?.id?.toString(),
          [`${listName}_name`]:
            item?.[`${listName}_name`] || item?.name || item?.priority_name,
        };
        return newItem;
      })
    : [];
};

export const listArrayMoifyForAbsent = (data: any, listName: string) => {
  return data?.length > 0
    ? data?.map((item: any) => {
        const newItem = {
          id: item?.id?.toString(),
          [`${listName}_name`]: item?.reason,
        };
        return newItem;
      })
    : [];
};

export const durationDate = (form_date: string, to_date: string) => {
  const start = new Date(form_date);
  const end = new Date(to_date);

  const yearDiff = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();
  const dayDiff = end.getDate() - start.getDate();

  let years = yearDiff;
  let months = monthDiff;
  let days = dayDiff;

  if (dayDiff < 0) {
    months--;
    const prevMonthLastDay = new Date(
      end.getFullYear(),
      end.getMonth(),
      0
    ).getDate();
    days = prevMonthLastDay - start.getDate() + end.getDate();
  }

  if (monthDiff < 0) {
    years--;
    months = 12 - start.getMonth() + end.getMonth() - 1;
  }

  return `${years}y ${months}m ${days}d`;
};

export const listArrayModifyAdvanceSearch = (
  data: any,
  displayName: string
) => {
  return data?.length > 0
    ? data?.map((item: any) => {
        const newItem = {
          id: item?.id?.toString(),
          name: item[displayName],
        };
        return newItem;
      })
    : [];
};

export const InActiveValue = (props: any) => {
  const { ToastSuccess, ToastError } = useToast();
  const { updateAPI, data } = props;
  updateAPI({
    ...data,
  })
    .then((res: any) => {
      if (res?.error?.data?.code === 400) {
        ToastError(res?.error?.data?.errors?.[0]?.message?.[0]);
      } else if (res?.data?.code === 200) {
        ToastSuccess("Status has been changed");
      }
    })
    .catch((err: any) => {});
};

export const useDebouncedChange = <T>(
  initialValue: T,
  delay: number = 300
): [T, (newValue: T) => any] => {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedCallback] = useDebounce((newValue: any) => {
    setValue(newValue);
  }, delay);

  const handleChange = useCallback(
    (newValue: T) => {
      debouncedCallback(newValue);
    },
    [debouncedCallback]
  );

  return [value, handleChange] as const;
};
