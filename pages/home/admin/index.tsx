import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import styles from "../../../styles/Page.module.scss";
import SidebarButton from "../../../components/SidebarButton";
import Groups from "../../../components/Groups";
import Subjects from "../../../components/Subjects";
import Lecturers from "../../../components/Lecturers";
import Students from "../../../components/Students";
import RestrictAccess from "../../../Helpers/RestrictAccess";

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

  useEffect(() => {
    RestrictAccess("Student");
  }, []);

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.sidebar}>
          <SidebarButton
            onClick={OnSidebarButtonClick}
            id="Groups"
            content="Grupės"
            active={activePage === "Groups" ? true : false}
          />
          <SidebarButton
            onClick={OnSidebarButtonClick}
            id="Subjects"
            content="Dalykai"
            active={activePage === "Subjects" ? true : false}
          />
          <SidebarButton
            onClick={OnSidebarButtonClick}
            id="Lecturers"
            content="Dėstytojai"
            active={activePage === "Lecturers" ? true : false}
          />
          <SidebarButton
            onClick={OnSidebarButtonClick}
            id="Students"
            content="Studentai"
            active={activePage === "Students" ? true : false}
          />
        </div>
        <main>{RenderPage(activePage)}</main>
      </div>
    </>
  );
};

export default Admin;
