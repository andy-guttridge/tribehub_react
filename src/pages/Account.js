import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../contexts/CurrentUserContext'
import { useSinglePage } from '../contexts/SinglePageContext';
import TribeMember from '../components/TribeMember';
import Spinner from '../components/Spinner';
import { PlusCircle } from 'react-bootstrap-icons';

function Account() {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const singlePage = useSinglePage();
  const [tribe, setTribe] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  // Styles to apply if app is in single page mode
  const singlePageStyles = "basis-4/5 border-solid border-2 flex-none m-2"

  const handleNewMember = () => {
    
  }

  useEffect(() => {
    // Check if user logged in on mount, if not redirect to landing page
    !currentUser && navigate("/");

    const fetchTribe = async () => {
      try {
        const { data } = await axios.get('tribe/');
        setTribe(data);
        setHasLoaded(true);
      }
      catch (error) {
        console.log(error.response?.data);
      }
    }
    fetchTribe();
  }, [])

  return (
    // Apply some styling if displaying in single page mode
    <div
      className={
        (singlePage ? singlePageStyles : undefined)
      }
    >
      <h2>Account</h2>
      <h3>Your tribe</h3>
      {hasLoaded ? (
        tribe.results[0]?.users.map(tribeMember => (
          <TribeMember key={tribeMember.user_id} tribeMember={tribeMember} />
        ))
      ) : (
        <Spinner />
      )}
      <div className="justify-end flex w-4/5 md:w-2/3 lg:1/2 mx-auto my-4">
        <button onClick={handleNewMember}><PlusCircle size="32"/></button>
      </div>
    </div>
  )
}

export default Account