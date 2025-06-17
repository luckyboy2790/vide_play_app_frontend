
interface CaptionDisplayProps {
  caption: string;
}

const CaptionDisplay = ({ caption }: CaptionDisplayProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-medium text-gray-900 mb-2">Caption</h3>
      <p className="text-gray-700 text-sm leading-relaxed">
        {caption || 'No caption provided'}
      </p>
    </div>
  );
};

export default CaptionDisplay;
