import React, { createContext, useState } from "react";

export const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState({}); // {listId: [cards]}

  return (
    <BoardContext.Provider value={{
      boards, setBoards,
      currentBoard, setCurrentBoard,
      lists, setLists,
      cards, setCards
    }}>
      {children}
    </BoardContext.Provider>
  );
};

export default BoardContext;
