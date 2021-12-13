import router from "next/router";

export default function RestrictAccess(roleName: string) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") as string);

  if (currentUser.role !== roleName) {
    switch (currentUser.role) {
      case "Student":
        router.push("/home/student");
        break;
      case "Lecturer":
        router.push("/home/lecturer");
        break;
      case "Administrator":
        router.push("/home/admin");
        break;
      default:
		router.push("/");
        break;
    }
  }
}
