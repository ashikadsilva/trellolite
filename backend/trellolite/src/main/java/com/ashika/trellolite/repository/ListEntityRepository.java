package com.ashika.trellolite.repository;

import com.ashika.trellolite.entity.ListEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListEntityRepository extends JpaRepository<ListEntity, Long> {
    List<ListEntity> findByBoardIdOrderByPosition(Long boardId);
}
