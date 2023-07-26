import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortalAuthContext } from '../../../context/PortalAuthContext';

const OverviewTabDoLogout = () => {
  const { onLogout } = useContext(PortalAuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    onLogout();
    navigate('/gloo-platform-portal');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default OverviewTabDoLogout;
