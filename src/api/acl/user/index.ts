import request from '@/utils/request'
import type {
  UsersDataResponse,
  UserData,
  UserRoleDataResponse,
  AssignUserRole,
  DeleteBatchUser,
} from './type'

enum API {
  // 取得全部使用者的資料
  USERSDATA_URL = '/admin/acl/user/',
  // 新增用戶
  ADDUSER_URL = '/admin/acl/user/save',
  // 修改用戶
  UPDATEUSER_URL = '/admin/acl/user/update',
  // 取得目前使用者的角色
  CURRENTUSERROLE_URL = '/admin/acl/user/toAssign/',
  // 依據目前用戶確認分配角色
  ASSIGNUSERROLE_URL = '/admin/acl/user/doAssignRole',
  // 刪除指定使用者
  DELETEUSER_URL = '/admin/acl/user/remove/',
  // 批量刪除使用者
  DELETEBATCHUSERS_URL = '/admin/acl/user/batchRemove',
}

// 取得全部使用者的資料
export const reqUsersData = (
  page: number,
  limit: number,
  username: string = '',
) =>
  request.get<any, UsersDataResponse>(
    API.USERSDATA_URL + `${page}/${limit}?username=${username}`,
  )
// 新增用戶
export const reqAddUser = (data: UserData) =>
  request.post<any, any>(API.ADDUSER_URL, data)
// 修改用戶
export const reqUpdateUser = (data: UserData) =>
  request.put<any, any>(API.UPDATEUSER_URL, data)
// 取得目前使用者的角色
export const reqGetUserRoles = (adminId: number) =>
  request.get<any, UserRoleDataResponse>(API.CURRENTUSERROLE_URL + adminId)
// 依據目前用戶確認分配角色
export const reqAssignUserRoles = (data: AssignUserRole) =>
  request.post<any, any>(API.ASSIGNUSERROLE_URL, data)
// 刪除指定使用者
export const reqDeleteUser = (id: number) =>
  request.delete<any, any>(API.DELETEUSER_URL + id)
// 批量刪除使用者
export const reqDeleteBatchUsers = (data: DeleteBatchUser) =>
  request.delete<any, any>(API.DELETEBATCHUSERS_URL, data)
