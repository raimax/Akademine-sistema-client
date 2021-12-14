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
      <h1>Akademinės sistemos registracija</h1>
      <form onSubmit={(e) => submit(e)} className={styles.auth_form}>
        <label>Slapyvardis</label>
        <input
          onChange={(e) => setUsername(e.currentTarget.value)}
          value={username}
          type="text"
          placeholder="slapyvardis"
        />
        <label>Slaptažodis</label>
        <input
          onChange={(e) => setPassword(e.currentTarget.value)}
          value={password}
          type="password"
          placeholder="slaptažodis"
        />
        <button type="submit">Registruotis</button>
        <Link href={"/"}>Prisijungti</Link>
      </form>
    </div>
  );
};

export default Register;
