import { useEffect, useState } from "react";
import { Logout } from "../Helpers/Logout";
import styles from "../styles/Header.module.scss";

interface IUser {
  id: string;
  username: string;
  role: string;
}

const Header = () => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user !== null) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  return (
    <header className={styles.header}>
      <div>Sveiki, {currentUser?.username}</div>
      <button onClick={Logout}>Atsijungti</button>
    </header>
  );
};

export default Header;
