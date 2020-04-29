export interface INotification
{
        id: number,
        author: string,
        authorId: string,
        recipient: string,
        plainContent: string,
        htmlContent: string,
        createdBy: string,
        createdDate: Date,
        threadId: number,
        subject: string,
        hasBeenRead: boolean,
        dealId: number,
        dealPrimaryPartyName: string,
        lastModDate: Date,
        lastModBy: number,
        archive: boolean,
        memoToFile: string,
        sendToOfficer: string,
        userProfileURL: string,
        requirementId: number,
        threadName: string

}