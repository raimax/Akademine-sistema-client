import router from "next/router";
import { ClearStorage } from "./ClearStorage";

export const Logout = (): void => {
  ClearStorage();
  router.push("/");
};
