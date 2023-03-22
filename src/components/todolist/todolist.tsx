import React, { useEffect, useState } from 'react';
import './todolist.css';
import ImportJson from '../json/importJson/importJson';
import ExportToJson from '../json/exportJson/exportJson';

export interface Manga {
  url: string;
  manga: string;
  chapitre: string;
  validated: boolean;
}

interface EditManga {
  text: string;
  chapitre: string;
  index: number;
}

const TodoList: React.FC = () => {
  const [item, setItem] = useState<Manga[]>([]);
  const [searched, setSearched] = useState<Manga[]>([]);
  const [itemEnCours, setItemEnCours] = useState<Manga>({
    url: '',
    manga: '',
    chapitre: '',
    validated: false,
  });
  const [editEnCours, setEditEnCours] = useState<EditManga>({
    index: -1,
    text: '',
    chapitre: '',
  });
  const [noList, setNoList] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<boolean>(false);
  const [searching, setSearching] = useState<string>('');

  const keyPressInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addElement();
    }
  };

  const addElement = () => {
    if (
      itemEnCours.url === null ||
      itemEnCours.url === '' ||
      itemEnCours.chapitre === '' ||
      itemEnCours.chapitre === null ||
      itemEnCours.manga === '' ||
      itemEnCours.manga === null
    ) {
      return;
    }
    setItem([
      ...item,
      {
        manga: itemEnCours.manga,
        url: itemEnCours.url,
        chapitre: itemEnCours.chapitre,
        validated: false,
      },
    ]);
    setItemEnCours({ url: '', manga: '', chapitre: '', validated: false });
  };

  const updateElement = (id: number, edit: any) => {
    const updatedText = [...item];
    updatedText[id] = {
      ...updatedText[id],
      url: edit.text,
      chapitre: edit.chapitre,
    };
    setItem(updatedText);
    setEditEnCours({ index: -1, text: '', chapitre: '' });
  };

  const startEditElement = (Manga: Manga, key: number) => {
    setEditEnCours({ index: key, text: Manga.url, chapitre: Manga.chapitre });
  };

  const handleList = () => {
    setNoList(!noList);
  };

  const deleteElement = (indexTodoToDelete: number) => {
    const newTodos = [...item];
    newTodos.splice(indexTodoToDelete, 1);
    setItem(newTodos);
  };

  const sortElement = () => {
    const sortedItem = item.sort(function (item, tempItem) {
      setSortOrder(!sortOrder);
      return sortOrder
        ? item.manga.toLowerCase().localeCompare(tempItem.manga.toLowerCase())
        : tempItem.manga.toLowerCase().localeCompare(item.manga.toLowerCase());
    });
    setItem([...sortedItem]);
  };

  const isValidated = (idValidate: number) => {
    const validateTodo = [...item];
    validateTodo[idValidate].validated = !validateTodo[idValidate].validated;
    setItem(validateTodo);
  };

  const searchingElement = () => {
    console.log(`seaching :`, searching, item);
    const searchedItem = item
      .filter(value => value.manga === searching)
      .map(answer => console.log(`answer :`, answer));
    if (searchedItem !== undefined) {
      setSearched(searchedItem);
    }
  };

  const deleteSearch = () => {
    setSearched([]);
  };

  useEffect(() => {
    console.log(`searched :`, searched);
  }, [searched]);

  return (
    <div>
      <h2>Manga List</h2>
      <div>
        <label htmlFor="vehicle1">Ta une liste ?</label>
        <input type="checkbox" onChange={handleList} />
        {noList && (
          <div>
            <ImportJson setItem={setItem} />
          </div>
        )}
      </div>

      <div className="blockInput">
        Manga*
        <input
          type="text"
          autoFocus
          placeholder="Manga"
          value={itemEnCours.manga}
          onChange={e =>
            setItemEnCours({ ...itemEnCours, manga: e.target.value })
          }
          onKeyUp={e => keyPressInput(e)}
        />
        Url*
        <input
          type="url"
          placeholder="Url scan sans numéro"
          value={itemEnCours.url}
          onChange={e =>
            setItemEnCours({ ...itemEnCours, url: e.target.value })
          }
          onKeyUp={e => keyPressInput(e)}
        />
        Chapitre*
        <input
          type="number"
          placeholder="Chapitre"
          value={itemEnCours.chapitre}
          onChange={e =>
            setItemEnCours({ ...itemEnCours, chapitre: e.target.value })
          }
          onKeyUp={e => keyPressInput(e)}
        />
        <button onClick={() => addElement()}>Ajouter un manga</button>
        <button onClick={sortElement}>Trier</button>
        <div>
          <input
            type="text"
            placeholder="Searching"
            value={searching}
            onChange={e => setSearching(e.target.value)}
            onKeyUp={e => keyPressInput(e)}
          />
          <button onClick={searchingElement}>Searching</button>
          <button onClick={deleteSearch}>&#x274C;</button>
        </div>
      </div>

      <ul className="listItem">
        {searched.length > 0 && (
          <>
            {searched.map((manga, key) => (
              <li
                key={key}
                className={`listItemElement ${
                  manga.validated ? 'validated' : ''
                }`}
              >
                {key === editEnCours.index ? (
                  <>
                    <input
                      type="text"
                      value={editEnCours.text}
                      onChange={e =>
                        setEditEnCours({ ...editEnCours, text: e.target.value })
                      }
                      onKeyUp={e => keyPressInput(e)}
                    />
                    <input
                      type="number"
                      placeholder="Chapitre"
                      value={editEnCours.chapitre}
                      onChange={e =>
                        setEditEnCours({
                          ...editEnCours,
                          chapitre: e.target.value,
                        })
                      }
                      onKeyUp={e => keyPressInput(e)}
                    />
                    <button onClick={() => updateElement(key, editEnCours)}>
                      Valider
                    </button>
                  </>
                ) : (
                  <>
                    <p>
                      {manga.manga} : scan {manga.chapitre}
                    </p>
                    <img
                      className={'clipBoard'}
                      src="/img/copyToClipBoard.png"
                      onClick={() => {
                        window.open(
                          manga.url + manga.chapitre,
                          '_blank',
                          'noopener,noreferrer'
                        );
                      }}
                    />
                    <button onClick={() => startEditElement(manga, key)}>
                      Éditer
                    </button>
                    <button onClick={() => deleteElement(key)}>&#x274C;</button>
                    <button onClick={() => isValidated(key)}>&#10003;</button>
                  </>
                )}
              </li>
            ))}
          </>
        )}
        {searched.length === 0 && (
          <>
            {item.map((manga, key) => (
              <li
                key={key}
                className={`listItemElement ${
                  manga.validated ? 'validated' : ''
                }`}
              >
                {key === editEnCours.index ? (
                  <>
                    <input
                      type="text"
                      value={editEnCours.text}
                      onChange={e =>
                        setEditEnCours({ ...editEnCours, text: e.target.value })
                      }
                      onKeyUp={e => keyPressInput(e)}
                    />
                    <input
                      type="number"
                      placeholder="Chapitre"
                      value={editEnCours.chapitre}
                      onChange={e =>
                        setEditEnCours({
                          ...editEnCours,
                          chapitre: e.target.value,
                        })
                      }
                      onKeyUp={e => keyPressInput(e)}
                    />
                    <button onClick={() => updateElement(key, editEnCours)}>
                      Valider
                    </button>
                  </>
                ) : (
                  <>
                    <p>
                      {manga.manga} : scan {manga.chapitre}
                    </p>
                    <img
                      className={'clipBoard'}
                      src="/img/copyToClipBoard.png"
                      onClick={() => {
                        window.open(
                          manga.url + manga.chapitre,
                          '_blank',
                          'noopener,noreferrer'
                        );
                      }}
                    />
                    <button onClick={() => startEditElement(manga, key)}>
                      Éditer
                    </button>
                    <button onClick={() => deleteElement(key)}>&#x274C;</button>
                    <button onClick={() => isValidated(key)}>&#10003;</button>
                  </>
                )}
              </li>
            ))}
          </>
        )}
      </ul>
      <ExportToJson list={item} />
      <div>
        api pour les noms de manga = autocompletion // fonction de recherche //
        add dragable file //
      </div>
    </div>
  );
};

export default TodoList;
