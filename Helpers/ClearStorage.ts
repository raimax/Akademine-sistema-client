import Cookies from "js-cookie";

export const ClearStorage = (): void => {
    Cookies.remove("jwt");
    localStorage.removeItem("currentUser");
  };