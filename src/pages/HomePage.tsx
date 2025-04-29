import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ListContainer from '../components/ListContainer';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorView from '../components/ErrorView';
import { fetchLists } from '../services/api';
import { List, ListItem } from '../types';

const HomePage: React.FC = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'creation'>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [originalLists, setOriginalLists] = useState<List[]>([]);

  useEffect(() => {
    fetchListData();
  }, []);

  const fetchListData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLists();
      
      // Process the received data
      const listMap: Map<number, ListItem[]> = new Map();
      
      // Group items by list_number
      Object.values(data).flat().forEach(item => {
        if (!listMap.has(item.list_number)) {
          listMap.set(item.list_number, []);
        }
        listMap.get(item.list_number)?.push(item);
      });
      
      // Create list objects
      const processedLists: List[] = Array.from(listMap.entries()).map(([number, items]) => ({
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

  const handleSelectList = (id: number) => {
    if (viewMode !== 'all') return;
    
    const updatedLists = lists.map(list => {
      if (list.id === id) {
        return { ...list, isSelected: !list.isSelected };
      }
      return list;
    });
    
    setLists(updatedLists);
    setErrorMessage(null);
  };

  const handleCreateNewList = () => {
    const selectedLists = lists.filter(list => list.isSelected);
    
    if (selectedLists.length !== 2) {
      setErrorMessage('You should select exactly 2 lists to create a new list');
      return;
    }
    
    // Sort selected lists by ID
    const sortedSelectedLists = [...selectedLists].sort((a, b) => a.id - b.id);
    const firstListId = sortedSelectedLists[0].id;
    const secondListId = sortedSelectedLists[1].id;
    
    // Create a new list
    const newList: List = {
      id: firstListId + 1,
      name: `List 3`,
      items: [],
      isSelected: false
    };
    
    // Rearrange lists to ensure the new list is between the selected lists
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
    
    // Set our three active lists for the creation view
    const activeList1 = { ...listsBeforeNewList.find(l => l.id === firstListId)!, isSelected: false };
    const activeList3 = { ...listsAfterNewList.find(l => l.id === firstListId + 2)!, isSelected: false };
    
    const updatedLists = [
      activeList1,
      { ...newList, id: firstListId + 1 },
      { ...activeList3, id: firstListId + 2 }
    ];
    
    setLists(updatedLists);
    setViewMode('creation');
  };

  const handleMoveItem = (itemId: string, sourceListId: number, targetListId: number) => {
    setLists(currentLists => {
      const newLists = JSON.parse(JSON.stringify(currentLists));
      
      // Find source and target lists
      const sourceList = newLists.find((list: List) => list.id === sourceListId);
      const targetList = newLists.find((list: List) => list.id === targetListId);
      
      if (!sourceList || !targetList) return currentLists;
      
      // Find the item to move
      const itemIndex = sourceList.items.findIndex((item: ListItem) => item.id === itemId);
      if (itemIndex === -1) return currentLists;
      
      // Move the item
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
    // Get the new list that was created
    const newList = lists.find(list => list.id === lists[0].id + 1);
    
    if (!newList) return;
    
    // Update the original lists data
    const updatedOriginalLists = JSON.parse(JSON.stringify(originalLists));
    
    // Add new list with its items to the original lists
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
      <div className="container mx-auto py-8">
        <Header title="List Creation" />
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
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
              let position: 'left' | 'middle' | 'right' | undefined;
              let targetListId: number | undefined;
              
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