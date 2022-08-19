export interface IEventData{
    ID:string;
    Title:string;
    StartDate:string;
    EndDate:string;
    Description:string;
    EventThumbnail:string;
    Location:string;
    Business:{
        ID:number;
        Title:String;
    };

}