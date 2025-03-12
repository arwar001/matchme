package com.kood.match.Controller;

import com.kood.match.DTO.FilterMatch;
import com.kood.match.Entity.User;
import com.kood.match.Service.MatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/match")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @PostMapping
    public ResponseEntity<List<User>> getMatchFromFilter(@RequestBody FilterMatch filter, @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(matchService.getMatchFromFilter(filter, email));
    }

}
