export default function GetCurrentUser() {
	return JSON.parse(localStorage.getItem("currentUser") as string);
}