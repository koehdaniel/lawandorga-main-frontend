import { HasPermission } from "@/types/core";
import { JsonModel } from "@/types/shared";
import { RlcUser, RlcUserSmall } from "@/types/user";
import axios from "axios";

class AdminService {
  /*
  // Users
  */
  getUsers(): Promise<RlcUserSmall[]> {
    return axios.get("/rlc_users/").then((response) => response.data);
  }

  updateUser(user: JsonModel): Promise<RlcUser> {
    return axios
      .put<RlcUser>(`/rlc_users/${user.id}/update_information/`, user)
      .then((response) => response.data);
  }

  getUser(id: number | string): Promise<RlcUser> {
    return axios
      .get<RlcUser>(`rlc_users/${id}/`)
      .then((response) => response.data);
  }

  /*
  // Permission
  */
  getPermissions(): Promise<
    {
      id: number;
      name: string;
      description: string;
      recommended_for: string;
    }[]
  > {
    return axios.get("permissions/").then((response) => response.data);
  }

  /*
  // HasPermission
  */
  getUserPermissions(user: RlcUser): Promise<HasPermission[]> {
    return axios
      .get<HasPermission[]>(`has_permissions/?user=${user.user_id}`)
      .then((response) => response.data);
  }

  deleteHasPermission(data: JsonModel): Promise<void> {
    return axios.delete(`has_permissions/${data.id}/`).then();
  }
}

export default new AdminService();
