import { useEffect, useState } from "react";
import axiosConfig from "../axiosConfig";
import Modal from "../components/Modal";
import styles from "../styles/AdminComponent.module.scss";
import Dropdown from "../components/Dropdown";
import { HandleErrors } from "../Helpers/HandleErrors";

interface ISubject {
  id: number;
  name: string;
}

const Subjects = () => {
  const [errors, setErrors] = useState<string[] | null | undefined>(null);
  const [subjects, setSubjects] = useState<ISubject[] | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newSubjectName, setNewSubjectName] = useState<string>("");

  const GetSubjects = async () => {
    await axiosConfig
      .get("/Subjects")
      .then((response) => {
        setSubjects(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const DeleteSubject = async (id: number) => {
    await axiosConfig
      .delete("/Subjects/" + id)
      .then(() => {
        GetSubjects();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const RenderSubjects = () => {
    if (subjects?.length) {
      return subjects.map((subject) => {
        return (
          <tr key={subject.id} className={styles.component_item}>
            <td>{subject.name}</td>
            <td>
              <Dropdown>
                <div onClick={() => DeleteSubject(subject.id)}>Delete</div>
              </Dropdown>
            </td>
          </tr>
        );
      });
    }

    return <tr><td>No subjects</td></tr>
  };

  const AddSubject = async () => {
    if (newSubjectName !== "") {
      await axiosConfig
        .post("/Subjects", { name: newSubjectName })
        .then(() => {
          setNewSubjectName("");
          GetSubjects();
          CloseModal();
        })
        .catch((err) => {
          setErrors(HandleErrors(err));
        });
    }
  };

  const CloseModal = () => {
    setModalOpen(false);
  };

  const RenderModal = () => {
    if (modalOpen) {
      return (
        <Modal closeModal={CloseModal} title="Add New Subject" errors={errors}>
          <div>
            <input
              onChange={(e) => setNewSubjectName(e.currentTarget.value)}
              value={newSubjectName}
              type="text"
              placeholder="Enter subject's name"
            ></input>
          </div>
          <div>
            <button onClick={AddSubject}>Add Subject</button>
            <button onClick={CloseModal}>Cancel</button>
          </div>
        </Modal>
      );
    }
  };

  useEffect(() => {
    GetSubjects();
  }, []);

  return (
    <div>
      {RenderModal()}
      <div>
        <button onClick={() => setModalOpen(true)}>Add New Subject</button>
      </div>
      <table className={styles.component_table}>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Options</th>
          </tr>
          {RenderSubjects()}
        </tbody>
      </table>
    </div>
  );
};

export default Subjects;
