import axios from 'axios';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { styled } from 'styled-components';
import FeedPostDetail from '../FeedPostDetail/FeedPostDetail';
import Masonry from 'react-masonry-component';
import NoticeBar from './NoticeBar';
import NoneSearchedBar from './NoneSearchedBar';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIndexFollowing,
  setIndexHot,
  setIndexNew,
  setIndexOOTD,
  setIndexScrap,
  setNonMember,
} from '../../modules/Redux/navbarSetting';

// 벽돌형 리스트 출력을 위해 react-masonry-component를 사용
// masonry의 옵션 세팅
const masonryOptions = {
  // 내부 요소들 선택자 지정
  itemSelector: '.grid-item',
  // 열 사이 간격
  gutter: 30,

  // 출력 순서 => 가로 방향 우선
  horizontalOrder: true,

  // 요소 내 가로 사이즈 동일
  isEqualSize: true,
  fitWidth: true,
};

const FeedPostOuter = styled('div')`
  margin: auto;
  width: 85%;
  display: flex;
  justify-content: center;
  border: 0px;
  padding: 20px;

  .my-masonry-grid {
    width: 100%;
    border: 0px;
  }
  .grid-item {
    // 행 사이 간격
    margin-bottom: 30px;
    border: 0px;
    width: 250px;
  }
`;

function FeedList({ type }) {
  const [feedPost, setFeedPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scrollWait, setScrollWait] = useState(true);
  const feedPostOuterRef = useRef(null);
  const cpage = useRef(1);
  const [pageLoading, setPageLoading] = useState(false);
  const [isOverPaging, setIsOverPaging] = useState(false);

  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.member.access);
  const denyAccess = useCallback(() => dispatch(setNonMember()), [dispatch]);

  const onNavbarIndexHot = useCallback(
    () => dispatch(setIndexHot()),
    [dispatch],
  );
  const onNavbarIndexNew = useCallback(
    () => dispatch(setIndexNew()),
    [dispatch],
  );
  const onNavbarIndexFollowing = useCallback(
    () => dispatch(setIndexFollowing()),
    [dispatch],
  );
  const onNavbarIndexScrap = useCallback(
    () => dispatch(setIndexScrap()),
    [dispatch],
  );
  const onNavbarIndexOOTD = useCallback(
    () => dispatch(setIndexOOTD()),
    [dispatch],
  );

  useEffect(() => {
    onNavbarIndexOOTD();
    if (type === 'recent') {
      onNavbarIndexNew();
    } else if (type === 'popular') {
      onNavbarIndexHot();
    } else if (type === 'following') {
      onNavbarIndexFollowing();
    } else if (type === 'scrap') {
      onNavbarIndexScrap();
    }
  }, []);

  // 현재 위치 (현재 페이지) 별 피드 리스트 출력
  useEffect(() => {
    addFeedList();
    return () => {
      window.onscroll = null;
    };
  }, [accessToken]);

  const addFeedList = () => {
    if (!pageLoading && !isOverPaging) {
      setPageLoading(true);
      if (type === 'recent') {
        axios({
          method: 'GET',
          url: '/feedpost/selectAllFeedPost/',
          params: {
            cpage: cpage.current,
          },
        })
          .then((resp) => {
            setFeedPost((prev) => [...prev, ...resp.data]);
            cpage.current = cpage.current + 1;
            setPageLoading(false);
            resp.data && resp.data.length == 0 && setIsOverPaging(true);
          })
          .catch((error) => {
            console.log(error);
            setPageLoading(false);
          });
      } else if (type === 'popular') {
        axios({
          method: 'get',
          url: '/feedpost/selectPopularFeedPost',
          params: {
            cpage: cpage.current,
          },
        })
          .then((response) => {
            setFeedPost((prev) => [...prev, ...response.data]);
            cpage.current = cpage.current + 1;
            setPageLoading(false);
            resp.data && resp.data.length == 0 && setIsOverPaging(true);
          })
          .catch((error) => {
            console.log(error);
            setPageLoading(false);
          });
      } else if (type === 'following' || type === 'scrap') {
        if (accessToken) {
          if (type === 'following') {
            axios({
              method: 'get',
              url: '/feedpost/selectFollowingFeedPost',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              params: {
                cpage: cpage.current,
              },
            })
              .then((response) => {
                setFeedPost((prev) => [...prev, ...response.data]);
                cpage.current = cpage.current + 1;
                setPageLoading(false);
                resp.data && resp.data.length == 0 && setIsOverPaging(true);
              })
              .catch((error) => {
                console.log(error);
                setPageLoading(false);
              });
          } else if (type === 'scrap') {
            axios({
              method: 'get',
              url: '/feedpost/selectScrapFeedPost',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              params: {
                cpage: cpage.current,
              },
            })
              .then((response) => {
                setFeedPost((prev) => [...prev, ...response.data]);
                cpage.current = cpage.current + 1;
                setPageLoading(false);
                resp.data && resp.data.length == 0 && setIsOverPaging(true);
              })
              .catch((error) => {
                console.log(error);
                setPageLoading(false);
              });
          }
        } else {
          // denyAccess();
          setPageLoading(false);
        }
      }
    }
  };

  // window.innerHeight 실제 보이는 창의 높이
  // window.scrollY 페이지 상단에서부터 스크롤된 값
  // document.body.offsetHeight 페이지 전체 총 높이
  window.onscroll = function () {
    if (
      !pageLoading &&
      window.innerHeight + window.scrollY + 20 >=
      document.body.offsetHeight
    ) {
      addFeedList();
    }
  };

  return (
    <FeedPostOuter ref={feedPostOuterRef}>
      {feedPost.length > 0 ? (
        <Masonry className={'my-masonry-grid'} options={masonryOptions}>
          {feedPost.map((e, i) => (
            <div className="grid-item" key={i}>
              <FeedPostDetail index={i} feedPost={e}></FeedPostDetail>
            </div>
          ))}
        </Masonry>
      ) : (
        <NoneSearchedBar />
      )}
    </FeedPostOuter>
  );
}

export default FeedList;
