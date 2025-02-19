
import { useUserRolePermissionListQuery } from "@/store/features/SecurityManagement/CreateRole";
import { usePathname } from "next/navigation";


const CheckPermission1 = ({ children, subMod, permission }: any) => {
    const { data: rolePermissionList } = useUserRolePermissionListQuery();
    const router = usePathname()
    let moduleName = ''
    const path = router.split('/')[2]
    if (path == 'configuration') {
        moduleName = 'configuration'
    }
    if (path == 'event-management') {
        moduleName = 'event_management'
    }
    if (path == 'user-management') {
        moduleName = 'user_management'
    }
    if (path == 'payment-management') {
        moduleName = 'payment_management'
    }
    if (path == 'survey-management') {
        moduleName = 'survey_management'
    }
    if (path == 'portal-management') {
        moduleName = 'portal_management'
    }
    if (path == 'feedback-management') {
        moduleName = 'feedback_management'
    }
    const hasPermission = !!rolePermissionList?.data[0]?.module
    .find((module: any) => module?.name === moduleName)
    ?.sub_module?.find((submodule: any) => submodule?.name === subMod)
    ?.permission?.some((per: any) => per.name === permission);

// Render children with hasPermission as a function or element
return typeof children === 'function'
    ? children({ hasPermission })
    : hasPermission ? children : null;
}

export default CheckPermission1;