import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { ListAPI, CardAPI } from "../../services/api";
import { BoardContext } from "../../context/BoardContext";
import { Container, Typography, Paper, Box } from "@mui/material";

const BoardViewPage = () => {
  const { id } = useParams();
  const { lists, setLists, cards, setCards } = useContext(BoardContext);

  useEffect(() => {
    ListAPI.getLists(id).then(res => {
      setLists(res.data);
      const initialCards = {};
      res.data.forEach(list => {
        CardAPI.getCards(list.id).then(resp => {
          initialCards[list.id] = resp.data;
          setCards(prev => ({ ...prev, [list.id]: resp.data }));
        });
      });
    });
  }, [id, setLists, setCards]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Board {id}</Typography>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", overflowX: "auto" }}>
        {lists.map(list => (
          <Paper key={list.id} sx={{ width: 250, p: 2, minHeight: 200 }}>
            <Typography variant="h6">{list.name}</Typography>
            {cards[list.id]?.map(card => (
              <Paper key={card.id} sx={{ mt: 1, p: 1, bgcolor: "#eee" }}>
                {card.title}
              </Paper>
            ))}
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default BoardViewPage;