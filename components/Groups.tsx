import { useEffect, useState } from "react";
import axiosConfig from "../axiosConfig";
import Modal from "../components/Modal";
import styles from "../styles/AdminComponent.module.scss";
import Dropdown from "../components/Dropdown";
import Cookies from "js-cookie";
import { HandleErrors } from "../Helpers/HandleErrors";

interface IGroup {
  id: number;
  name: string;
}

const Groups = () => {
  const [errors, setErrors] = useState<string[] | null | undefined>(null);
  const [groups, setGroups] = useState<IGroup[] | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>("");

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
              <Dropdown>
                <div onClick={() => DeleteGroup(group.id)}>Delete</div>
              </Dropdown>
            </td>
          </tr>
        );
      });
    }

    return <tr><td>No groups</td></tr>
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
    setModalOpen(false);
  };

  const RenderModal = () => {
    if (modalOpen) {
      return (
        <Modal closeModal={CloseModal} title="Add New Group" errors={errors}>
          <div>
            <input
              onChange={(e) => setNewGroupName(e.currentTarget.value)}
              value={newGroupName}
              type="text"
              placeholder="Enter group's name"
            ></input>
          </div>
          <div>
            <button onClick={AddGroup}>Add Group</button>
            <button onClick={CloseModal}>Cancel</button>
          </div>
        </Modal>
      );
    }
  };

  useEffect(() => {
    GetGroups();
  }, []);

  return (
    <div>
      {RenderModal()}
      <div>
        <button onClick={() => setModalOpen(true)}>Add New Group</button>
      </div>
        <table className={styles.component_table}>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Options</th>
            </tr>
            {RenderGroups()}
          </tbody>
        </table>
    </div>
  );
};

export default Groups;
