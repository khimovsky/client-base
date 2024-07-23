import { LoadingStatus } from "../../../../core/models/loading-status.model";
import { User, UsersError } from "../../data-access/models/users-data.models";

export type UsersListVM = {
  users: User[],
  status: LoadingStatus,
  error: UsersError | null,
}
