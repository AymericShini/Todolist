import React, { FC, useEffect, useState } from 'react';
import './alert.css';

export type Props = {
  type: 'success' | 'error' | 'warning' | 'info' | '';
  message: string;
};

const TIME_OUT = 3500;

export const AlertMessage: FC<Props> = ({ type, message }: Props) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, TIME_OUT);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div className="alert">
      <div className={`alert-background ${type}`}>
        <img className="alert-logo" src={`/img/${type}.png`} />
        <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
        <p className="alert-message">{message}</p>
      </div>
    </div>
  )
};
