import * as React from 'react';
import styles from './AgiIntranetBlogDetails.module.scss';
import { IAgiIntranetBlogDetailsProps } from './IAgiIntranetBlogDetailsProps';
import { IAgiIntranetBlogDetailsState } from './IAgiIntranetBlogDetailsState';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import * as moment from 'moment';
import { BLOG_NULL_ITEM, LIST_BLOG, LIST_COMMENTS } from '../common/constants';
import { IBlogItem } from '../models/IBlogItem';
import { ICommentItem } from '../models/ICommentItem';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Link, Text } from 'office-ui-fabric-react';

export default class AgiIntranetBlogDetails extends React.Component<IAgiIntranetBlogDetailsProps, IAgiIntranetBlogDetailsState> {

  constructor(props: IAgiIntranetBlogDetailsProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      blogId: null,
      blog: BLOG_NULL_ITEM,
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
      currentIndex: 0,
      blogs: []
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

    //const blogID = this.getQueryStringValue('blogID');

    //await this.getBlogItem(blogID);
    this.getBlogItems();
  }

  private async getBlogItems(): Promise<void> {
    const blogID = this.getQueryStringValue('blogID');
    const listName = LIST_BLOG;
    const select = "ID,Title,Summary,BlogImage,Business/ID,Business/Title,Author/ID,Author/Title,PublishedDate,ViewsJSON,BlogLikedBy";
    sp.web.lists.getByTitle(listName).items.
      select(select).
      expand('Business,Author').
      get().then((items: IBlogItem[]) => {
        // get blog item
        if (!blogID) {
          return;
        }
        const id = parseInt(blogID);
        const _blogItem = items.filter((item) => item.ID == id);
        let blogItem = BLOG_NULL_ITEM;
        if (_blogItem && _blogItem.length > 0) {
          blogItem = _blogItem && _blogItem.length > 0 ? _blogItem[0] : BLOG_NULL_ITEM;
          this.updateViewCount(blogItem);
        }

        this.setState({
          blogId: id,
          blog: blogItem,
          blogs: items,
          currentIndex: blogItem.ID
        });
      });
  }


