document.addEventListener("DOMContentLoaded", function(event) {

const fileSelect = document.getElementById("fileSelect"),
  fileElem = document.getElementById("hafSelect");

fileSelect.addEventListener("click", function (e) {
  if (fileElem) {
    fileElem.click();
  }
}, false);

fileElem.addEventListener('change', (event) => {
  file = event.target.files.item(0);
  
  var fr = new FileReader();
  fr.onload = function(e) {
    haf = json_parse()(e.target.result);
    console.log(haf);
    
    // set channel title
    document.querySelector(".title-29uC1r").textContent = haf.channel.name + " (retrieved "+ haf._retrieval.time + ")";
    document.querySelector(".header-3uLluP").textContent = "#" + haf.channel.name;
    document.querySelector(".description-1sDbzZ").textContent = haf.channel.topic;
    document.querySelector("#fileSelect").remove();
    
    // populate roster
    var roster = document.querySelector("#roster");
    var template = document.querySelector('template#member');
    
    for (const id in haf.users) {
      var member = haf.users[id];
      
      var clone = template.content.cloneNode(true);
      var av = clone.querySelector("img");
      var displayName = clone.querySelector(".name-uJV0GL");
      var tag = clone.querySelector(".activityText-yGKsKm");

      av.setAttribute('src', member.av);
      displayName.textContent = member.nick;
      tag.textContent = member.tag;

      roster.appendChild(clone);
    }
    
    // populate messages
    var chatlog = document.querySelector("#chat-messages");
    var attTemplate = document.querySelector('template#attachment');
    var template = document.querySelector('template#message');
    
    var md = window.markdownit({html:true,linkify:true});
    
    for (const id in haf.messages) {
      var message = haf.messages[id];
      var member = haf.users[message.author];
      
      var clone = template.content.cloneNode(true);
      var av = clone.querySelector("img.avatar-1BDn8e");
      var displayName = clone.querySelector(".username-1A8OIy");
      var time = clone.querySelector(".timestamp-3ZCmNB");
      var content = clone.querySelector(".messageContent-2qWWxC");
      
      var mContent = message.content;
      
      // replace emojis
      mContent = mContent.replace(/<(a?):(.+?):(\d+)>/gi, function (match, animated, emoteName, emoteID, offset, string) {
        var ext = (animated === "a") ? 'gif' : 'png';
        
        return '<span class="emojiContainer-3X8SvE" role="button" tabindex="0"><img src="https://cdn.discordapp.com/emojis/'+emoteID+'.'+ext+'?v=1" alt=":'+emoteName+':" draggable="false" class="emoji"></span>';
      });
      
      // replace mentions
      mContent = mContent.replace(/<@!?(\d+)>/gi, function (match, mentionID, offset, string) {
        var nick = haf.users[mentionID];
        if (!nick) {
          return '<span class="mention wrapper-3WhCwL mention interactive" tabindex="0" role="button">'+match+'</span>'; 
        }
        return '<span class="mention wrapper-3WhCwL mention interactive" tabindex="0" role="button">@'+nick.nick+'</span>';
      });

      
      av.setAttribute('src', member.av);
      displayName.textContent = member.nick;
      time.textContent = message.created;
      content.innerHTML = md.renderInline(mContent);
      
      for (const attID in message.attachments) {
        var att = message.attachments[attID];
        console.log(att);
        
        var attClone = attTemplate.content.cloneNode(true);
        var urlA = attClone.querySelector(".fileNameLink-9GuxCo");
        var urlB = attClone.querySelector(".downloadWrapper-vhAtLx");
        var size = attClone.querySelector(".metadata-3WGS0M");
        
        urlA.setAttribute('href', att.url);
        urlB.setAttribute('href', att.url);
        urlA.textContent = att.filename;
        size.textContent = att.size + " bytes";
        
        clone.querySelector(".cozyMessage-3V1Y8y").appendChild(attClone);
      }
      
      chatlog.appendChild(clone);
    }
    
    twemoji.parse(document.body, {base:"https://wormrp.syl.ae/twemoji/v/latest/"});
  };
  fr.readAsText(file);
});

});