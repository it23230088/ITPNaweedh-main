import { Link, useLocation } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

const BackButton = () => {
  const location = useLocation();

  // Determine the base path for the back button
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const basePath = pathSegments.length > 1 ? `/${pathSegments[0]}` : '/';

  return (
    <div className='flex'>
      <Link
        to={basePath}
        className='bg-sky-800 text-white px-4 py-1 rounded-lg w-fit'
      >
        <BsArrowLeft className='text-2xl' />
      </Link>
    </div>
  );
};

export default BackButton;
