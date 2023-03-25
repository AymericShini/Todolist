import React, { FC } from 'react';

type Props = {
  list: object;
};

const ExportToJson: FC<Props> = ({ list }) => {
  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(list))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'mangaList.json';
    link.click();
  };

  return (
    <button type="button" onClick={exportData}>
      Export your list (Json)
    </button>
  );
};
export default ExportToJson;
