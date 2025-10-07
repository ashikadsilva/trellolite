package com.ashika.trellolite.controller;

import com.ashika.trellolite.entity.ListEntity;
import com.ashika.trellolite.service.ListEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lists")
@RequiredArgsConstructor
public class ListEntityController {

    private final ListEntityService listEntityService;

    @GetMapping
    public List<ListEntity> getLists(@RequestParam Long listId) {
        return listEntityService.getLists(listId);
    }

    @PostMapping
    public ListEntity createLists(@RequestBody ListEntity listEntities) {
        return listEntityService.createLists(listEntities);
    }

    @PutMapping("/{id}")
    public ListEntity updateLists(@PathVariable Long id, @RequestBody ListEntity listEntities) {
        return listEntityService.updateLists(id, listEntities);
    }

    @DeleteMapping("/{id}")
    public void deleteLists(@PathVariable Long id) {
        listEntityService.deleteLists(id);
    }
}