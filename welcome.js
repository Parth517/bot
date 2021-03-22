module.exports = (client) => {
    const channelId = '823509089895448626' // welcome channel
    const targetChannelId ='823556157905960961'//rules and regulation
   
    client.on('guildMemberAdd', (member) => {
      const message = `Please welcome <@${
        member.id}> to the server! Please check out 
      ${member.guild.channels.cache
        .get(targetChannelId).
        toString()}`
  
      const channel = member.guild.channels.cache.get(channelId)
      channel.send(message)
    })
  }