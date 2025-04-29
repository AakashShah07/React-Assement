import React from 'react';
import ListItem from './ListItem';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const ListContainer = ({ 
  list, 
  viewMode, 
  onSelect, 
  onMoveItem,
  targetListId,
  position 
}) => {
  const handleCheckboxChange = () => {
    if (onSelect) {
      onSelect(list.id);
    }
  };

  console.log("List is:   ",list);

  const renderArrow = (item) => {
    if (viewMode !== 'creation') return null;
    
    if (position === 'left') {
      return (
        <button 
          className="arrow-btn text-blue-500 focus:outline-none"
          onClick={() => onMoveItem && targetListId !== undefined && 
            onMoveItem(item.id, list.id, targetListId)}
          aria-label="Move to new list"
        >
          <ArrowRight size={20} />
        </button>
      );
    } else if (position === 'right') {
      return (
        <button 
          className="arrow-btn text-blue-500 focus:outline-none"
          onClick={() => onMoveItem && targetListId !== undefined && 
            onMoveItem(item.id, list.id, targetListId)}
          aria-label="Move to new list"
        >
          <ArrowLeft size={20} />
        </button>
      );
    } else if (position === 'middle') {
      return (
        <div className="flex gap-2">
          <button 
            className="arrow-btn text-blue-500 focus:outline-none"
            onClick={() => onMoveItem && 
              onMoveItem(item.id, list.id, list.id - 1)}
            aria-label="Move to left list"
          >
            <ArrowLeft size={20} />
          </button>
          <button 
            className="arrow-btn text-blue-500 focus:outline-none"
            onClick={() => onMoveItem && 
              onMoveItem(item.id, list.id, list.id + 1)}
            aria-label="Move to right list"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-gray-50 rounded-lg p-5 min-w-[300px] max-w-md w-full">
      {viewMode === 'all' && (
        <div className="mb-3 flex items-center">
          <input
            type="checkbox"
            id={`list-${list.id}`}
            checked={list.isSelected}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor={`list-${list.id}`} className="ml-2 font-medium text-gray-700">
            {list.name}
          </label>
        </div>
      )}
      
      {viewMode === 'creation' && (
        <div className="mb-3">
          <h3 className="font-medium text-gray-700">
            {list.name} ({list.items.length})
          </h3>
        </div>
      )}
      
      <div className="space-y-3">
        {list.items.map((item) => (
          <ListItem 
            key={item.id} 
            item={item}
            renderArrow={() => renderArrow(item)}
          />
        ))}
        {list.items.length === 0 && viewMode === 'creation' && (
          <div className="text-center py-8 text-gray-500">No items</div>
        )}
      </div>
    </div>
  );
};

export default ListContainer;