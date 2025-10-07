package com.ashika.trellolite.service;

import com.ashika.trellolite.entity.ListEntity;
import com.ashika.trellolite.repository.ListEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListEntityService {

    private final ListEntityRepository listEntityRepo;

    public List<ListEntity> getLists(Long boardId) {
        return listEntityRepo.findByBoardIdOrderByPosition(boardId);
    }

    public ListEntity createLists(ListEntity card) {
        return listEntityRepo.save(card);
    }
    public ListEntity updateLists(Long id, ListEntity card) {
        ListEntity existing = listEntityRepo.findById(id).orElseThrow();
        existing.setName(card.getName());
        return listEntityRepo.save(existing);
    }
    public void deleteLists(Long id) {
        listEntityRepo.deleteById(id);
    }
}
