import type { NextPage } from "next";
import { useEffect, useState } from "react";
import axiosConfig from "../../../axiosConfig";
import Header from "../../../components/Header";
import RestrictAccess from "../../../Helpers/RestrictAccess";
import styles from "../../../styles/Page.module.scss";
import GetCurrentUser from "../../../Helpers/GetCurrentUser";
import table from "../../../styles/Table.module.scss";
import Grade from "../../../components/Grade";

interface IUser {
  id: string;
  username: string;
  role: string;
}

interface ISubject {
  id: number;
  name: string;
}

interface IGrade {
  id: number;
  userId: string;
  subjectId: number;
  grade: number;
  subject: ISubject;
}

const Home: NextPage = () => {
  const [grades, setGrades] = useState<IGrade[] | null>(null);
  let currentUser: IUser;

  useEffect(() => {
    RestrictAccess("Student");
    currentUser = GetCurrentUser();
    GetGrades();
  }, []);

  const GetGrades = async () => {
    await axiosConfig
      .get("/StudentGrades/" + currentUser.id)
      .then((res) => {
        setGrades(res.data);
      })
      .catch((err) => console.log(err));
  };

  const RenderGrades = () => {
    if (grades?.length) {
      let renderedSubjectIds: number[] = [];

      return grades.map((grade) => {
        if (!renderedSubjectIds.includes(grade.subjectId)) {
          return (
            <tr key={grade.id}>
              <td>{grade.subject.name}</td>
              <td className={table.flex}>
                <div>
                  {grades
                    .filter((q) => q.subjectId == grade.subjectId)
                    .map((g) => {
                      renderedSubjectIds.push(grade.subjectId)
                      return <Grade key={g.id}>{g.grade}</Grade>;
                    })}
                </div>
              </td>
            </tr>
          );
        }
      });
    }

    return (
      <tr>
        <td>Nėra pažymių</td>
      </tr>
    );
  };

  return (
    <>
      <Header />
      <div className={styles.page}>
        <table className={table.component_table}>
          <tbody>
            <tr>
              <th>Dalykas</th>
              <th>Pažymiai</th>
            </tr>
            {RenderGrades()}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Home;
