package kh.coded.securityconfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import kh.coded.security.CustomAccessDeniedHandler;
import kh.coded.security.CustomAuthenticationEntryPoint;
import kh.coded.services.MemberService;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
	
//	@Autowired
//	private OAuth2UserService oAuth2UserService;
//	@Autowired
//	private MemberAuthenticationProvider memberAuthenticationProvider;
	@Autowired
	private MemberService memberService;
	@Autowired
	private CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
	@Autowired
	private CustomAccessDeniedHandler customAccessDeniedHandler;
	//@Autowired
	//private OAuth2AuthorizationRequestBasedOnCookieRepository oAuth2AuthorizationRequestBasedOnCookieRepository;
//	@Autowired
//	private OAuth2SuccessHandler oAuth2SuccessHandler;
	//@Autowired
	//private OAuth2FailureHandler oAuth2FailureHandler;
	@Autowired
	private JwtAuthenticationFilter jwtAuthenticationFilter;
	
	private final String[] WEB_IGNORING_LIST = {
			"/static/**",
			"/resources/**",
			"/css/**",
			"/vendor/**",
			"/js/**" ,
			"/img/**",
			"/favicon.ico",
			"/error",
	};
	private final String[] API_WHITE_LIST = {
			"/index.html",
			"/",
			"/images/**",
			"/manifest.json",
			"/logo192.png",

			//pages
			"/login",
			"/register",
			"/feedList",
			"/profile",
			"/DMPage",
			"/ootd",
			"/weekly",
			"/myPickPage",
			"/FileUploadTest",
			"/DMPage",
			"/DMList",
			"/error",
			"/HomePage",
			"/Admin/**",


			"/searchBox",
			"/TestComponent",
			"/test/feedComment",
			"/test/FeedInsert",
			"/test/follow",
			"/test/TodayAndAdForm",

			"/auth/userNo",
			//"/feedList/**",
			//"/feedpost/**",
			//"/HomePage/**",
			"/feepost",
			"/weather/today",
			"/weather/weekly",
			"/auth/member",
			"/auth/login",
			"/auth/userNo",
			"/auth/getAddress1List",
			"/auth/getAddress2List",
			"/auth/refresh",
			"/auth/isMember",
			"/auth/isMemberByEmail",
			"/auth/oauth/**",
			"/auth/memberIdByEmail",
			"/auth/send-mail/pw",
			"/login/oauth2/**",
			"/feedPost/comment/**", //얘들은 단순 select임.
			"/weather/todayNonMem",
			"/auth/selectUserListWithProfile",
			"/PostHashs/selectAllPostTagNames",
			"/feedpost/selectAllFeedPost/",
			"/feedpost/likeCount",
			"/feedpost/hashtagList",
			"/photo/insertPhoto",
			"/PostHashs/selectAllPostTagNames",
			"/feedpost/selectSearchHashFeedList/**",
			"/feedpost/selectPopularFeedPost",

			"/feedpost/selectfeedlist/",
			"/auth/selectUserList",
			"/photo/testedBySelectPhoto",
			"/feedpost/comment/**",
			"/photo/feedpost",
			"/auth/updateMemberByUserNo",
			"/photo/updatePhoto",
			"/feedpost/selectUserFeedPost",
			"/auth/selectMyPickPageData",
			"/feedpost/updatefeed",
			"/test.jpg",
			"/feedpost/feedpost",
			"/ws/**",
			"/ReportOk",
			"/app/**",

			"/follow/selectfollowinglist",
			"/follow/selectfollowerlist",
			"/feedpost/selectOneFeedPost",
			"/follow/handleFollow",
			"/feedReport/insertReport",
			"/feedList/search",
			"/coded.ico",
			"/feedpost/insertFeedPost",
			"/follow/isfollow",
			"/feedpost/isScrap",
			"/auth/logout",
			"/photo/insertChatPhoto",
			"/feedPopularList",
			"/photo/images/**",
	};
	private final String[] API_USER_LIST = {
			"/weather/**",
			
			"/auth/logout",
			"/auth/userDTO",
			"/auth/userNo",
			"/auth/kakaoUnlink",
			"/auth/naverUnlink",
			"/auth/googleUnlink",
			"/auth/kakaoToken",
			"/auth/naverToken",
			"/auth/googleToken",
			"/auth/userWithProfileDTO",
			"/auth/updatePwAfterPwCheck",
			"/auth/deleteMemberWithoutId",

			"/feedpost/insertFeedLike",
			"/feedpost/isLike",
			"/feedpost/isScrap",
			"/feedpost/insertFeedScrap",
			"/feedpost/selectFollowingFeedPost",
			"/feedpost/selectScrapFeedPost",
			"/feedpost/comment",
			"/feedpost/nestedComment",
			"/feedpost/comment/like",
			"/feedpost/deleteFeedPost",
			
			"/mypick/selectMember",
			"/mypick/selectFeedPost",
			
			"/photo/dm",
			
			"v/**",
			"/DM/**",
			"/topic/**",
			"/ws/**",
			
	};
	private final String[] API_ADMIN_LIST = {
			"/feedReport/report",
			"/feedReport/feed",
			"/feedpost/getNaviInfo",
			"/auth/getNaviInfo",
			"/auth/pagingMember",
			"/auth/getNaviInfo/id",
			"/auth/pagingMember/id",
			"/auth/getNaviInfo/nickName",
			"/auth/pagingMember/nickName",
			"/auth/getNaviInfo/role",
			"/auth/pagingMember/role",
			"/auth/getNaviInfo/email",
			"/auth/pagingMember/email",
			"/auth/deleteMemberByAdmin",
			"/auth/getUserByUserNo",
			"/auth/isAdmin",
			"/feedpost/getNaviInfo/userNo",
			"/DM/naviInfo",
			"/DM/pagingList",
			"/DM/naviInfo/userNo",
			"/DM/pagingList/userNo",
			"/DM/getRoomByRoomId",
			"/DM/deleteRoom",
	};
	
