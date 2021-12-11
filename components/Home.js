import React, { useContext } from 'react';

import Doctors from './Doctors';
import Appointments from './Appointments';

import Context from '../context';

const Home = (props) => {
  const { navigation } = props;

  const { user } = useContext(Context);

  const renderBody = () => {
    if (user.role === 'Patient') {
      return <Doctors navigation={navigation} />;
    } else if (user.role === 'Doctor') { 
      return <Appointments navigation={navigation} />;
    }
    return <></>;
  }

  if (!user) {
    return <></>;
  }

  return (
    <>
      {renderBody()}
    </>
  );
};

export default Home;