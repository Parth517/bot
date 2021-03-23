const mongo = require('./mongo')
const command = require('./command')
const welcomeSchema = require('./schemas/welcome-schema')
const cache= {}//guildId:[channelId,text]



module.exports = (client) => {
    /*const channelId = '823509089895448626' // welcome channel
    const targetChannelId ='823556157905960961'//rules and regulation
   
    client.on('guildMemberAdd', (member) => {
      const message = `Please welcome <@${
        member.id}> to the server! Please check out 
      ${member.guild.channels.cache
        .get(targetChannelId).
        toString()}`
  
      const channel = member.guild.channels.cache.get(channelId)
      channel.send(message)
    })*/
    //!setwelcome <message>
    command(client, 'setwelcome',async(message) =>{
      const {member,channel,content,guild } = message

      if(!member.hasPermission('ADMINISTRATOR')){
        channel.send('You dont have permission to use this command.')
        return;
      }

      let text = content

      //!setwelocme hello world
      //[!setwelcome,hello,world]
      const split = content.split(' ')

      if(split.length<2){
        channel.send('Please provide a message')
        return;
      }

      split.shift()
      text = split.join(' ')

      cache[guild.Id]=[channel.id,text]


      await mongo().then(async(mongoose) => {
        try{
          await  welcomeSchema.findOneAndUpdate({
            _id:guild.id,
          },{
            _id:guild.id,
            channelId:channel.id,
            text,
          },{
            upsert: true
          })
        
        }finally{
          mongoose.connection.close();
        }

      })
    });

    const onJoin = async member =>{
      const { guild } = member

      let data = cache[guild.id]

      if(!data){
        console.log('fetching from database')
        await mongo().then(async (mongoose) => {
          try{
            const result = await welcomeSchema.findOne({_id : guild.id})
            cache[guild.id] = data =[result.channelId,result.text]
          
          }finally{
            mongoose.connection.close();
          }
        });
      }
      const channelId=data[0]
      const text=data[1]

      const channel = guild.channels.cache.get(channelId)
      channel.send(text.replace(/<@>/g,`<@${member.id}>`))

      //<@>
 
    }
    command(client,'simjoin',message =>{
      onJoin(message.member)
    });
    client.on('guildMemberAdd',member =>{
      onJoin(member)
    })
  }