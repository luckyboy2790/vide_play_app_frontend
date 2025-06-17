
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SharedPlayHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-1 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Shared Play Preview</h1>
      </div>
    </header>
  );
};

export default SharedPlayHeader;
