import React, { FC, memo, useState } from 'react';
import styles from '../styles.module.scss';

type Props = {
  item: any;
};

const Statistics: FC<Props> = ({ item }) => {
  let favoriteLength = item.map(manga => manga.favorite === true);
  favoriteLength = favoriteLength.filter(Boolean).length;
  // const lastMangaUpdated = item.reduce((temp, manga) => (manga.updatedMangaDate > temp.updatedMangaDate ? manga : temp));

  return (
    <div>
      Stats :<div>Nombre de manga dans votre liste : {item.length}</div>
      <div>Nombre de favoris dans votre liste : {favoriteLength} </div>
      {/* <div>Dernier manga update {lastMangaUpdated.manga} </div> */}
    </div>
  );
};
export default Statistics;
