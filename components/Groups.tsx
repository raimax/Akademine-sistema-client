import { useEffect, useState } from "react";
import axiosConfig from "../axiosConfig";
import Modal from "../components/Modal";

interface IGroup {
  id: number;
  name: string;
}

const Groups = () => {
  const [groups, setGroups] = useState<IGroup[] | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(true);

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

  const RenderGroups = () => {
    if (groups !== null) {
      return groups.map((group) => {
        return <p key={group.id}>{group.name}</p>;
      });
    }
  };

  const AddGroup = async (groupName: string) => {
    await axiosConfig
      .post("/Groups", groupName)
      .then(() => {
        GetGroups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const CloseModal = () => {
    setModalOpen(false);
  };

  const RenderModal = () => {
    if (modalOpen) {
      return (
        <Modal closeModal={CloseModal} title="Add New Group">
          <div>
						<input type="text" placeholder="Enter group's name"></input>
					</div>
          <div>
            <button>Add Group</button>
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
        <button>Add New Group</button>
      </div>
      <div>{RenderGroups()}</div>
    </div>
  );
};

export default Groups;
