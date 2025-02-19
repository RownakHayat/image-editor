import formSettingStore, {
  closeFormToggle,
  editData,
  formToggle,
  orderByChange,
  pageChange,
  setFilterSearchText,
  setSearchFieldName,
  sortByChange
} from "@/store/zustand/formSetting"

export const useFormSetting = () => {
  const { params, showData, editMode, toggle, filterSearchText,searchField } = formSettingStore(
    (state: any) => state
  )
  
  return {
    toggle,
    formToggle,
    pageChange,
    params,
    editData,
    showData,
    editMode,
    closeFormToggle,
    filterSearchText,
    searchField,
    setFilterSearchText,
    sortByChange,
    setSearchFieldName,
    orderByChange
  }
}
