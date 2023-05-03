import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './todolist.css';
import ImportJson from '../json/importJson/importJson';
import ExportToJson from '../json/exportJson/exportJson';
import SortAlphaDown from '../../../public/img/sortAlphaDown';
import SortAlphaUp from '../../../public/img/sortAlphaUp';
import { useDebounce } from '../../shared/hooks/useDebounce';

import { Props as MessageProps, AlertMessage } from '../Alert';

// const regexIsUrlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\$/;
// const regexIsEmpty = /^[^\s]+$/;
const regexIsNumber = /^[0-9]+$/;
// const regexMangaName = /^[a-zA-Z0-9]+(?:\s[a-zA-Z]+)*$/;

export interface Manga {
  url: string;
  manga: string;
  chapitre: string;
  favorite: boolean;
  notifications: boolean;
}

interface EditManga {
  url: string;
  manga: string;
  chapitre: string;
  index: number;
}

const TodoList: React.FC = () => {
  const [item, setItem] = useState<Manga[]>([]);
  const [itemEnCours, setItemEnCours] = useState<Manga>({ url: '', manga: '', chapitre: '', favorite: false, notifications: false });
  const [editEnCours, setEditEnCours] = useState<EditManga>({ index: -1, manga: '', url: '', chapitre: '' });
  const [noList, setNoList] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<boolean>(false);
  const [searched, setSearched] = useState<Manga[]>([]);
  const [searching, setSearching] = useState<string>('');
  const [alert, setAlert] = useState<MessageProps>({ type: '', message: '' });
  const [mangaData, setmangaData] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isFavoriteSelected, setIsFavoriteSelected] = useState(false);

  const debouncedAlert = useDebounce(alert, 4000);

  useEffect(() => {
    if (item.length > 0) {
      // Save item to session storage
      try {
        sessionStorage.setItem('item', JSON.stringify(item));
      } catch (error) {
        console.error(error);
      }
      // Save item to local storage
      try {
        window.localStorage.setItem('item', JSON.stringify(item));
      } catch (error) {
        console.error(error);
      }
    }
  }, [item]);

  useEffect(() => {
    try {
      // Get the item from sessionStorage or localStorage
      const item = JSON.parse(window.sessionStorage.item || window.localStorage.item);
      // Set the item in the state
      setItem(item);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Clear alert after 5000ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert({ type: '', message: '' });
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [debouncedAlert]);

  const getData = (text: string) => {
    // setItemEnCours({ ...itemEnCours, manga: text });
    // if (itemEnCours.manga.length > 2) {
    //   const getData = setTimeout(() => {
    //     axios.get(`https://api.jikan.moe/v4/manga?q=${text}&order_by=popularity&sort=asc&limit=5`).then(response => {
    //       setmangaData(response.data.data);
    //     });
    //   }, 1500);
    //   return () => clearTimeout(getData);
    // }
  };

  const keyPressInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addElement();
    }
  };

  // Check if the manga is already in the list
  const isDuplicate = () => {
    // If the list is not empty
    if (item.length > 0) {
      // Check if the manga is already in the list
      let duplicate = item.some(e => e.manga.toLowerCase() === itemEnCours.manga.toLowerCase());
      return duplicate;
    } else {
      return false;
    }
  };

  // Function to add a manga to the list
  const addElement = () => {
    // Check if the chapter field is empty
    if (!regexIsNumber.test(itemEnCours.chapitre.trim())) {
      // If so, display an error message
      setAlert({ type: 'error', message: 'Il manque le chapitre' });
      return;
    }
    // Check if the manga already exists in the list
    if (isDuplicate()) {
      // If so, display a warning message
      setAlert({
        type: 'warning',
        message: 'Ce manga existe déjà dans ta liste',
      });
    } else {
      // If not, add the manga to the list
      setItem([
        {
          manga: itemEnCours.manga,
          url: itemEnCours.url,
          chapitre: itemEnCours.chapitre,
          favorite: false,
          notifications: false,
        },
        ...item,
      ]);
      // Reset the input fields
      setItemEnCours({ url: '', manga: '', chapitre: '', favorite: false, notifications: false });
    }
  };

  const updateElement = (id: number, edit: any) => {
    // Clone the current items array
    const updatedText = [...item];
    // Update the item at the given ID
    updatedText[id] = {
      // Keep the existing data
      ...updatedText[id],
      // Replace the data with the updated data
      url: edit.url,
      manga: edit.manga,
      chapitre: edit.chapitre,
    };
    // Update the items array
    setItem(updatedText);
    // Reset the edit state
    setEditEnCours({ index: -1, manga: '', chapitre: '', url: '' });
  };

  const startEditElement = (manga: Manga, key: number) => {
    // Set the current manga to edit
    setEditEnCours({
      index: key,
      manga: manga.manga,
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
    // check which sort button is selected
    if (whichSort === 'alphabetical') {
      // toggle sort order
      setSortOrder(!sortOrder);
      // check if favorite is selected
      if (isFavoriteSelected) {
        // sort by favorite first
        setItem([...item.sort((a, b) => (a.favorite < b.favorite ? 1 : -1))]);
      } else {
        // sort by alphabet
        setItem([...item.sort((item, tempItem) => (sortOrder ? item.manga.toLowerCase().localeCompare(tempItem.manga.toLowerCase()) : tempItem.manga.toLowerCase().localeCompare(item.manga.toLowerCase())))]);
      }
    }
    // check if favorite button is selected
    if (whichSort === 'favorite') {
      // toggle favorite sort
      setIsFavoriteSelected(!isFavoriteSelected);
      if (!isFavoriteSelected) {
        // sort by favorite first
        setItem([...item.sort((a, b) => (a.favorite < b.favorite ? 1 : -1))]);
      } else {
        // sort by alphabet
        setItem([...item.sort((a, b) => (a.favorite > b.favorite ? 1 : -1))]);
      }
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

  const searchingElement = () => {
    // convert the string to lowercase
    const insensitiveSearching = searching.toLowerCase();
    // filter the item list to return only the elements that contain the search string
    const searchedItem = item.filter(entry => Object.values(entry).some(value => typeof value === 'string' && value.toLowerCase().includes(insensitiveSearching)));
    // update the searched state with the filtered list
    setSearched(searchedItem);
    if (searchedItem.length === 0) {
      // if the filtered list is empty, display an info alert
      setAlert({ type: 'info', message: 'Aucun manga trouvé dans votre liste' });
    }
  };

  useEffect(() => {
    if (searching.length > 0) {
      searchingElement();
    }
  }, [searching, item]);

  const deleteSearch = () => {
    setSearching('');
    setSearched([]);
  };

  const handleAddSuggestions = (choosenSuggestions: string) => {
    setItemEnCours((prevState: any) => ({
      ...prevState,
      manga: choosenSuggestions,
    }));
    setmangaData([]);
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
          <input type="text" autoFocus placeholder="Manga" value={itemEnCours.manga} onChange={e => setItemEnCours({ ...itemEnCours, manga: e.target.value })} onKeyUp={e => keyPressInput(e)} />
          {/* {mangaData.length > 0 &&
            showSuggestions &&
            mangaData.map((mangaData: any) => {
              return (
                <div onClick={() => handleAddSuggestions(mangaData.title)} className="anime-data-suggestions" onFocus={() => setShowSuggestions(true)} onBlur={() => setShowSuggestions(false)}>
                  {mangaData.title}
                </div>
              );
            })} */}
        </div>
        Url*
        <input type="url" placeholder="Url scan sans numéro" value={itemEnCours.url} onChange={e => handleUrl(e)} onKeyUp={e => keyPressInput(e)} />
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
        <input type="text" placeholder="Search your manga" value={searching} onChange={e => setSearching(e.target.value)} />
        {/* <button onClick={searchingElement}>Searching</button> */}
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
                      value={editEnCours.manga}
                      onChange={e =>
                        setEditEnCours({
                          ...editEnCours,
                          manga: e.target.value,
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
                      {manga.manga} : scan {manga.chapitre}
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
                      value={editEnCours.manga}
                      onChange={e =>
                        setEditEnCours({
                          ...editEnCours,
                          manga: e.target.value,
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
                      {manga.manga} : scan {manga.chapitre}
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
      <div>api pour les noms de manga = autocompletion // fonction de recherche // add dragable file //</div>
    </div>
  );
};

export default TodoList;
