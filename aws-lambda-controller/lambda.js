const INSTANCE = process.env.EC2_INSTANCE
const REGION = process.env.EC2_REGION
const TOKEN = process.env.TOKEN


const AWS = require('aws-sdk')
const EC2 =

const ACTIONS = {}

ACTIONS.start = (ec2){

}



exports.handler = ({action, token}) => {


    return new Promise((resolve, reject)=>{

        if(token !== TOKEN){
            reject("Invalid token")
        }

        if(!action in ACTIONS){
            reject("Action \"${action}\" not part of list of actions")
        }

        const ec2 = new AWS.EC2({region : REGION,endpoint : INSTANCE})

        const response = {
            statusCode: 200,
            body: JSON.stringify('Hello from Lambda!'),
        };
        resolve(response);
    })
};
