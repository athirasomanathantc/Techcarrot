export interface IQuizOption {
    index?: number;
    key?: number;
    Id: number;
    Title: string;
    Question: {
        Title: string;
        Id: number;
    },
    CorrectOption:boolean;
    Checked: boolean;
}