  private async getBlogItem(blogID: string): Promise<void> {
    const listName = LIST_BLOG;
    const userId = this.props.context.pageContext.legacyPageContext.userId;
    if (!blogID)
      return;
    const id = parseInt(blogID);
    this.setState({
      blogId: id
    });

    const select = "ID,Title,Summary,BlogImage,Business/ID,Business/Title,Author/ID,Author/Title,PublishedDate,ViewsJSON,BlogLikedBy";
    await sp.web.lists.getByTitle(listName).items.getById(id).
      select(select).
      expand('Author,Business').
      get().then((item: IBlogItem) => {
        let viewJSON = '';
        if (item.ViewsJSON) {
          viewJSON = item.ViewsJSON;
        }
        else {
          let _viewJSON = [];
          _viewJSON.push({ userId: userId, views: 0 });
          viewJSON = JSON.stringify(_viewJSON);
          console.log('updated view JSON', _viewJSON);
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
        this.updateViews(parseInt(blogID), JSON.stringify(updatedViews));
        this.setState({
          blog: item,
          viewsCount: viewsCount
        });
      });

    await this.getComments(id);

  }

  private async updateViewCount(item: IBlogItem): Promise<void> {
    const userId = this.props.context.pageContext.legacyPageContext.userId;
    const id = item.ID;
    let viewJSON = '';
    if (item.ViewsJSON) {
      viewJSON = item.ViewsJSON;
    }
    else {
      let _viewJSON = [];
      _viewJSON.push({ userId: userId, views: 0 });
      viewJSON = JSON.stringify(_viewJSON);
      console.log('updated view JSON', _viewJSON);
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
    this.updateViews(id, JSON.stringify(updatedViews));
    this.setState({
      blog: item,
      viewsCount: viewsCount
    });

    await this.getComments(id);

  }

  private async reloadBlogItem(blogID: string): Promise<void> {
    const listName = LIST_BLOG;
    if (!blogID)
      return;
    const id = parseInt(blogID);
    this.setState({
      blogId: id
    });

    await sp.web.lists.getByTitle(listName).items.getById(id).get().then((item: IBlogItem) => {
      this.setState({
        blog: item,
      });
    });

  }

  private async getComments(blogId: number): Promise<void> {
    //get comments
    const select = 'ID,Title,Comment,CommentAuthor/Title,CommentAuthor/Id,ParentCommentID,Created,CommentLikedBy';
    await sp.web.lists.getByTitle(LIST_COMMENTS).items.filter(`Title eq '${blogId}'`)
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

  private async updateViews(blogID: number, viewsJSON: string): Promise<void> {
    const listName = LIST_BLOG;
    const body = {
      ViewsJSON: viewsJSON
    };
    sp.web.lists.getByTitle(listName).items.getById(blogID).update(body).then((data) => {
      console.log('news views updated successfully');
    }).catch((error) => {
      console.log('error in updating news views', error);
    });
  }

  private getViewCount(viewsJSON: string): number {
    console.log('get view count');
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
      console.log('json');
      console.log(viewsJSON);
    }

    return count;
  }

  private addComment() {
    const comment = this.state.comment;
    const blogId = this.state.blogId;
    if (!blogId) {
      return;
    }

    console.log('comment', comment);
    const userName = this.props.context.pageContext.legacyPageContext.userDisplayName;
    const userId = this.props.context.pageContext.legacyPageContext.userId;
    const body = {
      Title: blogId.toString(),
      Comment: comment,
      CommentAuthorId: userId
    };

    sp.web.lists.getByTitle(LIST_COMMENTS).items.add(body).then((data) => {
      console.log('comments added.');
      this.setState({
        comment: ''
      });
      this.getComments(blogId);
    }).catch((error) => {
      console.log('error in adding comments', error);
    })

    //const authorName = this.props.context.pageContext.legacyPageContext.

  }

  private handleComment(e: any) {
    const comment = e.target.value;
    this.setState({
      comment
    });
  }

  private handleReply(e: any) {
    const reply = e.target.value;
    this.setState({
      reply
    });
  }

  private replyToComment(e: any) {
    const id = e.target.attributes["data-id"].value;
    const replySectionId = `replySection${id}`;
    document.getElementById(replySectionId).style.display = 'flex';
  }

  private addReply(e: any) {
    const id = e.target.attributes["data-id"].value;
    const replySectionId = `replySection${id}`;
    const blogId = this.state.blogId;
    const reply = this.state.reply;
    const userId = this.props.context.pageContext.legacyPageContext.userId;
    //add reply comment to the comments list
    const body = {
      Title: blogId.toString(),
      Comment: reply,
      ParentCommentID: id,
      CommentAuthorId: userId
    }

    sp.web.lists.getByTitle(LIST_COMMENTS).items.add(body).then((data) => {
      console.log('reply added..');
      this.getComments(blogId);
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
    const newsItem = this.state.blog;
    let likedByArray = newsItem.BlogLikedBy ? newsItem.BlogLikedBy.split(';') : [];
    likedByArray.push(this.state.userId.toString());
    const likedBy = likedByArray.join(';').trim();
    const body = {
      BlogLikedBy: likedBy
    };
    console.log(body);
    this.updateBlogItem(body, id);

  }

  private unlikePost(e: any) {
    const id = e.target.attributes["data-id"].value;
    const newsItem = this.state.blog;
    let likedByArray = newsItem.BlogLikedBy ? newsItem.BlogLikedBy.split(';') : [];
    const userId = this.state.userId.toString();
    likedByArray = likedByArray.filter((elem) => elem != userId);
    const likedBy = likedByArray.join(';').trim();
    const body = {
      BlogLikedBy: likedBy
    };
    console.log(body);
    this.updateBlogItem(body, id);
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
    console.log(body);
    this.updateBlogCommentItem(body, id);

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
    console.log(body);
    this.updateBlogCommentItem(body, id);
  }

  private async updateBlogItem(body: any, itemId: number): Promise<void> {
    const listName = LIST_BLOG;
    sp.web.lists.getByTitle(listName).items.getById(itemId).update(body).then((data) => {
      console.log('news item udpated successfully');
      this.reloadBlogItem(this.state.blogId.toString());
    }).catch((error) => {
      console.log('error in updating blog item');
      console.log(error);
    })
  }

  private async updateBlogCommentItem(body: any, itemId: number): Promise<void> {
    const listName = LIST_COMMENTS;
    sp.web.lists.getByTitle(listName).items.getById(itemId).update(body).then((data) => {
      console.log('comment item udpated successfully');
      this.getComments(this.state.blogId);
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

  private prevBlog() {
    const index = this.state.currentIndex;
    const blogs = this.state.blogs;
    const arrayIndex = blogs.map(e => e.ID).indexOf(index);
    const prevIndex = arrayIndex == 0 ? (blogs.length - 1) : arrayIndex - 1;
    const prevItem = blogs[prevIndex];
    this.setState({
      currentIndex: prevItem.ID,
      blog: prevItem
    }, () => {
      console.log('cruuent Item: ', prevIndex)
      this.scrollToTop();
    });
  }

  private nextBlog() {
    const index = this.state.currentIndex;
    const blogs = this.state.blogs;
    const arrayIndex = blogs.map(e => e.ID).indexOf(index);
    const nextIndex = arrayIndex == (blogs.length - 1) ? 0 : arrayIndex + 1;
    const nextItem = blogs[nextIndex];
    this.setState({
      currentIndex: nextItem.ID,
      blog: nextItem
    }, () => {
      console.log('cruuent Item: ', nextIndex);
      this.scrollToTop();
    });
  }

  private scrollToTop(): void {
    var element = document.getElementById("spPageCanvasContent");
    element.scrollIntoView({ behavior: 'smooth' });
  }

  private renderBlogDetail(): JSX.Element {
    const blog = this.state.blog;
    const userId = this.state.userId;
    const imageUrl = this.getImageUrl(blog.BlogImage);
    const isLikedByCurrentUser = blog.BlogLikedBy && blog.BlogLikedBy.split(';').includes(userId.toString());
    const commentsCount = this.state.commentsCount;
    //const newsSource = this.state.attachmentUrl;
    return (
      <article className="wrapper">
        <header className="news-detail-header header">
          <p>
            <i><img src={`${this.props.siteUrl}/Assets/icons/Date.svg`} /></i>
            {
              blog.PublishedDate && moment(blog.PublishedDate).format('MMMM DD, YYYY')
            }
          </p>
          <h1>{blog.Title}</h1>
        </header>
        <section className="content row-meta-details">
          <div className="row">
            <div className="col-md-6">
              <ul className="justify-content-start ps-0">
                <li className="ps-0"><i><img src={`${this.props.siteUrl}/Assets/icons/icon-tag.png`} /></i> {blog.Business ? blog.Business.Title : ''}</li>
                <li className="ps-0"><i><img src={`${this.props.siteUrl}/Assets/icons/avatar.png`} alt="" /></i> {blog.Author ? blog.Author.Title : ''}</li>
              </ul>
            </div>
            <div className="col-md-6">
              {/* <ul>
                      <li><i><img src={`${this.props.siteUrl}/Assets/icons/icon-like.png`} alt="" /></i> Like</li>
                      <li><i><img src={`${this.props.siteUrl}/Assets/icons/icon-comment.png`} alt="" /></i> 3 Comment</li>
                      <li><i><img src={`${this.props.siteUrl}/Assets/icons/icon-view.png`} alt="" /></i> 8 Views</li>
                    </ul> */}
              <nav className="nav post-analytics">
                {
                  isLikedByCurrentUser ?
                    <a className="nav-link" href="javascript:void(0)" onClick={(e) => this.unlikePost(e)}
                      data-id={blog.ID}>
                      <i><img src={`${this.props.siteUrl}/Assets/icons/icon-unlike.svg`} alt="" data-id={blog.ID} /></i> Unlike
                    </a>
                    :
                    <a className="nav-link" href="javascript:void(0)" onClick={(e) => this.likePost(e)}
                      data-id={blog.ID}>
                      <i><img src={`${this.props.siteUrl}/Assets/icons/icon-like.png`} alt="" data-id={blog.ID} /></i> Like
                    </a>
                }
                {/* <a className="nav-link" href="#"><i><img src={`${this.props.siteUrl}/Assets/icons/icon-like.png`} alt="" /></i>
            <span className='txt'>Like</span>
          </a> */}
                <p className="nav-link" >
                  <i><img src={`${this.props.siteUrl}/Assets/icons/icon-comment.png`} alt="" /></i> <span className='count'>{this.state.commentsCount}</span><span className='txt'> Comment</span>
                </p>
                <p className="nav-link"  >
                  <i><img src={`${this.props.siteUrl}/Assets/icons/icon-view.png`} alt="" /></i> <span className='count'>{this.state.viewsCount}</span><span className='txt'> Views</span>
                </p>
              </nav>
            </div>
          </div>
        </section>
        <section className="news-detail-img">
          <img src={imageUrl} className="d-block w-100" alt="..." />
        </section>
        <section className="news-detail-text">
          <div dangerouslySetInnerHTML={{ __html: blog.Summary }}></div>
        </section>
        <footer className="news-detail-footer">
          <div className="row">
            <div className="col-6 col-md-6">
              <nav className="nav">
                <Link onClick={() => this.prevBlog()}  >
                  <i><img src={`${this.props.siteUrl}/Assets/icons/icon-previous-post.svg`} alt="" /></i> Previous Post
                </Link>

              </nav>
            </div>
            <div className="col-6 col-md-6">
              <nav className="nav justify-content-md-end">
                <Link onClick={() => this.nextBlog()}  >
                  Next Post<i><img src={`${this.props.siteUrl}/Assets/icons/icon-next-post.svg`} alt="" /></i>
                </Link>
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
                    </div>
                    <div>
                      <label />
                    </div>
                    <div>
                      <input type="button" className={this.state.comment ? "btn btn-gradient" : "btn btn-gradient disabled"} onClick={() => this.addComment()} value='Post' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='commentsContainer'>
              {
                this.state.comments.map((comment) => {
                  return this.renderCommentRow(comment)
                })
              }
            </div>
            <div className="comment" style={{ display: 'none' }}>
              <div className="col d-flex">
                <img src="images/icon-user.png" alt="" className="flex-shrink-0 me-3" width="60px" height="60px" />
                <div className="comment-detail" >
                  <h4 className="comment-username">Michael Montgomery</h4>
                  <p className="comment-time">An hour ago</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  <div className="comment-controls">
                    <nav className="nav">
                      <a className="nav-link" href="#"><i><img src={`${this.props.siteUrl}/Assets/icons/icon-comment.png`} alt="" /></i> Reply</a>
                      <a className="nav-link" href="#"><i><img src={`${this.props.siteUrl}/Assets/icons/icon-like.png`} alt="" /></i> Like</a>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
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
                      {/* <i><img src={`${this.props.siteUrl}/Assets/icons/icon-comment.png`} alt="" /></i> Reply */}
                    </a>
                    <a className="nav-link" href="javascript:void(0)" onClick={(e) => this.likeComment(e)}
                      data-id={comment.ID}>
                      <i><img src={`${this.props.siteUrl}/Assets/icons/icon-like.png`} alt="" data-id={comment.ID} /></i> Like
                    </a>
                  </nav>

              }
              {/** replies section */}
              <div className="replies">
                {
                  replies.map((reply) => {
                    return this.renderReplyRow(reply, profilePicUrl)
                  })
                }
              </div>

              {/** reply text box */}
              <div className="col mt-4 align-items-center" id={`replySection${comment.ID}`} style={{ display: 'none' }}>
                <img src={profilePicUrl} alt="" className="flex-shrink-0 me-3 userImage comment-user-icon" width="60px" height="60px" />
                <div>
                  <div className="d-flex gap-3 align-items-center add-comment">
                    <div>
                      <label className="visually-hidden" >Add Comment</label>
                      <textarea rows={2} className="form-control" placeholder="Add a comment." value={this.state.reply} onChange={(e) => this.handleReply(e)} />
                    </div>
                    <div>
                      <label />
                    </div>
                    <div>
                      <input type="button" className={this.state.reply ? "btn btn-gradient" : "btn btn-gradient disabled"} onClick={(e) => this.addReply(e)} value='Post' data-id={comment.ID} />
                    </div>
                  </div>
                </div>
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


  public render(): React.ReactElement<IAgiIntranetBlogDetailsProps> {
    const blogID = this.getQueryStringValue('blogID');
    return (
      <div className={styles.agiIntranetBlogDetails}>
        <div className="main-content blog-content">
          <div className="content-wrapper">
            <div className="container">
              {
                blogID ?

                  this.renderBlogDetail()
                  :
                  <div>
                    Invalid blog ID.
                  </div>
              }

            </div>
          </div>
        </div>
      </div>
    );
  }
}
