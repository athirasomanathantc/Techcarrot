
export const LIST_NEWS = 'News';
export const LIST_NEWS_TRANSACTION = 'NewsTransaction';
export const LIST_COMMENTS = 'NewsComments';
export const LIST_INTRANETCONFIG = 'IntranetConfig';
export const NEWS_NULL_ITEM = {
    ID: 0,
    Title: '',
    Summary: '',
    NewsImage: '',
    Category: '',
    PublishedDate: new Date(),
    ViewsJSON: '',
    NewsLikedBy: '',
    Business: { Title: '', ID: 0 },
    Functions: { Title: '', ID: 0 },
    News: { Id: -1, Title: '' }
};

export const ViewsJSON_NULL = JSON.stringify({ "views": [] });
export const REGEX_SPEC_CHAR = /[^a-zA-Z]/g;