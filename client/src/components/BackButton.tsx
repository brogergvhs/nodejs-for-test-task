import React from 'react';
import { Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

function BackButton(): JSX.Element {
  const navigate = useNavigate();

  function handleBackClick() {
    navigate(-1);
  }

  return (
    <Button variant="ghost" onClick={() => handleBackClick()}>
      Go Back
    </Button>
  );
}

export default BackButton;
