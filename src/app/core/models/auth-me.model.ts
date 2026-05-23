export interface AuthMe {
  objectId: string;
  upn: string;
  displayName?: string;
  departmentCode?: string;
  departmentName?: string;
  roles: string[];
  authEnabled: boolean;
}
