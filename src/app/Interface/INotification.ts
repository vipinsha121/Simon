export interface INotification
{
        id: number,
        author: string,
        plainContent: string,
        htmlContent: string,
        createdDate: Date,
        subject: string,
        hasBeenRead: boolean,
        notifyLevel: string

}