import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BoardAPI } from "../services/api";
import { BoardContext } from "../context/BoardContext";
import { Container, Card, CardContent, Typography, Grid } from "@mui/material";

const BoardsPage = () => {
  const { boards, setBoards, setCurrentBoard } = useContext(BoardContext);
  const navigate = useNavigate();

  useEffect(() => {
    BoardAPI.getBoards(1).then(res => setBoards(res.data));
  }, [setBoards]);

  const openBoard = (board) => {
    setCurrentBoard(board);
    navigate(`/boards/${board.id}`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Your Boards</Typography>
      <Grid container spacing={2}>
        {boards.map(board => (
          <Grid item key={board.id} xs={12} sm={6} md={3}>
            <Card
              onClick={() => openBoard(board)}
              sx={{ cursor: "pointer", "&:hover": { boxShadow: 6 } }}
            >
              <CardContent>
                <Typography variant="h6">{board.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BoardsPage;
