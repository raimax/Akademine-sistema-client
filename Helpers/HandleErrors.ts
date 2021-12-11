import { GetResponseErrors } from "../Helpers/GetResponseErrors";

export const HandleErrors = (responseErrors: any) => {
	return GetResponseErrors(responseErrors.errors || responseErrors)
}