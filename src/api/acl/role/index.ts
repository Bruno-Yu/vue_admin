import request from '@/utils/request'
import type { RolesDataResponse } from './type'

enum API {
  // 獲取所有角色資料
  ROLESDATA_URL = '/admin/acl/role/',
  // 新增角色
  ADDROLE_URL = '/admin/acl/role/save',
  // 編輯角色
  UPDATE_URL = '/admin/acl/role/update',
}
// 獲取全部角色資料
export const reqRolesData = (
  page: number,
  limit: number,
  rolename: string = '',
) =>
  request.get<any, RolesDataResponse>(
    // 獲取所有角色資料
    API.ROLESDATA_URL + `${page}/${limit}?rolename=${rolename}`,
  )
// 新增角色
export const reqAddRole = (roleName: string) =>
  request.post<any, any>(API.ADDROLE_URL, { roleName })
// 更新角色
export const reqUpdateRole = (roleName: string, id: number) =>
  request.post<any, any>(API.ADDROLE_URL, { roleName, id })
