import React, { useEffect, useState } from 'react';
import './todolist.css';
import ImportJson from '../json/importJson/importJson';
import ExportToJson from '../json/exportJson/exportJson';
import SortAlphaDown from '../../../public/img/sortAlphaDown';
import SortAlphaUp from '../../../public/img/sortAlphaUp';
import { useDebounce } from '../../shared/hooks/useDebounce';

import { Props as MessageProps, AlertMessage } from '../Alert';

export interface Manga {
  url: string;
  manga: string;
  chapitre: string;
  validated: boolean;
}

interface EditManga {
  url: string;
  manga: string;
  chapitre: string;
  index: number;
}

const TodoList: React.FC = () => {
  const [item, setItem] = useState<Manga[]>([]);
  const [itemEnCours, setItemEnCours] = useState<Manga>({
    url: '',
    manga: '',
    chapitre: '',
    validated: false,
  });
  const [editEnCours, setEditEnCours] = useState<EditManga>({
    index: -1,
    manga: '',
    url: '',
    chapitre: '',
  });
  const [noList, setNoList] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<boolean>(false);
  const [searched, setSearched] = useState<Manga[]>([]);
  const [searching, setSearching] = useState<string>('');
  const [alert, setAlert] = useState<MessageProps>({ type: '', message: '' });
  // const debouncedAlert = useDebounce(alert, 3500);

  // useEffect(() => {
  //   setAlert({ type: 'success', message: '' });
  //   console.log(`ici :`, alert);
  // }, [alert]);

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

    if(item.length > 0) {
      item.map((value: any) => {
        console.log(`value.manga :`, value.manga);
        if (value.manga === itemEnCours.manga) {
          setAlert({type: 'warning', message: 'Ce manga existe déjà dans votre liste'})
          return;
        }
      })
    }
    setItem([
      {
        manga: itemEnCours.manga,
        url: itemEnCours.url,
        chapitre: itemEnCours.chapitre,
        validated: false,
      },
      ...item,
    ]);
    setItemEnCours({ url: '', manga: '', chapitre: '', validated: false });
    
  };

  const updateElement = (id: number, edit: any) => {
    const updatedText = [...item];
    updatedText[id] = {
      ...updatedText[id],
      url: edit.url,
      manga: edit.manga,
      chapitre: edit.chapitre,
    };
    setItem(updatedText);
    setEditEnCours({ index: -1, manga: '', chapitre: '', url: '' });
  };

  const startEditElement = (manga: Manga, key: number) => {
    setEditEnCours({ 
      index: key, 
      manga: manga.manga, 
      chapitre: manga.chapitre, 
      url: manga.url  });
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
    const insensitiveSearching = searching.toLowerCase();
    const searchedItem = item.filter(entry => Object.values(entry).some(value => typeof value === 'string' && value.includes(insensitiveSearching)))
    setSearched(searchedItem);
  };

  const deleteSearch = () => {
    setSearched([]);
  };

  return (
    <div>
      <h2>Manga List</h2>
      <div>
        <label>Ta une liste ?</label>
        <input type="checkbox" onChange={handleList} />
        {!noList && (
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
        <button className="sort" onClick={sortElement}>
          Trier
          {sortOrder ? <SortAlphaUp /> : <SortAlphaDown />}
        </button>
      </div>

      <div className="blockInput">
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

      {alert.message !== '' && <AlertMessage type={alert.type} message={alert.message} />}

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
                      value={editEnCours.manga}
                      onChange={e =>
                        setEditEnCours({ ...editEnCours, manga: e.target.value })
                      }
                      onKeyUp={e => keyPressInput(e)}
                    />
                    <input
                      type="text"
                      value={editEnCours.url}
                      onChange={e =>
                        setEditEnCours({ ...editEnCours, url: e.target.value })
                      }
                      onKeyUp={e => keyPressInput(e)}
                    />
                    <input
                      type="number"
                      placeholder="Chapitre"
                      value={editEnCours.chapitre}
                      onChange={e =>
                        setEditEnCours({ ...editEnCours, chapitre: e.target.value })
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
                      placeholder="Manga"
                      value={editEnCours.manga}
                      onChange={e =>
                        setEditEnCours({ ...editEnCours, manga: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Url"
                      value={editEnCours.url}
                      onChange={e =>
                        setEditEnCours({ ...editEnCours, url: e.target.value })
                      }
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
                      className="clipBoard"
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
