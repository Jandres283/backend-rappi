
import { Outlet } from 'react-router-dom';

export const RestaurantLayout = () => {
  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      <Outlet />
    </div>
  );
};

export default RestaurantLayout;