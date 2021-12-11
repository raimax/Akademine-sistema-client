import type { NextPage } from "next";
import { useState } from "react";
import Header from "../../../components/Header";
import styles from "../../../styles/Admin.module.scss";
import SidebarButton from "../../../components/SidebarButton";
import Groups from "../../../components/Groups";
import Subjects from "../../../components/Subjects";
import Lecturers from "../../../components/Lecturers";
import Students from "../../../components/Students";

interface IPage {
  title: string;
  component: JSX.Element;
}

const pages: IPage[] = [
  {
    title: "Groups",
    component: <Groups />,
  },
  {
    title: "Subjects",
    component: <Subjects />,
  },
  {
    title: "Lecturers",
    component: <Lecturers />,
  },
  {
    title: "Students",
    component: <Students />,
  },
];

const Admin: NextPage = () => {
  const [activePage, setActivePage] = useState<string>("Groups");

  const RenderPage = (activePage: string) => {
    if (activePage) {
      for (let i = 0; i < pages.length; i++) {
        if (pages[i].title === activePage) {
          return pages[i].component;
        }
      }
    }
  };

  const OnSidebarButtonClick = (e: any) => {
    setActivePage(e.currentTarget.id);
  };

  return (
    <>
      <Header />
      <div className={styles.admin_page}>
        <div className={styles.sidebar}>
          <SidebarButton
            onClick={OnSidebarButtonClick}
            id="Groups"
            content="Groups"
            active={activePage === "Groups" ? true : false}
          />
          <SidebarButton
            onClick={OnSidebarButtonClick}
            id="Subjects"
            content="Subjects"
            active={activePage === "Subjects" ? true : false}
          />
          <SidebarButton
            onClick={OnSidebarButtonClick}
            id="Lecturers"
            content="Lecturers"
            active={activePage === "Lecturers" ? true : false}
          />
          <SidebarButton
            onClick={OnSidebarButtonClick}
            id="Students"
            content="Students"
            active={activePage === "Students" ? true : false}
          />
        </div>
        <main>{RenderPage(activePage)}</main>
      </div>
    </>
  );
};

export default Admin;
