import { useEffect, useState } from "react";
import axiosConfig from "../axiosConfig";
import Modal from "../components/Modal";
import styles from "../styles/Groups.module.scss";
import Dropdown from "../components/Dropdown";

interface IGroup {
  id: number;
  name: string;
}

const Groups = () => {
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
    if (groups !== null) {
      return groups.map((group) => {
        return (
          <div key={group.id} className={styles.group_item}>
            <div>{group.name}</div>
            <Dropdown>
              <div onClick={() => DeleteGroup(group.id)}>Delete</div>
            </Dropdown>
          </div>
        );
      });
    }
  };

  const AddGroup = async () => {
    if (newGroupName !== "") {
      await axiosConfig
        .post("/Groups", { name: newGroupName })
        .then(() => {
          setNewGroupName("");
          GetGroups();
          CloseModal();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const CloseModal = () => {
    setModalOpen(false);
  };

  const RenderModal = () => {
    if (modalOpen) {
      return (
        <Modal closeModal={CloseModal} title="Add New Group">
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
      <div>{RenderGroups()}</div>
    </div>
  );
};

export default Groups;
