import type { NextPage } from "next";
import axiosConfig from "../axiosConfig";
import { FormEvent, useEffect, useState } from "react";
import router from "next/router";
import Cookies from "js-cookie";
import { AxiosResponse } from "axios";
import { ClearStorage } from "../Helpers/ClearStorage";

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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Index;
