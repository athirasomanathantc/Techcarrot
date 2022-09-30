import * as React from 'react';
import styles from './AgiIntranetNewsDetails.module.scss';
import { IAgiIntranetNewsDetailsProps } from './IAgiIntranetNewsDetailsProps';
import { IAgiIntranetNewsDetailsState } from './IAgiIntranetNewsDetailsState';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import * as moment from 'moment';
import { LIST_COMMENTS, LIST_INTRANETCONFIG, LIST_NEWS, NEWS_NULL_ITEM, REGEX_SPEC_CHAR, ViewsJSON_NULL } from '../common/constants';
import { ICommentItem } from '../models/ICommentItem';
import { INewsItem } from '../models/INewsItem';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as _ from 'lodash';


export default class AgiIntranetNewsDetails extends React.Component<IAgiIntranetNewsDetailsProps, IAgiIntranetNewsDetailsState> {

  constructor(props: IAgiIntranetNewsDetailsProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      newsId: null,
      news: NEWS_NULL_ITEM,
      comment: '',
      reply: '',
      allComments: [],
      comments: [],
      replies: [],
      commentsCount: 0,
      viewsCount: 0,
      showReplySection: false,
      userPicture: '',
      userId: 0,
      showMoreComments: false,
      errorText: '',
      inappropriateWords: [],
      inappropriateComments: [],
      inappropriateReply: []
    }
  }

  public async componentDidMount(): Promise<void> {
    //get user profile pic url
    const userId = this.props.context.pageContext.legacyPageContext.userId;
    const userEmail = this.props.context.pageContext.legacyPageContext.userEmail;
    const profilePictureUrl = `${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L&username=${userEmail}`;
    this.setState({
      userPicture: profilePictureUrl,
      userId
    });

    const newsID = this.getQueryStringValue('newsID');

    await this.getNewsItem(newsID);
    //await this.updateViews(newsID);
    this.getIntranetConfig('Inappropriate Words');

  }

  public componentDidUpdate(prevProps: Readonly<IAgiIntranetNewsDetailsProps>, prevState: Readonly<IAgiIntranetNewsDetailsState>, snapshot?: any): void {
    if (this.state.comments !== prevState.comments) {
      this.setState({
        showMoreComments: window.innerWidth <= 767 && this.state.comments.length > 0
      });
    }
  }

  private getIntranetConfig(title: string) {
    sp.web.lists.getByTitle(LIST_INTRANETCONFIG)
      .items.filter(`Title eq '${title}'`).get()
      .then((items: any[]) => {
        this.setState({
          inappropriateWords: items[0]?.Dictionary?.split(';'),
          errorText: items[0]?.Detail
        })
      });
  }

  private async getNewsItem(newsID: string): Promise<void> {
    const listName = 'News';
    const userId = this.props.context.pageContext.legacyPageContext.userId;
    if (!newsID)
      return;
    const id = parseInt(newsID);
    this.setState({
      newsId: id
    });

    await sp.web.lists.getByTitle(listName).items.getById(id)
      .select('*,Business/Title,Business/ID,Functions/Title,Functions/ID')
      .expand('Business,Functions')
      .get().then((item: INewsItem) => {
        let viewJSON = '';
        if (item.ViewsJSON) {
          viewJSON = item.ViewsJSON;
          let _viewJSON = JSON.parse(viewJSON);
          if (_viewJSON && _viewJSON.length > 0) {
            const _records = _viewJSON.filter((o) => o.userId == this.state.userId);
            if (_records && _records.length == 0) {
              _viewJSON.push({ userId: userId, views: 0 });
              viewJSON = JSON.stringify(_viewJSON);
            }
          }
        }
        else {
          let _viewJSON = [];
          _viewJSON.push({ userId: userId, views: 0 });
          viewJSON = JSON.stringify(_viewJSON);
          //console.log('updated view JSON', _viewJSON);
        }

        const viewsCount = this.getViewCount(viewJSON);
        // update view
        let updateViewJSON = JSON.parse(viewJSON);

        const newViewsCount = viewsCount + 1;
        const updatedViews = updateViewJSON.map((obj) => {
          if (obj.userId == userId) {
            return { ...obj, views: newViewsCount }
          }
          return obj;
        });
        this.updateViews(parseInt(newsID), JSON.stringify(updatedViews));
        this.setState({
          news: item,
          viewsCount: viewsCount
        });
      });

    await this.getComments(id);

  }

  private async reloadNewsItem(newsID: string): Promise<void> {
    const listName = 'News';
    if (!newsID)
      return;
    const id = parseInt(newsID);
    this.setState({
      newsId: id
    });

    await sp.web.lists.getByTitle(listName).items.getById(id)
      .select('*,Business/Title,Business/ID')
      .expand('Business')
      .get().then((item: INewsItem) => {
        this.setState({
          news: item,
        });
      });

  }

  private async getComments(newsId: number): Promise<void> {
    //get comments
    const select = 'ID,Title,Comment,CommentAuthor/Title,CommentAuthor/Id,ParentCommentID,Created,CommentLikedBy';
    await sp.web.lists.getByTitle(LIST_COMMENTS).items.filter(`Title eq '${newsId}'`)
      .select(select)
      //.orderBy('Created', false)
      .expand('CommentAuthor')
      .get().then((items: ICommentItem[]) => {
        //console.log('comments', items);
        const count = items.length;
        let comments = items.filter((item) => !item.ParentCommentID);
        comments = comments.sort((a, b) => {
          return (new Date(b.Created).getTime() - new Date(a.Created).getTime())
        });
        const replies = items.filter((item) => item.ParentCommentID);
        // console.log('comments', comments);
        // console.log('replies', replies);
        this.setState({
          allComments: items,
          comments,
          replies,
          commentsCount: count
        });
      })
  }

  private async updateViews(newsID: number, viewsJSON: string): Promise<void> {
    const listName = LIST_NEWS;
    const body = {
      ViewsJSON: viewsJSON
    };
    sp.web.lists.getByTitle(listName).items.getById(newsID).update(body).then((data) => {
      console.log('news views updated successfully');
    }).catch((error) => {
      console.log('error in updating news views', error);
    });
  }

  private getViewCount(viewsJSON: string): number {
    let count = 0;
    if (viewsJSON) {
      //const data = JSON.parse(viewsJSON).views;
      const data = JSON.parse(viewsJSON);
      if (data && data.length > 0) {
        const _records = data.filter((o) => o.userId == this.state.userId);
        if (_records && _records.length > 0) {
          const record = _records[0];
          count = record.views;
        }
      }
    }

    return count;
  }

  private addComment() {
    const comment = this.state.comment;
    const newsId = this.state.newsId;
    if (!newsId) {
      return;
    }

    const userName = this.props.context.pageContext.legacyPageContext.userDisplayName;
    const userId = this.props.context.pageContext.legacyPageContext.userId;
    const body = {
      Title: newsId.toString(),
      Comment: comment,
      CommentAuthorId: userId
    };

    sp.web.lists.getByTitle(LIST_COMMENTS).items.add(body).then((data) => {
      this.setState({
        comment: ''
      });
      this.getComments(newsId);
    }).catch((error) => {
      console.log('error in adding comments', error);
    })

    //const authorName = this.props.context.pageContext.legacyPageContext.

  }

  private handleComment(e: any) {
    const comment = e.target.value;
    var presents = _.intersectionWith(comment.split(REGEX_SPEC_CHAR), this.state.inappropriateWords, _.isEqual);
    this.setState({
      comment,
      inappropriateComments: presents.length ? presents.filter(n => n) : []
    });
  }

  private handleReply(e: any) {
    const reply = e.target.value;
    var presents = _.intersectionWith(reply.split(REGEX_SPEC_CHAR), this.state.inappropriateWords, _.isEqual);
    this.setState({
      reply,
      inappropriateReply: presents.length ? presents.filter(n => n) : []
    });
  }

  private replyToComment(e: any) {
    //const newsId = this.state.newsId;
    const id = e.target.attributes["data-id"].value;
    const replyBoxes: any = document.getElementsByClassName('commentReplyBox');

    for(let i = 0; i < replyBoxes.length; i++) {
      replyBoxes[i].style.display = 'none';
    }
    
    const replySectionId = `replySection${id}`;
    document.getElementById(replySectionId).style.display = 'flex';
  }

  private addReply(e: any) {
    const id = e.target.attributes["data-id"].value;
    const replySectionId = `replySection${id}`;
    const newsId = this.state.newsId;
    const reply = this.state.reply;
    const userId = this.props.context.pageContext.legacyPageContext.userId;
    //add reply comment to the comments list
    const body = {
      Title: newsId.toString(),
      Comment: reply,
      ParentCommentID: id,
      CommentAuthorId: userId
    }

    sp.web.lists.getByTitle(LIST_COMMENTS).items.add(body).then((data) => {
      this.getComments(newsId);
      this.setState({
        reply: ''
      });
      document.getElementById(replySectionId).style.display = 'none';
    }).catch((error) => {
      console.log('error in adding reply/comment', error);
    })
  }

  private likePost(e: any) {
    const id = e.target.attributes["data-id"].value;
    const newsItem = this.state.news;
    let likedByArray = newsItem.NewsLikedBy ? newsItem.NewsLikedBy.split(';') : [];
    likedByArray.push(this.state.userId.toString());
    const likedBy = likedByArray.join(';').trim();
    const body = {
      NewsLikedBy: likedBy
    };
    this.updateNewsItem(body, id);
  }

  private unlikePost(e: any) {
    const id = e.target.attributes["data-id"].value;
    const newsItem = this.state.news;
    let likedByArray = newsItem.NewsLikedBy ? newsItem.NewsLikedBy.split(';') : [];
    const userId = this.state.userId.toString();
    likedByArray = likedByArray.filter((elem) => elem != userId);
    const likedBy = likedByArray.join(';').trim();
    const body = {
      NewsLikedBy: likedBy
    };
    this.updateNewsItem(body, id);
  }

  private likeComment(e: any) {
    const id = e.target.attributes["data-id"].value;
    const commentItem = this.state.allComments.filter((comment) => comment.ID == id)[0];
    let likedByArray = commentItem.CommentLikedBy ? commentItem.CommentLikedBy.split(';') : [];
    likedByArray.push(this.state.userId.toString());
    const likedBy = likedByArray.join(';').trim();
    const body = {
      CommentLikedBy: likedBy
    };
    this.updateNewsCommentItem(body, id);
  }

  private unlikeComment(e: any) {
    const id = e.target.attributes["data-id"].value;
    const commentItem = this.state.allComments.filter((comment) => comment.ID == id)[0];
    let likedByArray = commentItem.CommentLikedBy ? commentItem.CommentLikedBy.split(';') : [];
    const userId = this.state.userId.toString();
    likedByArray = likedByArray.filter((elem) => elem != userId);
    const likedBy = likedByArray.join(';').trim();
    const body = {
      CommentLikedBy: likedBy
    };
    this.updateNewsCommentItem(body, id);
  }

  private async updateNewsItem(body: any, itemId: number): Promise<void> {
    const listName = LIST_NEWS;
    sp.web.lists.getByTitle(listName).items.getById(itemId).update(body).then((data) => {
      this.reloadNewsItem(this.state.newsId.toString());
    }).catch((error) => {
      console.log('error in updating news item');
      console.log(error);
    })
  }

  private async updateNewsCommentItem(body: any, itemId: number): Promise<void> {
    const listName = LIST_COMMENTS;
    sp.web.lists.getByTitle(listName).items.getById(itemId).update(body).then((data) => {
      this.getComments(this.state.newsId);
    }).catch((error) => {
      console.log('error in updating comment item');
      console.log(error);
    })
  }

  private getQueryStringValue(param: string): string {
    const params = new URLSearchParams(window.location.search);
    let value = params.get(param) || '';
    return value;
  }

  private getImageUrl(imageContent: string) {
    if (!imageContent) {
      return;
    }
    const imageObj: any = JSON.parse(imageContent);
    return imageObj.serverUrl + imageObj.serverRelativeUrl;
  }

  private showMore() {
    this.setState({
      showMoreComments: false
    })
  }

  private renderNewsDetail(): JSX.Element {
    const news = this.state.news;
    const userId = this.state.userId;
    const imageUrl = this.getImageUrl(news.NewsImage);
    const isLikedByCurrentUser = news.NewsLikedBy && news.NewsLikedBy.split(';').includes(userId.toString());
    const commentsCount = this.state.commentsCount;
    //const newsSource = this.state.attachmentUrl;
    const comments = this.state.showMoreComments ? this.state.comments.slice(0, 3) : this.state.comments;
    const enablePost = this.state.comment && !this.state.inappropriateComments.length;

    return (
      <>
        <article className="news-detail-wrapper">
          <header className="news-detail-header">
            <p>
              <i><img src={`${this.props.siteUrl}/Assets/icons/Date.svg`} /></i>
              {
                news.PublishedDate && moment(news.PublishedDate).format('MMMM DD, YYYY')
              }
            </p>
            <h1>{news.Title}</h1>
          </header>
          <section className="news-detail-content">
            <div className="row">
              <div className="col-md-12">
                <ul className="justify-content-start ps-0">
                  <li className="ps-0"><i><img src={`${this.props.siteUrl}/Assets/icons/icon-tag.png`} /></i> {news.Business?.Title || (news.Functions?.Title)}</li>
                </ul>
              </div>
              {/* <div className="col-md-6">
                <ul>
                  <li><i><img src={`${this.props.siteUrl}/Assets/icons/icon-location.png`} /></i> Dubai, UAE</li>
                  <li><i><img src={`${this.props.siteUrl}/Assets/icons/icon-time.png`} /></i> {moment(news.PublishedDate).fromNow()}</li>
                </ul>
              </div> */}
            </div>
          </section>
          <section className="news-detail-img">
            <img src={imageUrl} className="d-block w-100" alt="..." />
            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel" style={{ display: 'none' }}>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src={`${this.props.siteUrl}/Assets/images/news-springfield.png`} className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src={`${this.props.siteUrl}/Assets/images/news-springfield.png`} className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src={`${this.props.siteUrl}/Assets/images/news-springfield.png`} className="d-block w-100" alt="..." />
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls"
                data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls"
                data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </section>
          <section className="news-detail-text" >
            <div dangerouslySetInnerHTML={{ __html: news.Summary }}>
            </div>
          </section>
          <footer className="news-detail-footer">
            <div className="row">
              <div className="col-12">
                <nav className="nav post-analytics">
                  {
                    isLikedByCurrentUser ?
                      <a className="nav-link" href="javascript:void(0)" onClick={(e) => this.unlikePost(e)}
                        data-id={news.ID}>
                        <i><img src={`${this.props.siteUrl}/Assets/icons/icon-unlike.svg`} alt="" data-id={news.ID} /></i> Unlike
                      </a>
                      :
                      <a className="nav-link" href="javascript:void(0)" onClick={(e) => this.likePost(e)}
                        data-id={news.ID}>
                        <i><img src={`${this.props.siteUrl}/Assets/icons/icon-like.png`} alt="" data-id={news.ID} /></i> Like
                      </a>
                  }
                  {/* <a className="nav-link" href="#"><i><img src={`${this.props.siteUrl}/Assets/icons/icon-like.png`} alt="" /></i>
                    <span className='txt'>Like</span>
                  </a> */}
                  <p className="nav-link" >
                    <i><img src={`${this.props.siteUrl}/Assets/icons/comment.svg`} alt="" /></i> <span className='count'>{this.state.commentsCount}</span><span className='txt'> Comment</span>
                  </p>
                  <p className="nav-link"  >
                    <i><img src={`${this.props.siteUrl}/Assets/icons/view.svg`} alt="" /></i> <span className='count'>{this.state.viewsCount}</span><span className='txt'> Views</span>
                  </p>
                </nav>
              </div>
              <div className="col-3 col-md-6" style={{ display: 'none' }}>
                <nav className="nav justify-content-end">
                  <a className="nav-link" href="#"><i><img src={`${this.props.siteUrl}/Assets/icons/icon-save.png`} alt="" /></i> Save for later</a>
                </nav>
              </div>
            </div>
          </footer>
          <div className="row">
            <div className="comments-count-row">
              {
                <div className='comments-count'>
                  <span className='count'>{commentsCount}</span>
                  <span className='txt'>{commentsCount > 1 ? 'Comments' : 'Comment'}</span>
                </div>
              }
            </div>
          </div>
          <div className="row">
            <div className="comment-wrapper">
              <div className="comment">
                <div className="col d-flex align-items-center">
                  <img src={this.state.userPicture} alt="" className="flex-shrink-0 me-3 userImage comment-user-icon" width="60px" height="60px" />
                  <div className='formSection'>
                    <div className="d-flex gap-3 align-items-center add-comment">
                      <div>
                        <label className="visually-hidden" >Add Comment</label>
                        {/* <input type="text" className="form-control" placeholder="Add a comment." value={this.state.comment} onChange={(e) => this.handleComment(e)} /> */}
                        <textarea className="form-control" placeholder="Add a comment." value={this.state.comment} onChange={(e) => this.handleComment(e)} rows={2}>
                        </textarea>
                        {this.state.inappropriateComments.length > 0 &&
                          <div className='comment-warning'>
                            <span>
                              {this.state.errorText}
                            </span>
                            {this.state.inappropriateComments.map((inappropriateComment: string) => {
                              return <div>'{inappropriateComment}'</div>
                            })}
                          </div>}
                      </div>
                      <div>
                        <label />
                      </div>
                      <div>
                        <input type="button" className={enablePost ? "btn btn-gradient" : "btn btn-gradient disabled"} onClick={() => enablePost && this.addComment()} value='Post' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='commentsContainer'>
                {
                  comments.map((comment) => {
                    return this.renderCommentRow(comment)
                  })
                }
              </div>
              {this.state.showMoreComments && <div className='more-comments-container mobile'>
                <a className='more-comments' onClick={() => { this.showMore() }} >
                  More comments
                </a>
              </div>}
            </div>
          </div>
        </article>
      </>
    )
  }

  private renderCommentRow(comment: ICommentItem): JSX.Element {
    // const userEmail = this.props.context.pageContext.legacyPageContext.userEmail;
    // const profileUrl = `${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L&username=${userEmail}`;
    const profilePicUrl = this.state.userPicture;
    const replies = this.state.replies.filter((reply) => reply.ParentCommentID == comment.ID);
    const userId = this.state.userId;
    const likedBy = comment.CommentLikedBy;
    const isLikedByCurrentUser = likedBy && likedBy.split(';').includes(userId.toString());
    const enableReply = this.state.reply && !this.state.inappropriateReply.length;

    return (
      <div className="comment">
        <div className="col d-flex">
          <img src={profilePicUrl} alt="" className="flex-shrink-0 me-3 userImage comment-user-icon" width="60px" height="60px" />
          <div className="comment-detail" >
            <h4 className="comment-username">{comment.CommentAuthor.Title}</h4>
            <p className="comment-time">{moment(comment.Created).fromNow()}</p>
            <p>
              {comment.Comment}
            </p>
            <div className="comment-controls">
              {
                isLikedByCurrentUser ?

                  <nav className="nav">
                    <a className="nav-link" href="javascript:void(0)" onClick={(e) => this.replyToComment(e)}
                      data-id={comment.ID}>
                      <Icon iconName='Reply' className='replyIcon' data-id={comment.ID} /> Reply
                    </a>
                    <a className="nav-link" href="javascript:void(0)" onClick={(e) => this.unlikeComment(e)}
                      data-id={comment.ID}>
                      <i><img src={`${this.props.siteUrl}/Assets/icons/icon-unlike.svg`} alt="" data-id={comment.ID} /></i> Unlike
                    </a>
                  </nav>

                  :

                  <nav className="nav">
                    <a className="nav-link" href="javascript:void(0)" onClick={(e) => this.replyToComment(e)}
                      data-id={comment.ID}>
                      <Icon iconName='Reply' className='replyIcon' data-id={comment.ID} /> Reply
                      {/* <i><img src={`${this.props.siteUrl}/Assets/icons/comment.svg`} alt="" /></i> Reply */}
                    </a>
                    <a className="nav-link" href="javascript:void(0)" onClick={(e) => this.likeComment(e)}
                      data-id={comment.ID}>
                      <i><img src={`${this.props.siteUrl}/Assets/icons/icon-like.png`} alt="" data-id={comment.ID} /></i> Like
                    </a>
                  </nav>

              }

              

              {/** reply text box */}
              <div className="col mt-4 align-items-center commentReplyBox" id={`replySection${comment.ID}`} style={{ display: 'none' }}>
                <img src={profilePicUrl} alt="" className="flex-shrink-0 me-3 userImage comment-user-icon" width="60px" height="60px" />
                <div>
                  <div className="d-flex gap-3 align-items-center add-comment">
                    <div>
                      <label className="visually-hidden" >Add Comment</label>
                      <textarea rows={2} className="form-control" placeholder="Add a comment." value={this.state.reply} onChange={(e) => this.handleReply(e)} />
                      {this.state.inappropriateReply.length > 0 &&
                        <div className='comment-warning'>
                          <span>
                            {this.state.errorText}
                          </span>
                          {this.state.inappropriateReply.map((inappropriateComment: string) => {
                            return <div>'{inappropriateComment}'</div>
                          })}
                        </div>}
                    </div>
                    <div>
                      <label />
                    </div>
                    <div>
                      <input type="button" className={enableReply ? "btn btn-gradient" : "btn btn-gradient disabled"} onClick={(e) => enableReply && this.addReply(e)} value='Post' data-id={comment.ID} />
                    </div>
                  </div>
                </div>
              </div>

              {/** replies section */}
              <div className="replies">
                {
                  replies.map((reply) => {
                    return this.renderReplyRow(reply, profilePicUrl)
                  })
                }
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }

  private renderReplyRow(reply: ICommentItem, profilePicUrl: string): JSX.Element {
    const userId = this.state.userId;
    const likedBy = reply.CommentLikedBy;
    const isLikedByCurrentUser = likedBy && likedBy.split(';').includes(userId.toString());
    return (
      <div className="comment">
        <div className="col d-flex">
          <img src={profilePicUrl} alt="" className="flex-shrink-0 me-3 userImage comment-user-icon" width="60px" height="60px" />
          <div className="comment-detail" >
            <h4 className="comment-username">{reply.CommentAuthor.Title}</h4>
            <p className="comment-time">{moment(reply.Created).fromNow()}</p>
            <p>
              {reply.Comment}
            </p>
            <div className="comment-controls">
              {
                isLikedByCurrentUser ?

                  <nav className="nav">
                    <a className="nav-link" href="javascript:void(0)" onClick={(e) => this.unlikeComment(e)}
                      data-id={reply.ID}>
                      <i><img src={`${this.props.siteUrl}/Assets/icons/icon-unlike.svg`} alt="" data-id={reply.ID} /></i> Unlike
                    </a>
                  </nav>

                  :

                  <nav className="nav">
                    <a className="nav-link" href="javascript:void(0)" onClick={(e) => this.likeComment(e)}
                      data-id={reply.ID}>
                      <i><img src={`${this.props.siteUrl}/Assets/icons/icon-like.png`} alt="" data-id={reply.ID} /></i> Like
                    </a>
                  </nav>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

  public render(): React.ReactElement<IAgiIntranetNewsDetailsProps> {
    const newsID = this.getQueryStringValue('newsID');
    return (
      <div className={styles.agiIntranetNewsDetails}>
        <div className="main-content news-content">
          <div className="content-wrapper">
            <div className="container">
              {
                newsID ?

                  this.renderNewsDetail()
                  :
                  <div className='warning-text'>
                    Invalid news ID.
                  </div>
              }

            </div>
          </div>
        </div>
      </div>
    );
  }
}
