const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const command = require('./command');
const firstMessage = require('./first-message');
const roleClaim = require('./role-claim');
const poll= require('./poll')
const welcome = require('./welcome')
const memberCount=require('./member-count')
const sendMessage = require('./send-message')
client.on('ready', () =>{
        console.log("Client is running")
        //firstMessage(client, '822458933246820405', 'hello world!!!', ['🔥', '🍉']);
        
        //help
        const guild= client.guilds.cache.get('822458933246820402')
        const channel= guild.channels.cache.get('822458933246820405')

        sendMessage(channel, 'hello World',3);
        welcome(client);
        poll(client);
        memberCount(client)
       
        command(client,'help', message => {
            message.channel.send(`
            these are the supported commands
            **!help** - displays the help menu
            **!add<num1> <num2>** -adds two numbers 
            **!sub<num1> <num2>** -adds two numbers 
            `);
        });
        const { prefix } = config
        
        client.user.setPresence({
            activity:{
                name: `"${prefix}help"for help`
            },
        });
        //roleClaim(client);
    
    command(client,['ping','test'],message =>{
        message.channel.send('Pong!')
    });
    command(client,'ban',message =>{
        const {member,mentions}=message
        const tag = `<@${member.id}>`

        if(
            member.hasPermission('ADMINISTRATOR') || 
            member.hasPermission('BAN_MEMBERS')
            )
        {
            const target = mentions.users.first()
            if (target){
                const targetMember = message.guild.members.cache.get(target.id)
                targetMember.ban()
                message.channel.send(`${tag} The user has been banned`)
            }else{
                message.channel.send(`${tag} Please specify someone to ban.`)
            }
          }else{
            message.channel.send(`${tag} You do not have the permission to use this command`)
        }
    });
    command(client,'kick',message =>{
        const {member,mentions}=message
        const tag = `<@${member.id}>`

        if(
            member.hasPermission('ADMINISTRATOR') || 
            member.hasPermission('KICK_MEMBERS')
            )
        {
            const target = mentions.users.first()
            if (target){
                const targetMember = message.guild.members.cache.get(target.id)
                targetMember.kick()
                message.channel.send(`${tag} The user has been kicked`)
            }else{
                message.channel.send(`${tag} Please specify someone to kick.`)
            }
          }else{
            message.channel.send(`${tag} You do not have the permission to use this command`)
        }
    });
    command(client, 'servers',message =>{
        client.guilds.cache.forEach((guild)=>{
            message.channel.send(
                `${guild.name} has a total of ${guild.memberCount} members`);
        });
    });
    command(client,['cc','clearchannel'], (message) => {
        if(message.member.hasPermission('ADMINISTRATOR')){
            message.channel.messages.fetch().then((results) => {
                message.channel.bulkDelete(results)
            });
        }
    });
     
});

client.login(process.env.TOKEN);