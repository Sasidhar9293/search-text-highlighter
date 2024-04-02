import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import DocumentViewerComponent from './DocumentViewer';
import PSPDFKit from 'pspdfkit';

function App() {

  const [searchText, setSearchText] = useState("");

  return (
    <div className="App">
      <input onChange={event => setSearchText(event?.target.value)} />
      <DocumentViewerComponent searchKey={searchText}
        document={"paform.pdf"}
      />
    </div>
  );
}


export default App;
