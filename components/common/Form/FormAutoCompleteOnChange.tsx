"use client"

import { Controller } from "react-hook-form";
import Select from "react-select";
const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: '14px',
    backgroundColor: state.isSelected ? '#d1e7dd' : '#ffffff',
    color: state.isSelected ? '#000000' : '#000000',
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    fontSize: '14px',
    color: 'black',
  }),
  placeholder: (provided: any, state: any) => ({
    ...provided,
    fontSize: '15px',
    color: '#545454',

  }),
  control: (provided: any, state: any) => ({
    ...provided,
    borderRadius: '4px',
    borderColor: state.isFocused ? '#0CB04D' : '#d1d5db',
    boxShadow: 'none',
    backgroundColor: state.isFocused ? 'white' : 'white',
    color: "black"
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: '4px',
    backgroundColor: '#ffffff',
  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: 0,
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: 'black',
    '&:hover': {
      color: 'black',
    }
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: 'black',
    '&:hover': {
      color: 'black',
    }
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: 'none',
  }),
};
export function FormAutoCompleteOnChange({
  name,
  singleListName,
  data,
  isDisabled,
  control, // Receive control as a prop
  onChange, // Custom onChange prop
  className,
  ...otherProps
}: any) {
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => {
          return (
            <div className="flex flex-col justify-between">
              {otherProps.label && (
                <div className="basis-1/2">
                  <label className="text-[#4B5563]">
                    {otherProps.label}
                    <span className="text-red-500 pl-1">
                      {otherProps?.remark && "*"}
                    </span>
                  </label>
                </div>
              )}

              <div className={`${otherProps.label && "basis-1/2"} relative w-full`}>
                <Select
                  {...otherProps}
                  className={`${className} ${otherProps.label && "mt-2"} w-[200px] border-[0px] rounded-md border-gray-500`}
                  isDisabled={isDisabled}
                  options={data?.map((item: any) => ({
                    value: item?.id?.toString(),
                    label: item[`${singleListName}_name`],
                  }))}
                  isClearable
                  value={
                    field?.value
                      ? data?.find((option: any) =>
                        field?.value === option?.id?.toString()
                      )
                        ? {
                          value: field?.value,
                          label: data.find((option: any) =>
                            field?.value === option?.id?.toString()
                          )[`${singleListName}_name`],
                        }
                        : null
                      : null
                  }
                  onChange={(item: any) => {
                    field.onChange(item?.value ?? null); // Trigger react-hook-form's onChange
                    if (onChange) {
                      onChange(item?.value); // Call custom onChange function if provided
                    }
                  }}
                  styles={customStyles}
                />
                {error && (
                  <p className="text-sm font-medium text-red-500 mt-2">
                    {error.message}
                  </p>
                )}
              </div>
            </div>
          );
        }}
      />
    </>
  );
}
