import React from 'react';

const ListItem = ({ item, renderArrow }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm list-item-transition flex justify-between items-center">
      <div>
        <h3 className="font-medium text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-600 italic">{item.scientific_name}</p>
      </div>
      {renderArrow && (
        <div className="ml-2">
          {renderArrow()}
        </div>
      )}
    </div>
  );
};

export default ListItem;