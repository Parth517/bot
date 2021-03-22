module.exports = (channel,text,duration = -1) => {
    channel.send(text).then((message) => {
        if (duration === -1){
            return
        }
        setTimeout(() =>{

        },1000 * duration)
            message.delete();
        
    });
}