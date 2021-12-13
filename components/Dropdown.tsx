import { useState } from "react";
import styles from "../styles/Dropdown.module.scss";
import ClickAwayListener from "react-click-away-listener";
import React from 'react'

interface IDropdown {
  children: React.ReactChild | React.ReactChild[];
}

const Dropdown = ({ children }: IDropdown) => {
  const [open, setOpen] = useState<boolean>(false);

  const RenderChildren = () => {
    if (children) {
      return React.Children.map(children, child => {
        return <div className={styles.dropdown_menu_item}>{child}</div>;
      })
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <button onClick={() => setOpen(!open)} className={styles.dropdown}>
        Options
        {open && <div className={styles.dropdown_menu}>{RenderChildren()}</div>}
      </button>
    </ClickAwayListener>
  );
};

export default Dropdown;
