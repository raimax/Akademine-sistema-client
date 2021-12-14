import { useEffect, useState, useRef } from "react";
import axiosConfig from "../axiosConfig";
import Modal from "../components/Modal";
import styles from "../styles/AdminComponent.module.scss";
import Dropdown from "../components/Dropdown";
import { HandleErrors } from "../Helpers/HandleErrors";

interface IAssignSubjectData {
  id: string;
  subjectId: number;
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
  lecturerSubject: ILecturerSubject;
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
  const [subjects, setSubjects] = useState<ISubject[] | null>(null);
  const [addLecturerModalOpen, setaddLecturerModalOpen] =
    useState<boolean>(false);
  const [assignSubjectModalOpen, setAssignSubjectModalOpen] =
    useState<boolean>(false);
  const [newLecturerFirstName, setNewLecturerFirstName] = useState<string>("");
  const [newLecturerLastName, setNewLecturerLastName] = useState<string>("");
  const [selectedLecturer, setSelectedLecturer] = useState<ILecturer | null>(
    null
  );

  const subjectSelection = useRef<HTMLSelectElement>(null);

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

  const DeleteLecturer = async (id: string) => {
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
    if (lecturers?.length) {
      return lecturers.map((lecturer) => {
        return (
          <tr key={lecturer.id}>
            <td>{lecturer.firstName}</td>
            <td>{lecturer.lastName}</td>
            <td key={lecturer.id}>
              {lecturer.lecturerSubject?.subject?.name || "< nepriskirta >"}
            </td>
            <td>
              <Dropdown>
                <div onClick={() => DeleteLecturer(lecturer.id)}>Pašalinti</div>
                <div
                  onClick={() => {
                    setSelectedLecturer(lecturer);
                    setAssignSubjectModalOpen(true);
                  }}
                >
                  Priskirti dalyką
                </div>
              </Dropdown>
            </td>
          </tr>
        );
      });
    }

    return <tr><td>Nėra dėstytojų</td></tr>
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
        setErrors(null);
        CloseModal();
      })
      .catch((err) => {
        setErrors(HandleErrors(err.response.data));
      });
  };

  const CloseModal = () => {
    setaddLecturerModalOpen(false);
    setAssignSubjectModalOpen(false);
  };

  const RenderAddLecturerModal = () => {
    if (addLecturerModalOpen) {
      return (
        <Modal closeModal={CloseModal} title="Pridėti naują dėstytoją" errors={errors}>
          <input
            onChange={(e) => setNewLecturerFirstName(e.currentTarget.value)}
            value={newLecturerFirstName}
            type="text"
            placeholder="Įveskite dėstytojo vardą"
          />
          <input
            onChange={(e) => setNewLecturerLastName(e.currentTarget.value)}
            value={newLecturerLastName}
            type="text"
            placeholder="Įveskite dėstytojo pavardę"
          />
          <div>
            <button onClick={AddLecturer}>Pridėti dėstytoją</button>
            <button onClick={CloseModal}>Atšaukti</button>
          </div>
        </Modal>
      );
    }
  };

  const RenderSubjectOptions = (): React.ReactNode => {
    if (subjects) {
      return subjects.map((subject) => {
        return (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        );
      });
    }
    return <option value={undefined}>Nėra dalykų</option>;
  };

  const RenderAssignSubjectModal = () => {
    if (assignSubjectModalOpen) {
      return (
        <Modal
          closeModal={CloseModal}
          title="Priskirti dalyką dėstytojui"
          errors={errors}
        >
          <span>
            {selectedLecturer?.firstName + " " + selectedLecturer?.lastName}
          </span>
          <select ref={subjectSelection}>{RenderSubjectOptions()}</select>
          <div>
            <button onClick={AssignSubject}>Priskirti dalyką</button>
            <button onClick={CloseModal}>Atšaukti</button>
          </div>
        </Modal>
      );
    }
  };

  const AssignSubject = async () => {
    if (selectedLecturer && subjectSelection.current?.value) {
      const data: IAssignSubjectData = {
        id: selectedLecturer.id,
        subjectId: parseInt(subjectSelection.current.value),
      };

      await axiosConfig
        .post("/LecturerSubjects/assign-subject", data)
        .then(() => {
          setErrors(null);
          GetLecturers();
          CloseModal();
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    GetLecturers();
    GetSubjects();
  }, []);

  return (
    <div>
      {RenderAddLecturerModal()}
      {RenderAssignSubjectModal()}
      <div>
        <button onClick={() => setaddLecturerModalOpen(true)}>
          Pridėti dėstytoją
        </button>
      </div>
      <table className={styles.component_table}>
        <tbody>
          <tr>
            <th>Vardas</th>
            <th>Pavardė</th>
            <th>Dalykas</th>
            <th>Pasirinkimai</th>
          </tr>
          {RenderLecturers()}
        </tbody>
      </table>
    </div>
  );
};

export default Lecturers;
