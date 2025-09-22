/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Role } from './Role';
export type UserPublic = {
  id: number;
  email: string;
  name: string;
  surname: string;
  is_superuser: boolean;
  is_active: boolean;
  role?: (Role | null);
};

