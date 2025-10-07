package com.ashika.trellolite.service;

import com.ashika.trellolite.entity.Card;
import com.ashika.trellolite.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepo;
    public List<Card> getCards(Long listId) {
        return cardRepo.findByListIdOrderByPositionAsc(listId);
    }

    public Card createCard(Card card) {
        return cardRepo.save(card);
    }

    public Card updateCard(Long id, Card card) {
        Card existing = cardRepo.findById(id).orElseThrow();
        existing.setTitle(card.getTitle());
        return cardRepo.save(existing);
    }

    public void deleteCard(Long id) {
        cardRepo.deleteById(id);
    }
}
