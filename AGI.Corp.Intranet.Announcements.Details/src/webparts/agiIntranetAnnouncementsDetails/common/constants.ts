
export const LIST_ANNOUNCEMENTS = 'Announcements';
export const LIST_ANNOUNCEMENTS_TRANSACTION = 'AnnouncementsTransaction';
export const LIST_INTRANETCONFIG = 'IntranetConfig';
export const ANNOUNCEMENTS_NULL_ITEM = {
    ID: 0,
    Title: '',
    Description: '',
    Summary: '',
    AnnouncementImage: '',
    AnnouncementThumbnail: '',
    PublishedDate: new Date(),
    ViewsJSON: '',
    Business:{ Title: '', ID: 0 },
    Functions: { Title: '', ID: 0 },
    Location: '',
    Announcements : { ID: -1 }
};

export const ViewsJSON_NULL = JSON.stringify({ "views": [] });
export const REGEX_SPEC_CHAR = /[^a-zA-Z]/g;