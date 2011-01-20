(function(){var i,j,g,k,l,m,d,n,e,o=Object.prototype.hasOwnProperty,f=function(b,a){function c(){this.constructor=b}for(var h in a)if(o.call(a,h))b[h]=a[h];c.prototype=a.prototype;b.prototype=new c;b.__super__=a.prototype;return b};l=function(){function b(){var a;a=document.createElement("div");a.id="info-dialog";a.innerHTML="Test";$("body").prepend(a);this.element=$("#info-dialog");this.element.hide()}b.prototype.display=function(a){this.element.empty();this.element.append(a);this.element.show();
return this.element.fadeOut(4E3)};return b}();m=function(){function b(){var a;a=document.createElement("div");a.id="loading-indicator";a.innerHTML='<img src="/static/images/clock_32.png" />';$("body").prepend(a);this.element=$("#loading-indicator");this.element.hide()}b.prototype.display=function(){return this.element.show()};b.prototype.hide=function(){return this.element.hide()};return b}();i=function(){function b(a){b.__super__.constructor.apply(this,arguments);this.set("url",a.url);this.id=a.slug+
"/";a.state&&this.set("state",a.state)}f(b,Backbone.Model);b.prototype.url="/contacts/";b.prototype.getUrl=function(){return this.get("url")};b.prototype.getState=function(){return this.get("state")};b.prototype.setState=function(a){return this.set("state",a)};b.prototype["delete"]=function(){this.url="/contacts/"+this.id;this.destroy();return this.view.remove()};b.prototype.saveToDb=function(){this.url="/contacts/"+this.id;this.save(null,{success:function(a){a.setState("Trusted");a.view.refresh("Trusted");
return true},error:function(a){a.setState("Error");a.view.refresh("Error");return true}});return this.url};b.prototype.isNew=function(){return!this.getState()};return b}();j=function(){function b(){b.__super__.constructor.apply(this,arguments)}f(b,Backbone.Collection);b.prototype.model=i;b.prototype.url="/contacts/";b.prototype.comparator=function(a){return a.getUrl()};b.prototype.parse=function(a){return a.rows};return b}();g=function(){function b(a){this.model=a;b.__super__.constructor.apply(this,
arguments);this.model.view=this}f(b,Backbone.View);b.prototype.tagName="div";b.prototype.className="platform-contact-row";b.prototype.template=_.template('<span class="platform-contact-row-buttons">\n<% if (state === "Wait for approval") { %>\n  <a class="platform-contact-wap">Confim</a>\n<% } %>\n<a class="platform-contact-delete">X</a>    \n</span>\n<p class="platform-contact-url">\n <%= url %> \n <span class="platform-contact-state"> (<%= state %>)</span>\n</p>');b.prototype.events={"click .platform-contact-delete":"onDeleteClicked",
"click .platform-contact-wap":"onConfirmClicked",mouseover:"onMouseOver",mouseout:"onMouseOut"};b.prototype.onMouseOver=function(){return this.$(".platform-contact-row-buttons").show()};b.prototype.onMouseOut=function(){return this.$(".platform-contact-row-buttons").hide()};b.prototype.onDeleteClicked=function(){return this.model["delete"]()};b.prototype.onConfirmClicked=function(){return this.model.saveToDb()};b.prototype.remove=function(){return $(this.el).remove()};b.prototype.refresh=function(a){return this.$(".platform-contact-state").text("("+
a+")")};b.prototype.render=function(){$(this.el).html(this.template(this.model.toJSON()));this.$(".platform-contact-delete").button();this.$(".platform-contact-wap").button();this.$(".platform-contact-row-buttons").hide();return this.el};return b}();k=function(){function b(){b.__super__.constructor.apply(this,arguments)}f(b,Backbone.View);b.prototype.el=$("#news");b.prototype.isCtrl=false;b.prototype.events={"click #contact-post-button":"onPostClicked","submit #contact-post-button":"onPostClicked",
"click #contact-alm-button":"onAllClicked","click #contact-pending-button":"onPendingClicked","click #contact-request-button":"onRequestClicked"};b.prototype.initialize=function(){_.bindAll(this,"postNewContact","appendOne","prependOne","addAll");_.bindAll(this,"onPostClicked");this.contacts=new j;this.contacts.bind("add",this.prependOne);return this.contacts.bind("refresh",this.addAll)};b.prototype.onKeyDown=function(a){a.keyCode===13&&this.isCtrl&&this.postNewContact();return a};b.prototype.onPostClicked=
function(a){a.preventDefault();this.postNewContact();return a};b.prototype.onAllClicked=function(a){a.preventDefault();return this.onFilterClicked("#contact-all-button","/contacts/")};b.prototype.onPendingClicked=function(a){a.preventDefault();return this.onFilterClicked("#contact-pending-button","/contacts/pending/")};b.prototype.onRequestClicked=function(a){a.preventDefault();return this.onFilterClicked("#contact-request-button","/contacts/requested/")};b.prototype.onFilterClicked=function(a,c){if(this.lastFilterClicked!==
a){$(a).button("option","disabled",true);$(this.lastFilterClicked).button("option","disabled",false);this.lastFilterClicked=a;return this.reloadContacts(c)}};b.prototype.reloadContacts=function(a){e.display();this.clearContacts();this.contacts.url=a;this.contacts.fetch();return this.contacts};b.prototype.clearContacts=function(){return $("#contacts").empty()};b.prototype.addAll=function(){this.contacts.each(this.appendOne);e.hide();return this.contacts};b.prototype.appendOne=function(a){var c;c=new g(a);
a=c.render();$("#contacts").prepend(a);return c};b.prototype.prependOne=function(a){var c;c=new g(a);a=c.render();$("#contacts").prepend(a);e.hide();return c};b.prototype.clearPostField=function(){$("#contact-url-field").val(null);$("#contact-url-field").focus();return $("#contact-url-field")};b.prototype.fetch=function(){this.contacts.fetch();return this.contacts};b.prototype.postNewContact=function(){var a;a=$("#contact-url-field").val();if(this.contacts.find(function(c){return a===c.getUrl()}))n.display("Contact is already in your list");
else{e.display();this.contacts.create({url:a});$("#contact-url-field").val(null);$("#contact-url-field").focus()}return false};b.prototype.setListeners=function(){$("#contact-url-field").keydown(function(a){return d.onKeyDown(a)});$("#contact-post-button").submit(function(a){return d.onPostClicked(a)});$("#contact-post-button").click(function(a){return d.onPostClicked(a)});$("#contact-all-button").click(function(a){return d.onAllClicked(a)});$("#contact-pending-button").click(function(a){return d.onPendingClicked(a)});
return $("#contact-request-button").click(function(a){return d.onRequestClicked(a)})};b.prototype.setWidgets=function(){$("#contact-all-button").button();$("#contact-pending-button").button();$("#contact-request-button").button();$("input#contact-post-button").button();$("#contact-a").addClass("disabled");$("#contact-all-button").button("option","disabled",true);return this.lastFilterClicked="#contact-all-button"};return b}();n=new l;e=new m;d=new k;d.setWidgets();d.setListeners();d.clearPostField();
d.fetch()}).call(this);
