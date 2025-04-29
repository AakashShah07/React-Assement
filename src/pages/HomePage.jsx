import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ListContainer from '../components/ListContainer';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorView from '../components/ErrorView';
import { fetchLists } from '../services/api';

const HomePage = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('all');
  const [errorMessage, setErrorMessage] = useState(null);
  const [originalLists, setOriginalLists] = useState([]);

  useEffect(() => {
    fetchListData();
  }, []);

  const fetchListData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLists();
      
      const listMap = new Map();
      
      Object.values(data).flat().forEach(item => {

        if (item.list_number === undefined || item.list_number === null) return;
        if (!listMap.has(item.list_number)) {
          listMap.set(item.list_number, []);
        }
        listMap.get(item.list_number)?.push(item);
      });

      
      
      const processedLists = Array.from(listMap.entries()).map(([number, items]) => ({
        id: number,
        name: `List ${number}`,
        items,
        isSelected: false
      }));
      
      setLists(processedLists);
      setOriginalLists(JSON.parse(JSON.stringify(processedLists)));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Something went wrong while fetching the lists. Please try again.');
    }
  };

  const handleSelectList = (id) => {
    if (viewMode !== 'all') return;
    
    const updatedLists = lists.map(list => {
      if (list.id === id) {
        return { ...list, isSelected: !list.isSelected };
      }
      return list;
    });
    console.log("Processed list is ", updatedLists)
    setLists(updatedLists);
    setErrorMessage(null);
  };

  const handleCreateNewList = () => {
    const selectedLists = lists.filter(list => list.isSelected);
    
    if (selectedLists.length !== 2) {
      setErrorMessage('You should select exactly 2 lists to create a new list');
      return;
    }
    
    const sortedSelectedLists = [...selectedLists].sort((a, b) => a.id - b.id);
    const firstListId = sortedSelectedLists[0].id;
    const secondListId = sortedSelectedLists[1].id;
    
    const newList = {
      id: firstListId + 1,
      name: `List 3`,
      items: [],
      isSelected: false
    };
    
    const listsBeforeNewList = lists
      .filter(list => list.id < newList.id)
      .map(list => ({
        ...list,
        id: list.id === firstListId ? firstListId : list.id
      }));
      
    const listsAfterNewList = lists
      .filter(list => list.id > firstListId)
      .map(list => ({
        ...list,
        id: list.id === secondListId ? firstListId + 2 : list.id
      }));
    
    const activeList1 = { ...listsBeforeNewList.find(l => l.id === firstListId), isSelected: false };
    const activeList3 = { ...listsAfterNewList.find(l => l.id === firstListId + 2), isSelected: false };
    
    const updatedLists = [
      activeList1,
      { ...newList, id: firstListId + 1 },
      { ...activeList3, id: firstListId + 2 }
    ];
    
    setLists(updatedLists);
    setViewMode('creation');
  };

  const handleMoveItem = (itemId, sourceListId, targetListId) => {
    setLists(currentLists => {
      const newLists = JSON.parse(JSON.stringify(currentLists));
      
      const sourceList = newLists.find(list => list.id === sourceListId);
      const targetList = newLists.find(list => list.id === targetListId);
      
      if (!sourceList || !targetList) return currentLists;
      
      const itemIndex = sourceList.items.findIndex(item => item.id === itemId);
      if (itemIndex === -1) return currentLists;
      
      const [movedItem] = sourceList.items.splice(itemIndex, 1);
      targetList.items.push(movedItem);
      
      return newLists;
    });
  };

  const handleCancel = () => {
    setLists(JSON.parse(JSON.stringify(originalLists)));
    setViewMode('all');
  };

  const handleUpdate = () => {
    const newList = lists.find(list => list.id === lists[0].id + 1);
    
    if (!newList) return;
    
    const updatedOriginalLists = JSON.parse(JSON.stringify(originalLists));
    
    if (newList.items.length > 0) {
      updatedOriginalLists.push({
        ...newList,
        isSelected: false
      });
    }
    
    setOriginalLists(updatedOriginalLists);
    setLists(updatedOriginalLists);
    setViewMode('all');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Header title="List Creation" />
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Header title="List Creation" />
        <ErrorView message={error} onRetry={fetchListData} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 max-w-7xl">
      <Header title="List Creation" />
      
      {viewMode === 'all' && (
        <>
          <div className="mb-6 flex justify-center">
            <Button onClick={handleCreateNewList}>Create a new list</Button>
          </div>
          
          {errorMessage && (
            <div className="mb-4 text-center text-red-500 error-shake">{errorMessage}</div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map(list => (
              <ListContainer
                key={list.id}
                list={list}
                viewMode="all"
                onSelect={handleSelectList}
              />
            ))}
          </div>
        </>
      )}
      
      {viewMode === 'creation' && (
        <>
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">
            {lists.map((list, index) => {
              let position;
              let targetListId;
              
              if (index === 0) {
                position = 'left';
                targetListId = list.id + 1;
              } else if (index === 1) {
                position = 'middle';
              } else if (index === 2) {
                position = 'right';
                targetListId = list.id - 1;
              }
              
              return (
                <ListContainer
                  key={list.id}
                  list={list}
                  viewMode="creation"
                  onMoveItem={handleMoveItem}
                  position={position}
                  targetListId={targetListId}
                />
              );
            })}
          </div>
          
          <div className="flex justify-center gap-4">
            <Button onClick={handleCancel} variant="secondary">Cancel</Button>
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;