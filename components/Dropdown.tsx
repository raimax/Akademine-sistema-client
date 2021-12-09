import { useState } from "react";
import styles from "../styles/Dropdown.module.scss";
import ClickAwayListener from "react-click-away-listener";

interface IDropdown {
  children: JSX.Element;
}

const Dropdown = ({ children }: IDropdown) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <button onClick={() => setOpen(!open)} className={styles.dropdown}>
        Options
        {open && <div className={styles.dropdown_menu}>{children}</div>}
      </button>
    </ClickAwayListener>
  );
};

export default Dropdown;
