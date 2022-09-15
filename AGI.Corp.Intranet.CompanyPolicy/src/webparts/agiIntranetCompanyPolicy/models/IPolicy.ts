export interface IPolicy {
    Id: number,
    Title: string,
    AttachmentFiles: Array<{
        FileName: string;
    }>;
    PolicyType: string,
    PublishedDate: string,
    PolicyDescription: string
    Tags: string;
}