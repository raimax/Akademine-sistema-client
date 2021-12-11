import { useEffect, useState } from "react";
import axiosConfig from "../axiosConfig";
import Modal from "../components/Modal";
import styles from "../styles/AdminComponent.module.scss";
import Dropdown from "../components/Dropdown";
import { HandleErrors } from "../Helpers/HandleErrors";

interface IStudent {
  id: number;
  firstName: string;
  lastName: string;
}

interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  roles: string[];
}

const Students = () => {
  const [errors, setErrors] = useState<string[] | null | undefined>(null);
  const [students, setStudents] = useState<IStudent[] | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newStudentFirstName, setNewStudentFirstName] = useState<string>("");
  const [newStudentLastName, setNewStudentLastName] = useState<string>("");

  const GetStudents = async () => {
    await axiosConfig
      .get("/Students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const DeleteStudent = async (id: number) => {
    await axiosConfig
      .delete("/Users/" + id)
      .then(() => {
        GetStudents();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const RenderStudents = () => {
    if (students !== null) {
      return students.map((student) => {
        return (
          <div key={student.id} className={styles.component_item}>
            <div>{student.firstName + " " + student.lastName}</div>
            <Dropdown>
              <div onClick={() => DeleteStudent(student.id)}>Delete</div>
            </Dropdown>
          </div>
        );
      });
    }
  };

  const AddStudent = async () => {
    const data: IUser = {
      firstName: newStudentFirstName,
      lastName: newStudentLastName,
      username: newStudentFirstName,
      password: newStudentLastName,
      roles: ["Student"],
    };

    await axiosConfig
      .post("/Auth/Register", data)
      .then(() => {
        setNewStudentFirstName("");
        setNewStudentLastName("");
        GetStudents();
        CloseModal();
      })
      .catch((err) => {
        setErrors(HandleErrors(err.response.data));
      });
  };

  const CloseModal = () => {
    setModalOpen(false);
  };

  const RenderModal = () => {
    if (modalOpen) {
      return (
        <Modal closeModal={CloseModal} title="Add New Student" errors={errors}>
          <input
            onChange={(e) => setNewStudentFirstName(e.currentTarget.value)}
            value={newStudentFirstName}
            type="text"
            placeholder="Enter student's first name"
          />
          <input
            onChange={(e) => setNewStudentLastName(e.currentTarget.value)}
            value={newStudentLastName}
            type="text"
            placeholder="Enter student's last name"
          />
          <div>
            <button onClick={AddStudent}>Add Student</button>
            <button onClick={CloseModal}>Cancel</button>
          </div>
        </Modal>
      );
    }
  };

  useEffect(() => {
    GetStudents();
  }, []);

  return (
    <div>
      {RenderModal()}
      <div>
        <button onClick={() => setModalOpen(true)}>Add New Student</button>
      </div>
      <div>{RenderStudents()}</div>
    </div>
  );
};

export default Students;
