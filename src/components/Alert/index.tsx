import React, { FC } from 'react';
import styles from './alert.css';

export type Props = {
    type: 'success' | 'error' | 'warning' | 'info' | '';
    message: string;
  };

export const AlertMessage: FC<Props> = ({
  type,
  message,
}: Props) => (
  <div className="alert">
    <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
    {message}
  </div>
);
