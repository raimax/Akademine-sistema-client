import type { NextPage } from "next";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import axiosConfig from "../../axiosConfig";
import { ClearStorage } from "../../Helpers/ClearStorage";
import styles from "../../styles/AuthPage.module.scss";

type ISubmit = {
  username: string;
  password: string;
  email: string;
  roles: string[];
};

const Register: NextPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    const data: ISubmit = {
      username: username,
      password: password,
      email: email,
      roles: ["Administrator"],
    };

    await axiosConfig
      .post("/Auth/register", data)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  useEffect(() => {
    ClearStorage();
  }, []);

  return (
    <div className={styles.auth_Page}>
      <h1>Academic system registration</h1>
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
        <button type="submit">Register</button>
        <Link href={"/"}>Login</Link>
      </form>
    </div>
  );
};

export default Register;
