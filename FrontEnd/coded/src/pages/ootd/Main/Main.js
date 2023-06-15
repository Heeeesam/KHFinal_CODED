import React, { Component } from 'react';
import NavbarOotd from '../../../component/Navbar/NavbarOotd/NavbarOotd';
import CardList from './CardList.scss';
import Modal from './Modal';
// import InfiniteScroll from 'react-infinite-scroller';
import style from './Main.module.scss';

const API = 'http://';
const LIMIT = 100;
class Main extends Component {
  constructor() {
    super();
    this.state = {
      likeBtn: false,
      cards: [],
      getData: '',
      commentData: [],
      modalData: [],
      offSet: 0,
      isLoading: false,
    };
  }

  openModal = (data) => {
    this.setState({
      isModal: data,
    });
  };

  closeModal = () => {
    this.setState({
      isModal: false,
      modalData: [],
    });
  };

  componentDidMount() {
    window.addEventListener('scroll', this.infiniteScroll);
    fetch(`${API}/ootds?offset=${this.state.offSet}&limit=${LIMIT}`)
      .then((res) => res.json())
      .then((res) =>
        this.setState({
          cards: res.ootd_list,
          offSet: this.state.offSet + LIMIT,
        }),
      );
  }

  // loadFunc = () => {
  //   fetch(`${API}/ootds?offset=${this.state.offSet}&limit=${LIMIT}`)
  //   .then((res) => res.json())
  //   .then((res) => {
  //     this.setState({
  //     cards: [...this.state.cards, ...res.ootd_list],
  //     offSet: this.state.offSet + LIMIT,
  //   });
  //   })
  // }

  getData = (data) => {
    this.setState({
      getData: data,
    });
  };

  modalData = () => {
    this.setState({
      commentData: this.state.getData,
    });
  };

  handleModalData = (data) => {
    this.setState({
      modalData: data,
    });
  };

  render() {
    console.log(this.state.offSet);
    const { cards, isModal, modalData, commentData, getData } = this.state;
    return (
      <div style={{ overflow: 'auto' }}>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadFunc}
          hasMore={true || false}
          loader={<div className="loader" key={0} />}
          useWindow={false}
        >
          <NavbarOotd />
          <div className="mainWrapper">
            <CardList
              key={cards.id}
              commentData={commentData}
              getModalInputComment={getData}
              isModal={this.openModal}
              modalData={this.handleModalData}
              cardsData={cards}
              handleClickLike={this.handleClickLike}
            />
          </div>
          <div>
            <div className="infiniteScrollTarget">
              <input type="text" alt="target" value="target"></input>
            </div>
          </div>
          <div className={isModal ? '' : 'displayNone'}>
            <Modal
              modalData={modalData}
              getData={this.getData}
              commentData={this.commetData}
              closeModal={this.closeModal}
              key={cards.id}
              id={cards.id}
              contentImg={cards?.contentImg}
              authorImg={cards?.authorImg}
              author={cards?.author}
              date={cards?.date}
              hashtag={cards?.hashtag}
              description={cards?.description}
              follower={cards?.follower}
              commentNum={cards?.commentNum}
              scrap={cards?.scrap}
            />
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}
export default Main;