//	@Autowired
//	public void configure(AuthenticationManagerBuilder auth) throws Exception{
//		auth.authenticationProvider(memberAuthenticationProvider);
//	}
	
	@Bean
	public WebSecurityCustomizer configure() {
		return (web) -> web.ignoring()
					.requestMatchers(WEB_IGNORING_LIST);

	}
	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
		
		http.csrf(csrf->csrf.disable());
		http.cors(cors->cors.disable());
		
		http.formLogin(login -> login.disable());
		http.logout(logout -> logout.disable());
		http.httpBasic(basic -> basic.disable());
		http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		
		http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
		
		http.authorizeHttpRequests(authorize ->{
			try {
				authorize
					.requestMatchers(API_WHITE_LIST).permitAll()
					.requestMatchers(API_USER_LIST).hasRole("USER")
					.requestMatchers(API_ADMIN_LIST).hasRole("ADMIN")
					.anyRequest().authenticated();
			}catch(Exception e) {
				throw new RuntimeException(e);
			}			
		});
		
		http.exceptionHandling(exception -> {
			try {
				exception
					.authenticationEntryPoint(customAuthenticationEntryPoint)
					.accessDeniedHandler(customAccessDeniedHandler);
					
			}catch(Exception e) {
				throw new RuntimeException(e);
			}			
		});
		
//		http.oauth2Login(login -> {
//			try {
//				login
//					//.authorizationEndpoint(authorize -> authorize.baseUri("/auth/ouath/authorize"))
//					//.redirectionEndpoint(redirect -> redirect.baseUri("/auth/ouath/callback/*"))
//					.authorizationEndpoint(authorize ->
//											authorize
//												.baseUri("/auth/oauth/")
//												//.authorizationRequestRepository(oAuth2AuthorizationRequestBasedOnCookieRepository)
//												)
//					.redirectionEndpoint(redirect ->
//											redirect.baseUri("/auth/oauth/**")
//											);
////					.userInfoEndpoint(endpoint -> endpoint.userService(oAuth2UserService))
////					.successHandler(oAuth2SuccessHandler);
//					//.failureHandler(oAuth2FailureHandler);
//			}catch(Exception e) {
//				throw new RuntimeException(e);
//			}
//		});
		
//		http.oauth2Login(login ->{
//		try {
//			login
//				.loginPage(loginPage)
//				.failureUrl(loginPage)
//				.userInfoEndpoint((endpoint) ->
//										endpoint.userService(oAuth2UserService)
//									);
//		}catch(Exception e) {
//			throw new RuntimeException(e);
//		}
//	});
		
//		http.rememberMe(rememberMe -> 
//							rememberMe
//								.key("myKey")
//								.tokenValiditySeconds(60 * 60 * 24 * 7)
//								.userDetailsService(memberService)
//								.rememberMeParameter("remember-me")
//		);
		
		//한 계정 당 하나의 로그인 유지만 가능하도록 하는 설정임.
		//http.sessionManagement(session -> session.maximumSessions(1).maxSessionsPreventsLogin(true));
		
		
		return http.build();
	}
	
	@Bean
	public AuthenticationManager authenticationManager(
			HttpSecurity http,
			PasswordEncoder passwordEncoder,
			UserDetailsService userDetailsService)
					throws Exception{
		
		return http.getSharedObject(AuthenticationManagerBuilder.class)
					.userDetailsService(userDetailsService)
					.and()
					.build();
	}
	
}
