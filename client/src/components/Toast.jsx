import { useEffect } from 'react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timerId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timerId);
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return <div className="toast">{message}</div>;
}
