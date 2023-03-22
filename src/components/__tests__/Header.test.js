import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { render, screen, fireEvent } from "@testing-library/react"
import { act } from 'react-dom/test-utils';

import Header from '../Header';
import { CurrentUserProvider } from '../../contexts/CurrentUserContext';

// How to configure JEST to allow tests with Axios v1 and above is from
// (https://stackoverflow.com/questions/74940474/jest-encountered-an-unexpected-token)

test('renders Header', () => {
  render(
    // Wrap in BrowserRouter and Routes, and render Header using Route component
    // to ensure access to all dependencies
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Header />} />
      </Routes>
    </BrowserRouter>
  )

  // Test that the logo text appears in the document
  expect(screen.getByText('Tribe')).toBeInTheDocument();
  expect(screen.getByText('Hub')).toBeInTheDocument();

  // Test that sign-out button does not exist in the document (as user is not authenticated, because we have not invoked CurrentUserProvider)
  const signOutButton = screen.queryByText('Sign-out');
  expect(signOutButton).toBeNull();
})

test('renders welcome message for a logged in user', async () => {
  render(
    // Wrap in BrowserRouter and Routes, and render Header using Route component
    // to ensure access to all dependencies
    <BrowserRouter>
      <CurrentUserProvider>
        <Routes>
          <Route exact path="/" element={<Header />} />
        </Routes>
      </CurrentUserProvider>
    </BrowserRouter>
  )

  // Test that the welcome message appears in the document for the logged in user
  const welcomeMessage = await screen.findByText('Welcome, Chief 1');
  expect(welcomeMessage).toBeInTheDocument();
})

test('renders sign-out button for a logged in user', async () => {
  render(
    // Wrap in BrowserRouter and Routes, and render Header using Route component
    // to ensure access to all dependencies
    <BrowserRouter>
      <CurrentUserProvider>
        <Routes>
          <Route exact path="/" element={<Header />} />
        </Routes>
      </CurrentUserProvider>
    </BrowserRouter>
  )

  // Test that sign-out button exists in the document (as user is authenticated)
  const signOutButton = await screen.findByText('Sign-out');
  expect(signOutButton).toBeInTheDocument();
})

test('renders Header without welcome message and sign-out buttons again when user logs out', async () => {
  render(
    // Wrap in BrowserRouter and Routes, and render Header using Route component
    // to ensure access to all dependencies
    <BrowserRouter>
      <CurrentUserProvider>
        <Routes>
          <Route exact path="/" element={<Header />} />
        </Routes>
      </CurrentUserProvider>
    </BrowserRouter>
  )

  // Find sign-out button and simulate user click
  const signOutButton = await screen.findByText('Sign-out');
  await act(() => fireEvent.click(signOutButton));

  // Test that sign-out button does not exist in the document after sign-out
  const signOutButtonAfterClick = await screen.queryByText('Sign-out')
  expect(signOutButtonAfterClick).toBeNull();

  // Test that the welcome message does not appear in the document after sign-out
  const welcomeMessage = await screen.queryByText('Welcome, Chief 1');
  expect(welcomeMessage).not.toBeInTheDocument();
})