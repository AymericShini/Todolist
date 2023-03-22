import { FC } from 'react';
import { Task } from '../../todolist/todolist';
import './importJson.css'

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
      setItem((prevState: any) => {
        if (prevState.length !== 0) {
          value = value.filter((item: Task) => prevState.some((prevItem: Task) => item.manga !== prevItem.manga))
        }
        return (
          [...prevState,
          ...value]
        )
      })
    };
  };

  return (
    <>
      <label draggable="true" htmlFor="file"  className="label-file">Choisi un fichier JSON</label>
      <input draggable="true" className="input-file" id='file' type="file" onChange={(e) => handleChange(e)}></input>
    </>
  );
};
export default ImportJSON;