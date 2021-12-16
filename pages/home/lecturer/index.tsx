import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import RestrictAccess from "../../../Helpers/RestrictAccess";
import styles from "../../../styles/Page.module.scss";
import table from "../../../styles/Table.module.scss";
import GetCurrentUser from "../../../Helpers/GetCurrentUser";
import axiosConfig from "../../../axiosConfig";
import Modal from "../../../components/Modal";
import Grade from "../../../components/Grade";
import Dropdown from "../../../components/Dropdown";

interface IEditGradeData {
  id?: number
  userId?: string | null;
  subjectId?: number;
  grade: number;
}

interface IAddGradeData {
  userId?: string | null;
  subjectId?: number;
  grade: number;
}

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
}

interface ILecturerSubject {
  subject?: ISubject;
}

interface ISubject {
  id?: number;
  name?: string;
}

interface ILecturer {
  id: string;
  firstName: string;
  lastName: string;
  lecturerSubject?: ILecturerSubject;
}

interface IGrade {
  id: number;
  userId: string;
  subjectId: number;
  grade: number;
  date: string;
  subject: ISubject;
  user: IUser;
}

const Home: NextPage = () => {
  const [errors, setErrors] = useState<string[] | null | undefined>(null);
  const [grades, setGrades] = useState<IGrade[] | null>(null);
  const [lecturer, setLecturer] = useState<ILecturer | null>(null);
  const [students, setStudents] = useState<IUser[] | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<IGrade | null>(null);
  const [addGradeModalOpen, setAddGradeModalOpen] = useState<boolean>(false);
  const [editGradeModalOpen, setEditGradeModalOpen] = useState<boolean>(false);
  const [grade, setGrade] = useState<string>("");
  let currentUser: IUser;

  const studentSelection = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    RestrictAccess("Lecturer");
    currentUser = GetCurrentUser();
    GetLecturer(currentUser.id);
    GetStudents();
  }, []);

  useEffect(() => {
    if (lecturer?.lecturerSubject?.subject?.id) {
      GetGrades(lecturer.lecturerSubject.subject.id);
    }
  }, [lecturer]);

  const GetStudents = async () => {
    await axiosConfig
      .get("/Students")
      .then((res) => {
        setStudents(res.data);
      })
      .catch((err) => console.log(err));
  };

  const GetLecturer = async (lecturerId: string) => {
    await axiosConfig
      .get("/Lecturers/" + lecturerId)
      .then((res) => {
        setLecturer(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const GetGrades = async (subjectId: number | undefined) => {
    if (subjectId) {
      await axiosConfig
        .get("/StudentGrades/" + subjectId)
        .then((res) => {
          setGrades(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  const RenderGrades = () => {
    if (grades?.length) {
      return grades.map((grade) => {
        return (
          <tr key={grade.id}>
            <td>{grade.user.firstName}</td>
            <td>{grade.user.lastName}</td>
            <td>{grade.subject.name}</td>
            <td>
              <Grade>{grade.grade}</Grade>
            </td>
            <td>{grade.date.slice(0, 16).replace("T", " ")}</td>
            <td>
              <Dropdown>
                <div onClick={() => DeleteGrade(grade.id)}>Pašalinti</div>
                <div
                  onClick={() => {
                    setSelectedGrade(grade);
                    setEditGradeModalOpen(true);
                  }}
                >
                  Taisyti pažymį
                </div>
              </Dropdown>
            </td>
          </tr>
        );
      });
    }

    return (
      <tr>
        <td>Nėra pažymių</td>
      </tr>
    );
  };

  const DeleteGrade = async (gradeId: number) => {
    if (gradeId) {
      await axiosConfig
        .delete("/StudentGrades/" + gradeId)
        .then(() => {
          GetGrades(lecturer?.lecturerSubject?.subject?.id);
        })
        .catch((err) => console.log(err));
    }
  };

  const CloseModal = () => {
    setAddGradeModalOpen(false);
    setEditGradeModalOpen(false);
  };

  const RenderAddGradeModal = () => {
    if (addGradeModalOpen) {
      return (
        <Modal
          closeModal={CloseModal}
          title="Įrašyti pažymį studentui"
          errors={errors}
        >
          <span>Studentas</span>
          <select ref={studentSelection}>{RenderStudentOptions()}</select>
          <span>Pažymys</span>
          <input
            value={grade}
            onChange={(e) => setGrade(e.currentTarget.value)}
            type="number"
            placeholder="Įveskite pažymį"
          ></input>
          <div>
            <button onClick={AddGrades}>Įrašyti pažymį</button>
            <button onClick={CloseModal}>Atšaukti</button>
          </div>
        </Modal>
      );
    }
  };

  const RenderStudentOptions = (): React.ReactNode => {
    if (students?.length) {
      return students.map((student) => {
        return (
          <option key={student.id} data-student-id={student.id}>
            {student.firstName + " " + student.lastName}
          </option>
        );
      });
    }
  };

  const AddGrades = async () => {
    if (lecturer?.lecturerSubject?.subject?.id) {
      const data: IAddGradeData = {
        userId:
          studentSelection.current?.options[
            studentSelection.current.selectedIndex
          ].getAttribute("data-student-id"),
        subjectId: lecturer?.lecturerSubject?.subject?.id,
        grade: parseInt(grade),
      };

      await axiosConfig
        .post("/StudentGrades", data)
        .then(() => {
          setGrade("");
          CloseModal();
          GetGrades(lecturer?.lecturerSubject?.subject?.id);
        })
        .catch((err) => console.log(err));
    }
  };

  const RenderEditGradeModal = () => {
    if (editGradeModalOpen) {
      return (
        <Modal
          closeModal={CloseModal}
          title="Taisyti pažymį studentui"
          errors={errors}
        >
          <span>Studentas</span>
          <select
            disabled
            defaultValue={
              selectedGrade?.user.firstName + " " + selectedGrade?.user.lastName
            }
            ref={studentSelection}
          >
            {RenderStudentOptions()}
          </select>
          <span>Pažymys</span>
          <input
            value={grade}
            onChange={(e) => setGrade(e.currentTarget.value)}
            type="number"
            placeholder="Įveskite pažymį"
          ></input>
          <div>
            <button onClick={EditGrade}>Taisyti pažymį</button>
            <button onClick={CloseModal}>Atšaukti</button>
          </div>
        </Modal>
      );
    }
  };

  const EditGrade = async () => {
    const data: IEditGradeData = {
      id: selectedGrade?.id,
      userId:
        studentSelection.current?.options[
          studentSelection.current.selectedIndex
        ].getAttribute("data-student-id"),
      subjectId: lecturer?.lecturerSubject?.subject?.id,
      grade: parseInt(grade),
    };

    await axiosConfig
      .put("/StudentGrades", data)
      .then(() => {
        setGrade("");
        CloseModal();
        GetGrades(lecturer?.lecturerSubject?.subject?.id);
      })
      .catch((err) => console.log(err.response));
  };

  return (
    <>
      <Header />
      {RenderAddGradeModal()}
      {RenderEditGradeModal()}
      <div className={`${styles.page} ${styles.flex_column}`}>
        <div>
          <button onClick={() => setAddGradeModalOpen(true)}>
            Įrašyti pažymį
          </button>
        </div>
        <table className={table.component_table}>
          <tbody>
            <tr>
              <th>Vardas</th>
              <th>Pavardė</th>
              <th>Dalykas</th>
              <th>Pažymys</th>
              <th>Data</th>
              <th>Pasirinkimai</th>
            </tr>
            {RenderGrades()}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Home;
