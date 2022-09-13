export interface ISurveyOption {
    index?: number;
    key?: number;
    Id: number;
    Title: string;
    Question: {
        Title: string;
        Id: number;
    },
    Checked: boolean;
}