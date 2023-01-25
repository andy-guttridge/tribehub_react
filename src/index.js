import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { CurrentUserProvider } from './contexts/CurrentUserContext';
import { SinglePageProvider } from './contexts/SinglePageContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* How to use the BrowserRouter component to provide context for Router components is from */}
    {/* https://stackoverflow.com/questions/65425884/react-router-v6-error-useroutes-may-be-used-only-in-the-context-of-a-route */}
    <BrowserRouter>
      {/* CurrentUserProvider provides current user context to child elements */}
      <CurrentUserProvider>
        <SinglePageProvider>
          <App />
        </SinglePageProvider>
      </CurrentUserProvider>
    </BrowserRouter >
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
