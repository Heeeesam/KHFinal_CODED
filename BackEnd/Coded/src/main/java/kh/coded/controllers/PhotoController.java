package kh.coded.controllers;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import kh.coded.services.ThumbNailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import kh.coded.dto.MemberDTO;
import kh.coded.dto.PhotoDTO;
import kh.coded.dto.Role;
import kh.coded.security.JwtProvider;
import kh.coded.services.PhotoService;

@RequestMapping("/photo/")
@RestController
public class PhotoController {

    @Autowired
    private PhotoService photoService;
    @Autowired
    private JwtProvider jwtProvider;
    @Autowired
    private ThumbNailService thumbNailService;

    // 사진 입력 전용 메소드
    // 어떤 파라미터를 넘기냐에 따라 각각 해당 컬럼으로 값을 넣고 나머지 값은 null로 고정
    // axios로 넘길 시, 파일과 해당 컬럼 값만 파라미터로 넘겨주면 사용 가능
    @PostMapping("insertPhoto")
    public ResponseEntity<?> insertPhoto(
            @RequestParam(value = "userNo", required = false, defaultValue = "0") int userNo,
            @RequestParam(value = "feedPostId", required = false, defaultValue = "0") int feedPostId,
            @RequestParam("files") List<MultipartFile> files,
            HttpServletRequest request
    ) throws Exception{
            Map<String, Integer> map = new HashMap<>();
            map.put("userNo", userNo);
            map.put("feedPostId", feedPostId);
            String realPath = request.getServletContext().getRealPath("images");
            photoService.insertPhoto(realPath, files, map);
            return ResponseEntity.ok().body("success");
    }

    @PostMapping("updatePhoto")
    public ResponseEntity<?> updatePhoto(
            @RequestParam(value = "userNo", required = false, defaultValue = "0") int userNo,
            @RequestParam(value = "feedPostId", required = false, defaultValue = "0") int feedPostId,
            @RequestParam("files") List<MultipartFile> files,
            HttpServletRequest request
    ) {
        try {
            Map<String, Integer> map = new HashMap<>();
            map.put("userNo", userNo);
            map.put("feedPostId", feedPostId);
            String realPath = request.getServletContext().getRealPath("images");

            photoService.updatePhoto(realPath, files, map);

            System.out.println(request.getServletContext().getRealPath("images"));
            return ResponseEntity.ok().body(null);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("testedBySelectPhoto")
    public ResponseEntity<?> testedBySelectPhoto() {
        List<PhotoDTO> list = photoService.testedBySelectPhoto();
        return ResponseEntity.ok().body(list);
    }
    
    @GetMapping("feedpost")
    public ResponseEntity<?> selectFeedPostPhoto(
    		@RequestParam(value="feedPostId") int feedPostId
    		){
    	List<PhotoDTO> list = photoService.selectByFeedpostId(feedPostId);
    	return ResponseEntity.ok().body(list);
    }
    
    @GetMapping("dm")
    public ResponseEntity<?> selectDMPhoto(
    		@RequestHeader(value="authorization") String authorization,
    		@RequestParam(value="messageId") int messageId
    		){
    	if (authorization.length() > 7) {
			String accessToken = authorization.substring("Bearer ".length(), authorization.length());
			if (jwtProvider.validateToken(accessToken)) {
				List<PhotoDTO> data = photoService.selectByMessageId(messageId);
				return ResponseEntity.ok().body(data);
			}
		}
		return ResponseEntity.badRequest().body("유효하지 않은 헤더입니다.");
    }

    @PostMapping("/insertChatPhoto")
    public ResponseEntity<?> insertChatPhoto(
            List<MultipartFile> files,
            HttpServletRequest request
    ) throws Exception{
        System.out.println(files);
        String realPath = request.getServletContext().getRealPath("images");
        int messageId = photoService.insertChatPhoto(realPath,files);
        return ResponseEntity.ok().body(messageId);
    }

    /**
     * 썸네일 이미지 리사이징 구현
     * 이미지 파일의 src 속성을 해당 엔드포인트로 수정 시 이미지 리사이징
     */
    @GetMapping("/images/{fileName}")
    public ResponseEntity<byte[]> getThumbNail(@PathVariable("fileName") String fileName) throws Exception {
            byte[] image = thumbNailService.getThumbNail(fileName);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG);
            headers.setCacheControl("max-age=1800");
            return ResponseEntity.ok().headers(headers).body(image);
    }

}
//    @PostMapping("/removeFile")
//    public ResponseEntity<Boolean> removeFile(String fileName){
//
//        String srcFileName = null;
//
//        try{
//            srcFileName = URLDecoder.decode(fileName,"UTF-8");
//            //UUID가 포함된 파일이름을 디코딩해줍니다.
//            File file = new File(uploadPath +File.separator + srcFileName);
//            boolean result = file.delete();
//
//            File thumbnail = new File(file.getParent(),"s_"+file.getName());
//            //getParent() - 현재 File 객체가 나태내는 파일의 디렉토리의 부모 디렉토리의 이름 을 String으로 리턴해준다.
//            result = thumbnail.delete();
//            return new ResponseEntity<>(result,HttpStatus.OK);
//        }catch (UnsupportedEncodingException e){
//            e.printStackTrace();
//            return new ResponseEntity<>(false,HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

