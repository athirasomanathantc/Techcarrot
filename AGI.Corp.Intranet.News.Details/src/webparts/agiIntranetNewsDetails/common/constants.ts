
export const LIST_NEWS = 'News';
export const LIST_COMMENTS = 'NewsComments';
export const NEWS_NULL_ITEM = {
    ID: 0,
    Title: '',
    Summary: '',
    NewsImage: '',
    Category: '',
    PublishedDate: new Date(),
    ViewsJSON: '',
    NewsLikedBy: '',
    Business: {Title: '', ID: 0}
};

export const ViewsJSON_NULL = JSON.stringify({ "views": [] });