package kh.coded.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kh.coded.dto.FeedPostDTO;
import kh.coded.dto.HashTagDTO;
import kh.coded.dto.MemberDTO;
import kh.coded.dto.PhotoDTO;
import kh.coded.dto.PostHashsDTO;
import kh.coded.services.FeedPostService;
import kh.coded.services.MemberService;

@RestController
@RequestMapping("/feedpost/")
public class FeedPostController {

	@Autowired
	private FeedPostService feedpostService;

	@Autowired
	private MemberService memberService;

	@GetMapping(value = "feedpost") // 마이 피드 리스트 - 본인이 작성한 피드 리스트 출력, 다른 유저의 마이 피드 리스트 - 다른 유저의 피드 리스트만 출력
	public ResponseEntity<?> selectNoScrollFeedList(@RequestParam(value = "userNo") int UserNo) {
		try {
			List<FeedPostDTO> list = feedpostService.selectFeedList(UserNo);
			return ResponseEntity.ok().body(list);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PutMapping(value="feedpost") // 피드 쓰기 - 피드를 작성 할 수 있는 페이지
	public ResponseEntity<?> insertFeedPost(
			@RequestParam(value="fdto") FeedPostDTO fdto,
			@RequestParam(value="hdto") HashTagDTO hdto,
			@RequestParam(value="pdto") PhotoDTO pdto) {
		try {
			Map<String, Integer> result = new HashMap<>();
			int FeedPost = feedpostService.insertFeedPost(fdto);
			int HashTag = feedpostService.insertHashTag(hdto.getHashTag());
			int FeedPhoto = feedpostService.insertFeedPhoto(pdto);
			result.put("FeedPost", FeedPost);
			result.put("HashTag", HashTag);
			result.put("FeedPhoto", FeedPhoto);
			return ResponseEntity.ok().body(result);
		}catch(Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@GetMapping("/searchById/") //유저 아이디로 검색 시 유저 정보, 피드 뽑기
	public ResponseEntity<?> selectMemberById(@RequestParam String userId) {
		MemberDTO member = memberService.selectByID(userId); 
		List<FeedPostDTO> list = feedpostService.selectFeedList(member.getUserNo());
		Map<String,Object> result = new HashMap<>();
		result.put("MemberDTO", member);
		result.put("feedlist", result);

		return ResponseEntity.ok().body(result);
	}

	@GetMapping("/searchByNickname/") //유저 닉네임으로 검색 시 유저 정보, 피드 뽑기
	public ResponseEntity<?> selectMemberByNickname(@RequestParam String userNickname) {
		MemberDTO member = memberService.selectByNickname(userNickname);
		List<FeedPostDTO> list = feedpostService.selectFeedList(member.getUserNo());
		Map<String,Object> result = new HashMap<>();
		result.put("MemberDTO", member);
		result.put("feedlist", list);

		return ResponseEntity.ok().body(result); 
	}

	@GetMapping("/searchByHashs") //해쉬태그로 검색 시 피드 뽑기
	public ResponseEntity<?> selectByHashs(@RequestParam String hashTag) {
		List<HashTagDTO> tagId = feedpostService.searchByHashs(hashTag);
		List<FeedPostDTO> feedposts = new ArrayList<>();
		
		for(HashTagDTO hashTagDTO : tagId) {
			List<PostHashsDTO> postHashs = feedpostService.seachByPostHashs(hashTagDTO.getTagId());
			
			for(PostHashsDTO dto : postHashs) {
				feedposts.add(feedpostService.searchByFeedPost(dto.getFeedPostId()));
			}
		}
			
		return ResponseEntity.ok().body(feedposts); 
	}

	@GetMapping("/selectAllFeedPost/")
	public ResponseEntity<?> selectFeedList(
			@RequestParam(value = "cpage", required = false, defaultValue = "1")
			int cpage) {
		System.out.println(cpage);
		List<FeedPostDTO> list = feedpostService.selectAllFeedPost(cpage);
		return ResponseEntity.ok().body(list);
	}

	@GetMapping("/selectfeedlist/")
	public String selectFeedList(){
		List<FeedPostDTO> list = feedpostService.selectTestFeedList();
		return "";
	}

}
