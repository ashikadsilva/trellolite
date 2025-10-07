package com.ashika.trellolite.service;

import com.ashika.trellolite.entity.Board;
import com.ashika.trellolite.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepo;

    public List<Board> getBoards(Long userId) {
        return boardRepo.findByUserId(userId);
    }

    public Board createBoard(Board board) {
        return boardRepo.save(board);
    }

    public Board updateBoard(Long id, Board board) {
        Board existing = boardRepo.findById(id).orElseThrow();
        existing.setName(board.getName());
        return boardRepo.save(existing);
    }

    public void deleteBoard(Long id) {
        boardRepo.deleteById(id);
    }
}