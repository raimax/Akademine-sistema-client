import type { NextPage } from "next";
import { FormEvent, useEffect, useState } from "react";
import axiosConfig from "../../axiosConfig";
import { ClearStorage } from "../../Helpers/ClearStorage";

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
    <div>
      <form onSubmit={(e) => submit(e)}>
        <input
          onChange={(e) => setUsername(e.currentTarget.value)}
          value={username}
          type="text"
          placeholder="username"
        />
        <input
          onChange={(e) => setPassword(e.currentTarget.value)}
          value={password}
          type="password"
          placeholder="password"
        />
        <input
          onChange={(e) => setEmail(e.currentTarget.value)}
          value={email}
          type="email"
          placeholder="email"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
