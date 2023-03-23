import React, { FC } from 'react';
import './alert.css';
import check from '/img/check.png';

export type Props = {
  type: 'success' | 'error' | 'warning' | 'info' | '';
  message: string;
};

export const AlertMessage: FC<Props> = ({ type, message }: Props) => (
  <div className="alert">
    <div className={`alert-background ${type}`}>
      <img className="alert-logo" src={`/img/${type}.png`} />
      <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
      <p className="alert-message">{message}</p>
    </div>
  </div>
);
