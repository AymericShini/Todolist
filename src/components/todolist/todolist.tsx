import React, { useEffect, useState } from "react";
import "../../styles/todolist.css";
import ImportJson from "../json/importJson";
import ExportToJson from "../json/exportJson";

export interface Task {
  url: string;
  manga: string;
  chapitre: string;
  validated: boolean;
}

interface EditTask {
  text: string;
  chapitre: string;
  index: number
}

const TodoList: React.FC = () => {
  const [item, setItem] = useState<Task[]>([]);
  const [itemEnCours, setItemEnCours] = useState<Task>({url: "", manga: "", chapitre: "", validated: false});
  const [editEnCours, setEditEnCours] = useState<EditTask>({index: -1, text: "", chapitre: ""});

  const keyPressInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addElement();
    }
  };

  const addElement = () => {
    if (itemEnCours.url === null || itemEnCours.url === "" || itemEnCours.chapitre === "" || itemEnCours.chapitre === null || itemEnCours.manga === "" || itemEnCours.manga === null) {
      return;
    }
    setItem([...item ,{manga: itemEnCours.manga , url: itemEnCours.url , chapitre: itemEnCours.chapitre, validated: false, }]);
    setItemEnCours({url: "", manga: "", chapitre: "", validated: false})
  };

  const updateElement = (id: number, edit: any) => {
    const updatedText = [...item];
    updatedText[id] = {...updatedText[id], url: edit.text, chapitre: edit.chapitre}
    setItem(updatedText);
    setEditEnCours({index: -1, text: "", chapitre: ""})
  };

  const startEditElement = (task: Task, key: number) => {
    setEditEnCours({index: key, text: task.url, chapitre: task.chapitre})
  };

  const deleteElement = (indexTodoToDelete: number) => {
    const newTodos = [...item];
    newTodos.splice(indexTodoToDelete, 1);
    setItem(newTodos);
  };

  const sortElement = () => {
    setItem([...item.reverse()]);
  };

  const isValidated = (idValidate: number) => {
    const validateTodo = [...item];
    validateTodo[idValidate].validated = !validateTodo[idValidate].validated;
    setItem(validateTodo);
  };

  return (
    <div>
      <h2>Manga List</h2>
      <ImportJson setItem={setItem}/>

      <div className="blockInput">
        <p>Manga*</p>
        <input
          type="text"
          autoFocus
          placeholder="Manga"
          value={itemEnCours.manga}
          onChange={(e) => setItemEnCours({...itemEnCours, manga: e.target.value})}
          onKeyUp={(e) => keyPressInput(e)}
        />
        Url*
        <input
          type="url"
          placeholder="Url scan sans numéro"
          value={itemEnCours.url}
          onChange={(e) => setItemEnCours({...itemEnCours, url: e.target.value})}
          onKeyUp={(e) => keyPressInput(e)}
        />
        Chapitre*
        <input
          type="number"
          required
          placeholder="Chapitre"
          value={itemEnCours.chapitre}
          onChange={(e) => setItemEnCours({...itemEnCours, chapitre: e.target.value})}
          onKeyUp={(e) => keyPressInput(e)}
        />
        <button onClick={() => addElement()}>Ajouter un manga</button>
        <button onClick={sortElement}>Trier</button>

      </div>

      <ul className="listItem">
        {item.map((task, key) => (
          <li
            key={key}
            className={`listItemElement ${task.validated ? "validated" : ""}`}
          >
            {key === editEnCours.index ? (
              <>
                <input
                  type="text"
                  value={editEnCours.text}
                  onChange={(e) => setEditEnCours({...editEnCours, text: e.target.value})}
                  onKeyUp={(e) => keyPressInput(e)}
                />
                <input
                  type="number"
                  placeholder="Chapitre"
                  value={editEnCours.chapitre}
                  onChange={(e) => setEditEnCours({...editEnCours, chapitre: e.target.value})}
                  onKeyUp={(e) => keyPressInput(e)}
                />
                <button onClick={() => updateElement(key, editEnCours)}>
                  Valider
                </button>
              </>
            ) : (
              <>
                <p>
                  {task.manga} : scan {task.chapitre}
                </p>
                <img
                  className={'clipBoard'}
                  src="/img/copyToClipBoard.png"
                  onClick={() => {
                    window.open(task.url + task.chapitre, '_blank', 'noopener,noreferrer');
                  }}
                />
                <button onClick={() => startEditElement(task, key)}>Éditer</button>
                <button onClick={() => deleteElement(key)}>&#x274C;</button>
                <button onClick={() => isValidated(key)}>&#10003;</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <ExportToJson list={item}/>
      <div>
        todo : creer un json via la liste fourni //
        creer un import de via le json //
        trier par ordre alpha //
        api pour les noms de manga = autocompletion //
        fonction de recherche //
        export excel //
        black white theme //
      </div>
    </div>
  );
};

export default TodoList;

