import styles from "../styles/Grade.module.scss"

interface IGrade {
  children: number;
}

const Grade = ({ children }: IGrade) => {
  function ReturnColor(): string {
    if (children <= 4) {
      return '#940d0d'
    }
    else if (children >= 5 && children <= 7) {
      return '#f58442'
    }

    return 'green'
  }
  
  return <div style={{backgroundColor: ReturnColor()}} className={styles.grade}>{children}</div>;
};

export default Grade;
