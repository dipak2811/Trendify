import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const MenuLists = ({ onClose }:any) => {
  const menuRoot = useRef(document.getElementById("menu-root"));
  const el = useRef(document.createElement("div"));

  useEffect(() => {
    const menuElement = el.current;

    if (menuRoot.current && menuElement) {
      menuRoot.current.appendChild(menuElement);
    }

    return () => {
      if (menuRoot.current && menuElement) {
        menuRoot.current.removeChild(menuElement);
      }
    };
  }, []);

  return createPortal(
    <div className="menu-list">
      <ul>
        <li>Menu Item 1</li>
        <li>Menu Item 2</li>
        <li>Menu Item 3</li>
      </ul>
      <button onClick={onClose}>Close</button>
    </div>,
    el.current
  );
};

export default MenuLists;
