import { FC } from 'react';
import { Task } from '../todolist/todolist';

type Props = { 
  setItem: (value: any) => void;
};

const ImportJSON: FC<Props> = ({ setItem }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader: any = new FileReader();
    if (e.target.files !== null) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
    }
    fileReader.onload = (e: any) => {
      let value: any = JSON.parse(e.target.result)
      setItem((prevState : []) => {
        return (
          [...prevState,
          ...value.filter((item: Task) => prevState.some((prevItem: Task) => item.manga !== prevItem.manga))]
        )
      })
    };
  };

  return (
    <input type="file" onChange={(e) => handleChange(e)}></input>
  );
};
export default ImportJSON;