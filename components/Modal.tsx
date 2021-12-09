import styles from "../styles/Modal.module.scss";
import ClickAwayListener from "react-click-away-listener";
import { useState } from "react";

interface IModal {
  children: JSX.Element[];
  closeModal: any;
  title: string;
}

const Modal = ({ children, closeModal, title }: IModal) => {
  const [open, isOpen] = useState<boolean>(true);

  return (
    <div className={styles.modal_background}>
      <ClickAwayListener onClickAway={closeModal}>
        <div className={styles.modal}>
          <div className={styles.modal_title}>{title}</div>
          {children}
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default Modal;
