import { useEffect, useRef, useState } from "react";
import axiosConfig from "../axiosConfig";
import Modal from "../components/Modal";
import styles from "../styles/Table.module.scss";
import Dropdown from "../components/Dropdown";
import { HandleErrors } from "../Helpers/HandleErrors";
import MultipleOptionsToArray from "../Helpers/MultipleOptionsToArray";

interface IAssignSubjectData {
  groupSubjects: IGroupSubjectData[];
}

interface IRemoveSubjectData {
  groupSubjects: IGroupSubject[];
}

interface IGroupSubjectData {
  groupId: number;
  subjectId: number;
}

interface ISubject {
  id: number;
  name: string;
}

interface IGroupSubject {
  id: number;
  subject?: ISubject;
}

interface IGroup {
  id: number;
  name: string;
  groupSubjects: IGroupSubject[];
}

const Groups = () => {
  const [errors, setErrors] = useState<string[] | null | undefined>(null);
  const [groups, setGroups] = useState<IGroup[] | null>(null);
  const [subjects, setSubjects] = useState<ISubject[] | null>(null);
  const [addGroupModalOpen, setAddGroupModalOpen] = useState<boolean>(false);
  const [assignSubjectModalOpen, setAssignSubjectModalOpen] =
    useState<boolean>(false);
  const [removeSubjectModalOpen, setRemoveSubjectModalOpen] =
    useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<IGroup | null>(null);

  const subjectSelection = useRef<HTMLSelectElement>(null);

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

  const DeleteGroup = async (id: number) => {
    await axiosConfig
      .delete("/Groups/" + id)
      .then(() => {
        GetGroups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const RenderGroups = () => {
    if (groups?.length) {
      return groups.map((group) => {
        return (
          <tr key={group.id} className={styles.component_item}>
            <td>{group.name}</td>
            <td>
              {group.groupSubjects.map((groupSubject) => {
                return (
                  <li
                    key={groupSubject?.subject?.id}
                    style={{ listStyle: "none" }}
                  >
                    {groupSubject?.subject?.name}
                  </li>
                );
              })}
            </td>
            <td>
              <Dropdown>
                <div onClick={() => DeleteGroup(group.id)}>Pašalinti</div>
                <div
                  onClick={() => {
                    setSelectedGroup(group);
                    setAssignSubjectModalOpen(true);
                  }}
                >
                  Priskirti dalykus
                </div>
                <div
                  onClick={() => {
                    setSelectedGroup(group);
                    setRemoveSubjectModalOpen(true);
                  }}
                >
                  Pašalinti dalykus
                </div>
              </Dropdown>
            </td>
          </tr>
        );
      });
    }

    return (
      <tr>
        <td>Nėra grupių</td>
      </tr>
    );
  };

  const AddGroup = async () => {
    await axiosConfig
      .post("/Groups", { name: newGroupName })
      .then(() => {
        setNewGroupName("");
        GetGroups();
        CloseModal();
      })
      .catch((err) => {
        setErrors(HandleErrors(err.response.data));
      });
  };

  const CloseModal = () => {
    setAddGroupModalOpen(false);
    setAssignSubjectModalOpen(false);
    setRemoveSubjectModalOpen(false);
  };

  const RenderAddGroupModal = () => {
    if (addGroupModalOpen) {
      return (
        <Modal
          closeModal={CloseModal}
          title="Sukurti naują grupę"
          errors={errors}
        >
          <div>
            <input
              onChange={(e) => setNewGroupName(e.currentTarget.value)}
              value={newGroupName}
              type="text"
              placeholder="Grupės pavadinimas"
            ></input>
          </div>
          <div>
            <button onClick={AddGroup}>Pridėti grupę</button>
            <button onClick={CloseModal}>Atšaukti</button>
          </div>
        </Modal>
      );
    }
  };

  const RenderAssignSubjectModal = () => {
    if (assignSubjectModalOpen) {
      return (
        <Modal
          closeModal={CloseModal}
          title="Priskirti dalykus prie grupės"
          errors={errors}
        >
          <span>{selectedGroup?.name}</span>
          <select multiple size={8} ref={subjectSelection}>
            {RenderSubjectOptions()}
          </select>
          <div>
            <button onClick={AssignSubjects}>Priskirti dalykus</button>
            <button onClick={CloseModal}>Atšaukti</button>
          </div>
        </Modal>
      );
    }
  };

  const RenderRemoveSubjectModal = () => {
    if (removeSubjectModalOpen) {
      return (
        <Modal
          closeModal={CloseModal}
          title="Pašalinti dalykus iš grupės"
          errors={errors}
        >
          <span>{selectedGroup?.name}</span>
          <select multiple size={8} ref={subjectSelection}>
            {RenderRemoveOptions()}
          </select>
          <div>
            <button onClick={RemoveSubjects}>Pašalinti dalykus</button>
            <button onClick={CloseModal}>Atšaukti</button>
          </div>
        </Modal>
      );
    }
  };

  const RenderSubjectOptions = (): React.ReactNode => {
    if (subjects) {
      let assignedSubjects: number[] = [];

      return subjects.map((subject) => {
        let subjects2 = selectedGroup?.groupSubjects.filter(
          (q) => q?.subject?.id == subject.id
        );

        if (subjects2) {
          subjects2.forEach((element) => {
            if (element?.subject?.id === subject.id) {
              assignedSubjects.push(subject.id);
            }
          });
        }

        if (!assignedSubjects.includes(subject.id)) {
          return (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          );
        }
      });
    }
    return <option value={undefined}>Nėra dalykų</option>;
  };

  const AssignSubjects = async () => {
    if (selectedGroup && subjectSelection.current?.selectedOptions?.length) {
      let subjectArr: IGroupSubjectData[] = [];

      MultipleOptionsToArray(subjectSelection, "assign").forEach((element) => {
        subjectArr.push({ groupId: selectedGroup.id, subjectId: element });
      });

      const data: IAssignSubjectData = {
        groupSubjects: subjectArr,
      };

      await axiosConfig
        .post("/GroupSubjects", data)
        .then(() => {
          setErrors(null);
          GetGroups();
          CloseModal();
        })
        .catch((err) => console.log(err));
    }
  };

  const RenderRemoveOptions = () => {
    if (subjects) {
      let assignedSubjects: number[] = [];

      return subjects.map((subject) => {
        let subjects2 = selectedGroup?.groupSubjects.filter(
          (q) => q?.subject?.id == subject.id
        );

        if (subjects2) {
          subjects2.forEach((element) => {
            if (element?.subject?.id === subject.id) {
              assignedSubjects.push(subject.id);
            }
          });
        }

        if (assignedSubjects.includes(subject.id)) {
          return (
            <option
              data-group-subject-id={
                subjects2?.find((el) => el?.subject?.id === subject.id)?.id
              }
              key={subject.id}
              value={subject.id}
            >
              {subject.name}
            </option>
          );
        }
      });
    }
    return <option value={undefined}>Nėra dalykų</option>;
  };

  const RemoveSubjects = async () => {
    if (selectedGroup && subjectSelection.current?.selectedOptions?.length) {
      let subjectArr: IGroupSubject[] = [];

      MultipleOptionsToArray(subjectSelection, "remove").forEach((element) => {
        subjectArr.push({ id: element });
      });

      const data: IRemoveSubjectData = {
        groupSubjects: subjectArr,
      };

      await axiosConfig
        .delete("/GroupSubjects", { data: data })
        .then(() => {
          setErrors(null);
          GetGroups();
          CloseModal();
        })
        .catch((err) => console.log(err.response));
    }
  };

  useEffect(() => {
    GetGroups();
    GetSubjects();
  }, []);

  return (
    <div>
      {RenderAddGroupModal()}
      {RenderAssignSubjectModal()}
      {RenderRemoveSubjectModal()}
      <div>
        <button onClick={() => setAddGroupModalOpen(true)}>
          Sukurti grupę
        </button>
      </div>
      <table className={styles.component_table}>
        <tbody>
          <tr>
            <th>Pavadinimas</th>
            <th>Dalykai</th>
            <th>Pasirinkimai</th>
          </tr>
          {RenderGroups()}
        </tbody>
      </table>
    </div>
  );
};

export default Groups;
