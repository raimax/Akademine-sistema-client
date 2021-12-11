import type { NextPage } from "next";
import axiosConfig from "../axiosConfig";
import { FormEvent, useEffect, useState } from "react";
import router from "next/router";
import Cookies from "js-cookie";
import { AxiosResponse } from "axios";
import { ClearStorage } from "../Helpers/ClearStorage";
import styles from "../styles/AuthPage.module.scss";
import Link from "next/link";

type ISubmit = {
  username: string;
  password: string;
};

const Index: NextPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    const data: ISubmit = {
      username: username,
      password: password,
    };

    await axiosConfig
      .post("/Auth/login", data)
      .then((response) => {
        SaveUserDataToStorage(response);

        switch (response.data.user.role) {
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
            break;
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const SaveUserDataToStorage = (response: AxiosResponse): void => {
    Cookies.set("jwt", response.data.token, { expires: 7 });
    localStorage.setItem("currentUser", JSON.stringify(response.data.user));
  };

  useEffect(() => {
    ClearStorage();
  }, []);

  return (
    <div className={styles.auth_Page}>
      <h1>Academic system login</h1>
      <form onSubmit={(e) => submit(e)} className={styles.auth_form}>
        <label>Username</label>
        <input
          onChange={(e) => setUsername(e.currentTarget.value)}
          value={username}
          type="text"
          placeholder="username"
        />
        <label>Password</label>
        <input
          onChange={(e) => setPassword(e.currentTarget.value)}
          value={password}
          type="password"
          placeholder="password"
        />
        <button type="submit">Login</button>
        <Link href={"/register"}>Register</Link>
      </form>
    </div>
  );
};

export default Index;
