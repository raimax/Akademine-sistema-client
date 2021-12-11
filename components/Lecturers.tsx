import { useEffect, useState } from "react";
import axiosConfig from "../axiosConfig";
import Modal from "../components/Modal";
import styles from "../styles/AdminComponent.module.scss";
import Dropdown from "../components/Dropdown";
import { HandleErrors } from "../Helpers/HandleErrors";

interface ILecturer {
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

const Lecturers = () => {
  const [errors, setErrors] = useState<string[] | null | undefined>(null);
  const [lecturers, setLecturers] = useState<ILecturer[] | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newLecturerFirstName, setNewLecturerFirstName] = useState<string>("");
  const [newLecturerLastName, setNewLecturerLastName] = useState<string>("");

  const GetLecturers = async () => {
    await axiosConfig
      .get("/Lecturers")
      .then((response) => {
        setLecturers(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const DeleteLecturer = async (id: number) => {
    await axiosConfig
      .delete("/Users/" + id)
      .then(() => {
        GetLecturers();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const RenderLecturers = () => {
    if (lecturers !== null) {
      return lecturers.map((lecturer) => {
        return (
          <div key={lecturer.id} className={styles.component_item}>
            <div>{lecturer.firstName + " " + lecturer.lastName}</div>
            <Dropdown>
              <div onClick={() => DeleteLecturer(lecturer.id)}>Delete</div>
              <div onClick={() => DeleteLecturer(lecturer.id)}>Assign Subject</div>
            </Dropdown>
          </div>
        );
      });
    }
  };

  const AddLecturer = async () => {
    const data: IUser = {
      firstName: newLecturerFirstName,
      lastName: newLecturerLastName,
      username: newLecturerFirstName,
      password: newLecturerLastName,
      roles: ["Lecturer"],
    };

    await axiosConfig
      .post("/Auth/Register", data)
      .then(() => {
        setNewLecturerFirstName("");
        setNewLecturerLastName("");
        GetLecturers();
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
        <Modal closeModal={CloseModal} title="Add New Lecturer" errors={errors}>
          <input
            onChange={(e) => setNewLecturerFirstName(e.currentTarget.value)}
            value={newLecturerFirstName}
            type="text"
            placeholder="Enter lecturer's first name"
          />
          <input
            onChange={(e) => setNewLecturerLastName(e.currentTarget.value)}
            value={newLecturerLastName}
            type="text"
            placeholder="Enter lecturer's last name"
          />
          <div>
            <button onClick={AddLecturer}>Add Lecturer</button>
            <button onClick={CloseModal}>Cancel</button>
          </div>
        </Modal>
      );
    }
  };

  useEffect(() => {
    GetLecturers();
  }, []);

  return (
    <div>
      {RenderModal()}
      <div>
        <button onClick={() => setModalOpen(true)}>Add New Lecturer</button>
      </div>
      <div>{RenderLecturers()}</div>
    </div>
  );
};

export default Lecturers;
