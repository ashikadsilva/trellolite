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
import { Delete, Edit } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const BoardViewPage = () => {
  const { id } = useParams();
  const { lists, setLists, cards, setCards } = useContext(BoardContext);
  const [editingList, setEditingList] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [editingCardId, setEditingCardId] = useState(null);
  const [newCardTitles, setNewCardTitles] = useState({});
  const [editingCardTitles, setEditingCardTitles] = useState({});

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

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceListId = source.droppableId;
    const destListId = destination.droppableId;

    const updatedSource = [...(cards[sourceListId] || [])];
    const [movedCard] = updatedSource.splice(source.index, 1);

    if (sourceListId === destListId) {
      updatedSource.splice(destination.index, 0, movedCard);
      setCards(prev => ({ ...prev, [sourceListId]: updatedSource }));
    } else {
      const updatedDest = [...(cards[destListId] || [])];
      movedCard.listId = parseInt(destListId);
      updatedDest.splice(destination.index, 0, movedCard);

      setCards(prev => ({
        ...prev,
        [sourceListId]: updatedSource,
        [destListId]: updatedDest,
      }));
    }

    try {
      const payload = [
        ...(cards[sourceListId]?.map((c, index) => ({ ...c, position: index })) || []),
        ...(cards[destListId]?.map((c, index) => ({ ...c, position: index })) || []),
      ];
      await CardAPI.reorderCards(payload);
      await CardAPI.updateCard(draggableId, { listId: destListId });
    } catch {
      showToast.error("Failed to save card reorder");
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
      showToast.success("List deleted");
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
    const title = newCardTitles[listId]?.trim();
    if (!title) return;
    try {
      const res = await CardAPI.createCard({ title, listId });
      setCards(prev => ({
        ...prev,
        [listId]: [...(prev[listId] || []), res.data]
      }));
      setNewCardTitles(prev => ({ ...prev, [listId]: "" }));
      showToast.success("Card added");
    } catch {
      showToast.error("Failed to add card");
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        mt: 2,
        p: 3,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        marginTop:"0px"
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: "#fff" }}>
        Board {id}
      </Typography>

      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "flex-start",            
            paddingBottom: "99px !important",
            overflowX: "auto",
            pb: 2,
            "&::-webkit-scrollbar": {
              height: 8,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255,255,255,0.5)",
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "rgba(255,255,255,0.8)",
            },
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.5) transparent",
          }}
        >
          {lists.map(list => (
            <Droppable droppableId={list.id.toString()} key={list.id} type="card">
              {(provided) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    width: 280,
                    p: 2,
                    minHeight: 250,
                    bgcolor: "#f4f5f7",
                    borderRadius: 3,
                    boxShadow: 4,
                    display: "flex",
                    flexDirection: "column",
                    flexShrink: 0,
                  }}
                >
                  {/* List header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                      p: 1,
                      bgcolor: "#eceff1",
                      borderRadius: 2,
                    }}
                  >
                    {editingList === list.id ? (
                      <>
                        <TextField
                          value={list.name}
                          onChange={(e) =>
                            setLists(prev =>
                              prev.map(l => l.id === list.id ? { ...l, name: e.target.value } : l)
                            )
                          }
                          size="small"
                          sx={{ flexGrow: 1, bgcolor: "#fff", borderRadius: 1 }}
                        />
                        <Button size="small" onClick={() => handleListNameSave(list)}>Save</Button>
                      </>
                    ) : (
                      <>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{list.name}</Typography>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => setEditingList(list.id)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteList(list.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </>
                    )}
                  </Box>

                  {/* Cards */}
                  {cards[list.id]?.map((card, index) => (
                    <Draggable draggableId={card.id.toString()} index={index} key={card.id}>
                      {(provided, snapshot) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            mt: 1,
                            p: 1.5,
                            bgcolor: snapshot.isDragging ? "#e3f2fd" : "#fff",
                            borderRadius: 2,
                            boxShadow: snapshot.isDragging ? 6 : 2,
                            cursor: "grab",
                            transition: "all 0.2s ease",
                            position: "relative",
                            "&:hover": { transform: "translateY(-2px)", boxShadow: 4 },
                          }}
                        >
                          {editingCardId === card.id ? (
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <TextField
                                value={editingCardTitles[card.id] ?? card.title}
                                onChange={(e) =>
                                  setEditingCardTitles(prev => ({ ...prev, [card.id]: e.target.value }))
                                }
                                size="small"
                                fullWidth
                              />
                              <Button
                                size="small"
                                variant="contained"
                                onClick={async () => {
                                  try {
                                    const newTitle = editingCardTitles[card.id];
                                    await CardAPI.updateCard(card.id, { title: newTitle });
                                    setCards(prev => ({
                                      ...prev,
                                      [list.id]: prev[list.id].map(c =>
                                        c.id === card.id ? { ...c, title: newTitle } : c
                                      )
                                    }));
                                    setEditingCardId(null);
                                    setEditingCardTitles(prev => {
                                      const copy = { ...prev };
                                      delete copy[card.id];
                                      return copy;
                                    });
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
                            <>
                              <Typography sx={{ wordBreak: "break-word" }}>
                                {card.title}
                              </Typography>
                              {/* Hover-only actions */}
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 4,
                                  right: 4,
                                  display: "flex",
                                  gap: 1,
                                  opacity: 0,
                                  transition: "opacity 0.2s",
                                  "&:hover": { opacity: 1 },
                                }}
                                className="card-actions"
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => setEditingCardId(card.id)}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
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
                            </>
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
                      value={newCardTitles[list.id] || ""}
                      onChange={(e) => setNewCardTitles(prev => ({ ...prev, [list.id]: e.target.value }))}
                      fullWidth
                      sx={{ bgcolor: "#fff", borderRadius: 2 }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      sx={{ mt: 1, borderRadius: 2 }}
                      onClick={() => handleAddCard(list.id)}
                    >
                      + Add Card
                    </Button>
                  </Box>
                </Paper>
              )}
            </Droppable>
          ))}

          {/* Add New List */}
          <Paper
            sx={{
              width: 280,
              p: 2,
              minHeight: 250,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              bgcolor: "#f4f5f7",
              borderRadius: 3,
              boxShadow: 4,
              flexShrink: 0
            }}
          >
            <TextField
              placeholder="New List Name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              size="small"
              fullWidth
              sx={{ bgcolor: "#fff", borderRadius: 2 }}
            />
            <Button
              variant="contained"
              size="small"
              fullWidth
              sx={{ mt: 1, borderRadius: 2 }}
              onClick={handleAddList}
            >
              + Add List
            </Button>
          </Paper>
        </Box>
      </DragDropContext>
    </Container>
  );
};

export default BoardViewPage;