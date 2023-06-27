// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');
const { CustomerBotdialogs } = require('./componentDialogs/dialogs_a')
const { DialogSet } = require('botbuilder-dialogs');


class CustomerBot extends ActivityHandler {
    constructor(conversationState,userState) {
        super();
        this.conversationState = conversationState;
        this.userState = userState;
        this.dialogState = conversationState.createProperty("dialogState")
        this.dialogSet = new DialogSet(this.dialogState);
        this.CustomerBotdialogs = new CustomerBotdialogs(this.conversationState, this.userState, this.dialogSet);
        this.previousIntent = this.conversationState.createProperty('previousIntent')
        this.conversationData = this.conversationState.createProperty('conversationData')


        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {

            await this.dispatchToInternetAsync(context)
            // const replyText = `Rayan: ${ context.activity.text }`;
            // await context.sendActivity(MessageFactory.text(replyText, replyText));
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            await this.sendWelecomeMessage(context)
            
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
        this.onDialog(async (context, next)=>{
            await this.conversationState.saveChanges(context, false)
            await this.userState.saveChanges(context, false)
            await next()
        })
    }
    async sendWelecomeMessage(turnContext){
        const {activity} = turnContext

        for( const idx in activity.membersAdded){
            if(activity.membersAdded[idx].id != activity.recipient.id){
                const welcomeMessage = `welcome to Usha customer care ${activity.membersAdded[idx].name }.`
                await turnContext.sendActivity(welcomeMessage)
                await this.sendSuggestedActions(turnContext)
            }
        }
    }

    async sendSuggestedActions(turnContext){
        var reply = MessageFactory.suggestedActions(['ESS portal / SFA portal / Workplace','Policy related Informationt','Payroll related information ','Statutory Compliances','Medical Insurance',' Feedback survey','Grievance','location ','Talent Acquisition','Employee Offboarding','Leave Management','Attendance regularization','Learning & Development','Employee Engagement','List of Holidays ','Working hours ','Career Progression','Achievements & Recognition ','Transfer movement','Expenses','POSH & Code of Conduct','Shift timings','IT Support','Travel Helpdesk'])
        await turnContext.sendActivity(reply)
    }

    async dispatchToInternetAsync(context){
            var currentIntent =''
            const previousIntent = await this.previousIntent.get(context,{})
            const conversationData = await this.conversationData.get(context,{})

            if(previousIntent.intentName && conversationData.endDialog === false)
            {
                currentIntent = previousIntent.intentName
            }else if (previousIntent.intentName && conversationData.endDialog === true){
            currentIntent = context.activity.text
            }else{
                currentIntent = context.activity.text
                await this.previousIntent.set(context, {intentName: context.activity.text})
            }
        switch(currentIntent){
            case 'ESS portal / SFA portal / Workplace':
                console.log('inside query dialog ')
                await this.conversationData.set(context, {endDialog: false})
                await this.CustomerBotdialogs.run(context,this.dialogState)
                conversationData.endDialog = await this.CustomerBotdialogs.IsDialogComplete()


                break;

            default:
                console.log(`incoming message did not be solved`)
        }

    }
}
module.exports.CustomerBot = CustomerBot;
