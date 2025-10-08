import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { ListAPI, CardAPI } from "../../services/api";
import { BoardContext } from "../../context/BoardContext";
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  IconButton
} from "@mui/material";
import { showToast } from "../../../utils/toast";
import { Delete } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const BoardViewPage = () => {
  const { id } = useParams();
  const { lists, setLists, cards, setCards } = useContext(BoardContext);
  const [editingList, setEditingList] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [editingCardId, setEditingCardId] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState("");

  useEffect(() => {
    ListAPI.getLists(id).then(res => {
      setLists(res.data);
      res.data.forEach(list => {
        CardAPI.getCards(list.id).then(resp => {
          setCards(prev => ({ ...prev, [list.id]: resp.data }));
        });
      });
    });
  }, [id, setLists, setCards]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;

    if (type === "card") {
      const sourceListId = source.droppableId;
      const destListId = destination.droppableId;
      const sourceCards = [...cards[sourceListId]];
      const [movedCard] = sourceCards.splice(source.index, 1);

      if (sourceListId === destListId) {
        sourceCards.splice(destination.index, 0, movedCard);
        setCards(prev => ({ ...prev, [sourceListId]: sourceCards }));
      } else {
        const destCards = [...(cards[destListId] || [])];
        destCards.splice(destination.index, 0, movedCard);
        setCards(prev => ({
          ...prev,
          [sourceListId]: sourceCards,
          [destListId]: destCards
        }));
      }

      CardAPI.updateCard(draggableId, { listId: destListId });
    }
  };

  const handleListNameSave = async (list) => {
    try {
      await ListAPI.updateList(list.id, { name: list.name });
      setEditingList(null);
      showToast.success("List updated");
    } catch {
      showToast.error("Failed to update list");
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await ListAPI.deleteList(listId);
      setLists(prev => prev.filter(l => l.id !== listId));
      setCards(prev => {
        const copy = { ...prev };
        delete copy[listId];
        return copy;
      });
      showToast.info("List deleted");
    } catch {
      showToast.error("Failed to delete list");
    }
  };

  const handleAddList = async () => {
    if (!newListName.trim()) return;
    try {
      const res = await ListAPI.createList({ boardId: id, name: newListName });
      setLists(prev => [...prev, res.data]);
      setNewListName("");
      showToast.success("List Added");
    } catch {
      showToast.error("Failed to add List");
    }
  };

  const handleAddCard = async (listId) => {
    if (!newCardTitle.trim()) return;
    try {
      const res = await CardAPI.createCard({ title: newCardTitle, listId });
      setCards(prev => ({
        ...prev,
        [listId]: [...(prev[listId] || []), res.data]
      }));
      setNewCardTitle("");
      showToast.success("Card added");
    } catch {
      showToast.error("Failed to add card");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Board {id}</Typography>

      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", overflowX: "auto" }}>
          {lists.map(list => (
            <Droppable droppableId={list.id.toString()} key={list.id} type="card">
              {(provided) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{ width: 250, p: 2, minHeight: 200 }}
                >
                  {/* List header */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {editingList === list.id ? (
                      <>
                        <TextField
                          value={list.name}
                          onChange={(e) => setLists(prev => prev.map(l => l.id === list.id ? { ...l, name: e.target.value } : l))}
                          size="small"
                        />
                        <Button onClick={() => handleListNameSave(list)}>Save</Button>
                      </>
                    ) : (
                      <>
                        <Typography variant="h6">{list.name}</Typography>
                        <Box>
                          <Button onClick={() => setEditingList(list.id)} size="small">Edit</Button>
                          <IconButton onClick={() => handleDeleteList(list.id)} size="small"><Delete /></IconButton>
                        </Box>
                      </>
                    )}
                  </Box>

                  {/* Cards */}
                  {cards[list.id]?.map((card, index) => (
                    <Draggable draggableId={card.id.toString()} index={index} key={card.id}>
                      {(provided) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ mt: 1, p: 1, bgcolor: "#eee" }}
                        >
                          {editingCardId === card.id ? (
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <TextField
                                value={card.title}
                                onChange={(e) =>
                                  setCards(prev => ({
                                    ...prev,
                                    [list.id]: prev[list.id].map(c => c.id === card.id ? { ...c, title: e.target.value } : c)
                                  }))
                                }
                                size="small"
                              />
                              <Button
                                onClick={async () => {
                                  try {
                                    await CardAPI.updateCard(card.id, { title: card.title });
                                    setEditingCardId(null);
                                    showToast.success("Card Updated");
                                  } catch {
                                    showToast.error("Failed to update card");
                                  }
                                }}
                              >
                                Save
                              </Button>
                            </Box>
                          ) : (
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography>{card.title}</Typography>
                              <Box>
                                <Button size="small" onClick={() => setEditingCardId(card.id)}>Edit</Button>
                                <IconButton
                                  size="small"
                                  onClick={async () => {
                                    try {
                                      await CardAPI.deleteCard(card.id);
                                      setCards(prev => ({
                                        ...prev,
                                        [list.id]: prev[list.id].filter(c => c.id !== card.id)
                                      }));
                                      showToast.info("Card Deleted");
                                    } catch {
                                      showToast.error("Failed to delete card");
                                    }
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          )}
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {/* Add new card input */}
                  <Box sx={{ mt: 1 }}>
                    <TextField
                      size="small"
                      placeholder="New Card"
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      fullWidth
                    />
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => handleAddCard(list.id)}
                    >
                      Add Card
                    </Button>
                  </Box>
                </Paper>
              )}
            </Droppable>
          ))}

          {/* Add New List */}
          <Paper sx={{ width: 250, p: 2, minHeight: 200, display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              placeholder="New List Name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              size="small"
            />
            <Button variant="contained" onClick={handleAddList}>Add List</Button>
          </Paper>
        </Box>
      </DragDropContext>
    </Container>
  );
};

export default BoardViewPage;
