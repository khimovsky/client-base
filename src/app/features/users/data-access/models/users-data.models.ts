import { DeepReadonly } from "../../../../core/utils/deep-readonly";

export type User = DeepReadonly<{
  name: string,
  surname: string,
  email: string,
  phone: string,
}>;

export type UsersResponse = {
  users: User[];
};

export type UsersError = {
  status: number;
  [key: string]: unknown;
};
