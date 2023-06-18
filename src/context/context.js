"use client";
import { createContext, useState } from "react";

export const Message_data = createContext(null);

function Context({ children }) {
  const [titleStore, setTitleStore] = useState();
  const [fileStore, setFileStore] = useState();

  return (
    <Message_data.Provider
      value={{ titleStore, setTitleStore, fileStore, setFileStore }}
    >
      {children}
    </Message_data.Provider>
  );
}

export default Context;
