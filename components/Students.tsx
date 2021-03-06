import { useEffect, useState, useRef } from "react";
import axiosConfig from "../axiosConfig";
import Modal from "../components/Modal";
import styles from "../styles/Table.module.scss";
import Dropdown from "../components/Dropdown";
import { HandleErrors } from "../Helpers/HandleErrors";

interface IAssignGroupData {
  userId: string;
  groupId: number;
}

interface IStudent {
  id: string;
  firstName: string;
  lastName: string;
  studentGroup: IStudentGroup;
}

interface IStudentGroup {
  group?: IGroup;
}

interface IGroup {
  id?: number;
  name?: string;
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
  const [groups, setGroups] = useState<IGroup[] | null>(null);
  const [addStudentModalOpen, setAddStudentModalOpen] =
    useState<boolean>(false);
  const [assignGroupModalOpen, setAssignGroupModalOpen] =
    useState<boolean>(false);
  const [newStudentFirstName, setNewStudentFirstName] = useState<string>("");
  const [newStudentLastName, setNewStudentLastName] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);

  const groupSelection = useRef<HTMLSelectElement>(null);

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

  const GetGroups = async () => {
    await axiosConfig
      .get("/Groups")
      .then((response) => {
        setGroups(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const DeleteStudent = async (id: string) => {
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
    if (students?.length) {
      return students.map((student) => {
        return (
          <tr key={student.id} className={styles.component_item}>
            <td>{student.firstName}</td>
            <td>{student.lastName}</td>
            <td key={student.id}>
              {student.studentGroup?.group?.name || "< nepriskirta >"}
            </td>
            <td>
              <Dropdown>
                <div onClick={() => DeleteStudent(student.id)}>Pa??alinti</div>
                <div
                  onClick={() => {
                    setSelectedStudent(student);
                    setAssignGroupModalOpen(true);
                  }}
                >
                  Priskirti grup??
                </div>
              </Dropdown>
            </td>
          </tr>
        );
      });
    }

    return (
      <tr>
        <td>N??ra student??</td>
      </tr>
    );
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
    setAddStudentModalOpen(false);
    setAssignGroupModalOpen(false);
  };

  const RenderAddStudentModal = () => {
    if (addStudentModalOpen) {
      return (
        <Modal
          closeModal={CloseModal}
          title="Prid??ti nauj?? student??"
          errors={errors}
        >
          <input
            onChange={(e) => setNewStudentFirstName(e.currentTarget.value)}
            value={newStudentFirstName}
            type="text"
            placeholder="??veskite studento vard??"
          />
          <input
            onChange={(e) => setNewStudentLastName(e.currentTarget.value)}
            value={newStudentLastName}
            type="text"
            placeholder="??veskite studento vapard??"
          />
          <div>
            <button onClick={AddStudent}>Prid??ti student??</button>
            <button onClick={CloseModal}>At??aukti</button>
          </div>
        </Modal>
      );
    }
  };

  const RenderGroupOptions = (): React.ReactNode => {
    if (groups) {
      return groups.map((group) => {
        return (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        );
      });
    }
    return <option value={undefined}>N??ra grupi??</option>;
  };

  const RenderAssignGroupModal = () => {
    if (assignGroupModalOpen) {
      return (
        <Modal
          closeModal={CloseModal}
          title="Priskirti grup?? studentui"
          errors={errors}
        >
          <span>
            {selectedStudent?.firstName + " " + selectedStudent?.lastName}
          </span>
          <select ref={groupSelection}>{RenderGroupOptions()}</select>
          <div>
            <button onClick={AssignGroup}>Priskirti grup??</button>
            <button onClick={CloseModal}>At??aukti</button>
          </div>
        </Modal>
      );
    }
  };

  const AssignGroup = async () => {
    if (selectedStudent && groupSelection.current?.value) {
      const data: IAssignGroupData = {
        userId: selectedStudent.id,
        groupId: parseInt(groupSelection.current.value),
      };

      await axiosConfig
        .post("/StudentGroups/assign-group", data)
        .then(() => {
          setErrors(null);
          GetStudents();
          CloseModal();
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    GetStudents();
    GetGroups();
  }, []);

  return (
    <div>
      {RenderAddStudentModal()}
      {RenderAssignGroupModal()}
      <div>
        <button onClick={() => setAddStudentModalOpen(true)}>
          Prid??ti student??
        </button>
      </div>
      <table className={styles.component_table}>
        <tbody>
          <tr>
            <th>Vardas</th>
            <th>Pavard??</th>
            <th>Grup??</th>
            <th>Pasirinkimai</th>
          </tr>
          {RenderStudents()}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
