package com.solvr.backend.revisionengine.scheduler;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class RevisionScheduler {

    public LocalDateTime calculateNextRevision(int revisionCount, LocalDateTime fromDate) {

        int days;

        switch (revisionCount) {

            case 0:
                days = 1;
                break;

            case 1:
                days = 3;
                break;

            case 2:
                days = 7;
                break;

            case 3:
                days = 14;
                break;

            default:
                days = 30;
        }

        return fromDate.plusDays(days);
    }
}