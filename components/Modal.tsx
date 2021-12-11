import styles from "../styles/Modal.module.scss";
import ClickAwayListener from "react-click-away-listener";
import { useState } from "react";

interface IModal {
  children: JSX.Element[];
  closeModal: any;
  title: string;
  errors: string[] | null | undefined;
}

const Modal = ({ children, closeModal, title, errors }: IModal) => {
  const RenderErrors = () => {
    if (errors) {
      return errors.map((error) => {
        return <li key={error}>{error}</li>;
      });
    }
  };

  return (
    <div className={styles.modal_background}>
      <ClickAwayListener onClickAway={closeModal}>
        <div className={styles.modal}>
          <div className={styles.modal_title}>{title}</div>
          {RenderErrors()}
          {children}
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default Modal;
