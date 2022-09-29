
export const LIST_BLOG = 'Blogs';
export const LIST_INTRANETCONFIG = 'IntranetConfig';
export const LIST_COMMENTS = 'BlogComments';
export const BLOG_NULL_ITEM = {
    ID: 0,
    Title: '',
    Summary: '',
    BlogImage: '',
    Business: { ID: 0, Title: '' },
    Author: { ID: 0, Title: '' },
    PublishedDate: new Date(),
    ViewsJSON: '',
    BlogLikedBy: ''
};

export const ViewsJSON_NULL = JSON.stringify({ "views": [] });
export const REGEX_SPEC_CHAR = /[^a-zA-Z]/g;