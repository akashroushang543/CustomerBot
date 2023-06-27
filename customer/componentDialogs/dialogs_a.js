const { WaterfallDialog, ComponentDialog, DialogTurnStatus, DialogSet} = require('botbuilder-dialogs')
const {ConfirmPrompt,ChoicePrompt,DateTimePrompt,NumberPrompt,TextPrompt} = require('botbuilder-dialogs')

const CHOICE_PROMPT  = 'CHOICE_PROMPT'
const CONFIRM_PROMPT ='CONFIRM_PROMPT'
const DATETIME_PROMPT ='DATETIME_PROMPT'
const NUMBER_PROMPT ='NUMBER_PROMPT'
const TEXT_PROMPT ='TEXT_PROMPT'
const WATERFALL_DIALOG = 'WATERFALL_DIALOG' 
var endDialog ='';

class CustomerBotdialogs extends ComponentDialog{
    constructor(conversationState,userState){
        super('CustomerBotdialogs')
        this.conversationState = conversationState;
        this.userState = userState;

this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
this.addDialog(new DateTimePrompt(DATETIME_PROMPT));
this.addDialog(new NumberPrompt(NUMBER_PROMPT, this.agePromptValidator));
this.addDialog(new TextPrompt(TEXT_PROMPT));


this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
this.firstStep.bind(this),
this.getName.bind(this),
this.GetPhoneNumber.bind(this),
this.getQuery.bind(this),
this.getSummay.bind(this)
]))

this.initialDialogId = WATERFALL_DIALOG
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
          await dialogContext.beginDialog(this.id);
        }
      }
      
    // async run(turnContext, accessor){
    //     const dialogSet = new DialogSet(accessor)
    //     dialogSet.add(this)
    //     const dialogContext = await dialogSet.createContext(turnContext)
    //     const results = await dialogContext.continueDialog();
    //     if(results.status ===DialogTurnStatus.empty){
    //         await dialogContext.beginDialog(this.id)
    //     }
    // }

    async firstStep(step){
        endDialog = false;
        return await step.prompt(CONFIRM_PROMPT,`do you have query related to ESS portal / SFA portal / Workplace`,[`yes`,`No`])

    }
    async getName(step){
        if(step.result === true)
        {
        return await step.prompt(TEXT_PROMPT,`Provide your Name`)
        }
    }
    async GetPhoneNumber(step){
        step.values.name = step.result  //this wil save the value of previous state
        return await step.prompt(NUMBER_PROMPT, `ENTER  YOUR PHINE NO.`)
    }
    async getQuery(step){
        step.values.phone_no = step.result  //this wil save the value of previous state
        return await step.prompt(TEXT_PROMPT,`provide your query`)
    }
    async getSummay(step){
        step.values.Query = step.result  //this wil save the value of previous state
        var msg = `hello ${step.values.name} \n you raised a Query from mobile no. ${step.values.phone_no} \n your query is :  " ${step.values.Query} " `
         await step.context.sendActivity(msg)
         endDialog = true;
         return await step.endDialog()
    }

async IsDialogComplete(){
    return endDialog

}
}
module.exports.CustomerBotdialogs = CustomerBotdialogs ;