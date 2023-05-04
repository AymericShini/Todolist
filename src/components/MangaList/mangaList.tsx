import React, { useEffect, useState } from 'react';
import './mangaList.css';
import ImportJson from '../Json/importJson/importJson';
import ExportToJson from '../Json/exportJson/exportJson';
import SortAlphaDown from '../../../public/img/sortAlphaDown';
import SortAlphaUp from '../../../public/img/sortAlphaUp';
import { Manga, EditManga } from '../../shared/types/manga';
import { Props as MessageProps, AlertMessage } from '../Alert';

const regexIsNumber = /^[0-9]+$/;

const TodoList: React.FC = () => {
  const [item, setItem] = useState<Manga[]>([]);
  const [itemEnCours, setItemEnCours] = useState<Manga>({ url: '', name: '', chapitre: '', favorite: false, notifications: false });
  const [editEnCours, setEditEnCours] = useState<EditManga>({ index: -1, name: '', url: '', chapitre: '' });
  const [noList, setNoList] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<boolean>(false);
  const [searched, setSearched] = useState<Manga[]>([]);
  const [searching, setSearching] = useState<string>('');
  const [alert, setAlert] = useState<MessageProps>({ type: '', message: '' });
  const [isFavoriteSelected, setIsFavoriteSelected] = useState(false);

  // Save item to session storage
  // Save item to local storage
  useEffect(() => {
    if (item.length > 0) {
      try {
        sessionStorage.setItem('item', JSON.stringify(item));
      } catch (error) {
        console.error(error);
      }
      try {
        window.localStorage.setItem('item', JSON.stringify(item));
      } catch (error) {
        console.error(error);
      }
    }
    if (searching.length > 0) {
      searchingElement();
    }
  }, [searching, item]);

  // Get the item from sessionStorage or localStorage
  // Set the item in the state
  useEffect(() => {
    try {
      const item = JSON.parse(window.sessionStorage.item || window.localStorage.item);
      setItem(item);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const keyPressInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addElement();
    }
  };

  // Check if the manga is already in the list
  // If the list is not empty
  // Check if the manga is already in the list
  const isDuplicate = () => {
    if (item.length > 0) {
      let duplicate = item.some(e => e.name.toLowerCase() === itemEnCours.name.toLowerCase());
      return duplicate;
    } else {
      return false;
    }
  };

  // Function to add a manga to the list
  // Check if the chapter field is empty
  // If so, display an error message
  // Check if the manga already exists in the list
  // If so, display a warning message
  // If not, add the manga to the list
  // Reset the input fields
  const addElement = () => {
    if (!regexIsNumber.test(itemEnCours.chapitre.trim())) {
      setAlert({ type: 'error', message: 'Il manque le chapitre' });
      return;
    }
    if (isDuplicate()) {
      setAlert({ type: 'warning', message: 'Ce manga existe déjà dans ta liste' });
    } else {
      setItem([
        {
          name: itemEnCours.name,
          url: itemEnCours.url,
          chapitre: itemEnCours.chapitre,
          favorite: false,
          notifications: false,
        },
        ...item,
      ]);
      setItemEnCours({ url: '', name: '', chapitre: '', favorite: false, notifications: false });
    }
  };

  // Clone the current items array
  // Update the item at the given ID
  // Keep the existing data
  // Replace the data with the updated data
  // Update the items array
  // Reset the edit state
  const updateElement = (id: number, edit: any) => {
    const updatedText = [...item];
    updatedText[id] = {
      ...updatedText[id],
      url: edit.url,
      name: edit.name,
      chapitre: edit.chapitre,
    };
    setItem(updatedText);
    setEditEnCours({ index: -1, name: '', chapitre: '', url: '' });
  };

  // Set the current manga to edit
  const startEditElement = (manga: Manga, key: number) => {
    setEditEnCours({
      index: key,
      name: manga.name,
      chapitre: manga.chapitre,
      url: manga.url,
    });
  };

  const handleList = () => {
    setNoList(!noList);
  };

  const deleteElement = (indexTodoToDelete: number) => {
    const newTodos = [...item];
    newTodos.splice(indexTodoToDelete, 1);
    setItem(newTodos);
  };

  const sortElement = (whichSort: string) => {
    let sortedItem: any = {};
    if (whichSort === 'alphabetical') {
      sortedItem = item.sort((item, tempItem) => {
        setSortOrder(!sortOrder);
        return sortOrder ? item.name.toLowerCase().localeCompare(tempItem.name.toLowerCase()) : tempItem.name.toLowerCase().localeCompare(item.name.toLowerCase());
      });
      if (isFavoriteSelected) {
        sortedItem = item.sort((a, b) => (a.favorite < b.favorite ? 1 : -1));
      }
      setItem([...sortedItem]);
    }
    if (whichSort === 'favorite') {
      setIsFavoriteSelected(!isFavoriteSelected);
      if (!isFavoriteSelected) {
        sortedItem = item.sort((a, b) => (a.favorite < b.favorite ? 1 : -1));
      } else if (isFavoriteSelected) {
        sortedItem = item.sort((a, b) => (a.favorite > b.favorite ? 1 : -1));
      }
      setItem([...sortedItem]);
    }
  };

  const isfavorite = (isFavorite: number) => {
    const favorite = [...item];
    favorite[isFavorite].favorite = !favorite[isFavorite].favorite;
    setItem(favorite);
  };

  const isNotifOn = (isNotifOn: number) => {
    const notifications = [...item];
    notifications[isNotifOn].notifications = !notifications[isNotifOn].notifications;
    setItem(notifications);
  };

  // convert the string to lowercase
  // filter the item list to return only the elements that contain the search string
  // update the searched state with the filtered list
  // if the filtered list is empty, display an info alert
  const searchingElement = () => {
    const insensitiveSearching = searching.toLowerCase();
    const searchedItem = item.filter(entry => Object.values(entry).some(value => typeof value === 'string' && value.toLowerCase().includes(insensitiveSearching)));
    setSearched(searchedItem);
    if (searchedItem.length === 0) {
      setAlert({ type: 'info', message: 'Aucun manga trouvé dans votre liste' });
    }
  };

  const deleteSearch = () => {
    setSearching('');
    setSearched([]);
  };

  const handleRedirectToManga = (manga: any) => {
    if (manga.url.indexOf('XXX') > -1) {
      window.open(manga.url.replace('XXX', manga.chapitre), '_blank');
    } else {
      window.open(manga.url + manga.chapitre, '_blank');
    }
  };

  const handleUrl = (e: any) => {
    setItemEnCours({ ...itemEnCours, url: e.target.value });
    setAlert({ type: 'info', message: "Si votre url contient le numero de chapitre en plein milieu de l'url remplacer le numero par XXX" });
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
        <div>
          <input type="text" autoFocus placeholder="Manga" value={itemEnCours.name} onChange={e => setItemEnCours({ ...itemEnCours, name: e.target.value })} onKeyUp={e => keyPressInput(e)} />
        </div>
        Url*
        <input type="url" placeholder="Url du scan sans le chapitre" value={itemEnCours.url} onChange={e => handleUrl(e)} onKeyUp={e => keyPressInput(e)} />
        Chapitre*
        <input type="number" placeholder="Chapitre" value={itemEnCours.chapitre} onChange={e => setItemEnCours({ ...itemEnCours, chapitre: e.target.value })} onKeyUp={e => keyPressInput(e)} />
        <button onClick={() => addElement()}>Ajouter un manga</button>
        <div>
          Trier :
          <div className="sort-display">
            <button className="sort" onClick={() => sortElement('alphabetical')}>
              {sortOrder ? <SortAlphaUp /> : <SortAlphaDown />}
            </button>
            <button className="sort" onClick={() => sortElement('favorite')}>
              <img className="favorite" src={isFavoriteSelected ? 'img/checkedStar.png' : 'img/unCheckedStar.png'} />
            </button>
          </div>
        </div>
      </div>

      <div className="blockInput">
        <input type="text" placeholder="Recherche de manga" value={searching} onChange={e => setSearching(e.target.value)} />
        {searching !== '' && <button onClick={deleteSearch}>&#x274C;</button>}
      </div>

      {alert.message !== '' && <AlertMessage type={alert.type} message={alert.message} />}

      <ul className="listItem">
        {searched.length > 0 && (
          <>
            {searched.map((manga, key) => (
              <li key={key} className={`listItemElement ${manga.favorite ? 'favorite' : ''}`}>
                {key === editEnCours.index ? (
                  <>
                    <input
                      type="text"
                      value={editEnCours.name}
                      onChange={e =>
                        setEditEnCours({
                          ...editEnCours,
                          name: e.target.value,
                        })
                      }
                      onKeyUp={e => keyPressInput(e)}
                    />
                    <input type="text" value={editEnCours.url} onChange={e => setEditEnCours({ ...editEnCours, url: e.target.value })} onKeyUp={e => keyPressInput(e)} />
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
                    <button onClick={() => updateElement(key, editEnCours)}>Valider</button>
                  </>
                ) : (
                  <>
                    <p>
                      {manga.name} : scan {manga.chapitre}
                    </p>
                    <img onClick={() => handleRedirectToManga(manga)} className={'clipBoard'} src="/img/copyToClipBoard.png" />
                    <button onClick={() => startEditElement(manga, key)}>Éditer</button>
                    <button onClick={() => deleteElement(key)}>&#x274C;</button>
                    <button onClick={() => isfavorite(key)}>
                      <img className="favorite" src={manga.favorite ? 'img/checkedStar.png' : 'img/unCheckedStar.png'} />
                    </button>
                  </>
                )}
              </li>
            ))}
          </>
        )}
        {searched.length === 0 && (
          <>
            {item.map((manga, key) => (
              <li key={key} className={`listItemElement ${manga.favorite ? 'favorite' : ''}`}>
                {key === editEnCours.index ? (
                  <>
                    <input
                      type="text"
                      placeholder="Manga"
                      value={editEnCours.name}
                      onChange={e =>
                        setEditEnCours({
                          ...editEnCours,
                          name: e.target.value,
                        })
                      }
                    />
                    <input type="text" placeholder="Url" value={editEnCours.url} onChange={e => setEditEnCours({ ...editEnCours, url: e.target.value })} />
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
                    <button onClick={() => updateElement(key, editEnCours)}>Valider</button>
                  </>
                ) : (
                  <>
                    <p>
                      {manga.name} : scan {manga.chapitre}
                    </p>
                    <img onClick={() => handleRedirectToManga(manga)} className="clipBoard" src="/img/copyToClipBoard.png" />
                    <button onClick={() => startEditElement(manga, key)}>Éditer</button>
                    <button onClick={() => deleteElement(key)}>&#x274C;</button>
                    <button onClick={() => isfavorite(key)}>
                      <img className="favorite" src={manga.favorite ? 'img/checkedStar.png' : 'img/unCheckedStar.png'} />
                    </button>
                    <button onClick={() => isNotifOn(key)}>
                      <img className="favorite" src={manga.notifications ? 'img/notifOn.png' : 'img/notifOff.png'} />
                    </button>
                  </>
                )}
              </li>
            ))}
          </>
        )}
      </ul>

      <ExportToJson list={item} />
    </div>
  );
};

export default TodoList;
