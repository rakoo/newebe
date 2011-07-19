(function(){var a,b,c,d,e,f,g,h,i,j,k=Object.prototype.hasOwnProperty,l=function(a,b){function d(){this.constructor=a}for(var c in b)k.call(b,c)&&(a[c]=b[c]);d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype;return a},m=function(a,b){return function(){return a.apply(b,arguments)}};b=function(){function a(){var a;$("#info-dialog").length===0&&(a=document.createElement("div"),a.id="info-dialog",a.className="dialog",a.innerHTML="Test",$("body").prepend(a)),this.element=$("#info-dialog"),this.element.hide()}a.prototype.display=function(a){this.element.empty(),this.element.append(a),this.element.show();return this.element.fadeOut(4e3)};return a}(),a=function(){function a(a){var b;$("#confirmation-dialog").length===0&&(b=document.createElement("div"),b.id="confirmation-dialog",b.className="dialog",b.innerHTML='<div id="confirmation-text"></div>',b.innerHTML+='<div id="confirmation-buttons"><span href="" id="confirmation-yes">Yes</span><span href="" id="confirmation-no">No</span></div>',$("body").prepend(b)),this.element=$("#confirmation-dialog"),this.element.hide(),this.setNoButton()}a.prototype.setNoButton=function(){var a;a=this.element;return $("#confirmation-no").click(function(){a.fadeOut();return!1})},a.prototype.display=function(a,b){$("#confirmation-text").empty(),$("#confirmation-text").append("<span>"+a+"</span>"),$("#confirmation-yes").click(b);return this.element.show()},a.prototype.hide=function(){return this.element.fadeOut()};return a}(),c=function(){function a(){var a;$("#loading-indicator").length===0&&(a=document.createElement("div"),a.id="loading-indicator",a.innerHTML='<img src="/static/images/clock_32.png" />',$("body").prepend(a)),this.element=$("#loading-indicator"),this.element.hide()}a.prototype.display=function(){return this.element.show()},a.prototype.hide=function(){return this.element.hide()};return a}(),d=function(){function a(b){var c;a.__super__.constructor.apply(this,arguments),this.id=b._id,this.set("noteId",b._id),this.set("author",b.author),this.set("title",b.title),this.set("date",b.date),this.set("content",b.content),this.set("date",b.lastModified),c=b.content.replace(/<(?:.|\s)*?>/g,""),this.attributes.content=c,this.setDisplayDate(),this.id?this.url="/notes/"+this.id+"/":this.url="/notes/all/"}l(a,Backbone.Model),a.prototype.url="/notes/all/",a.prototype.getDisplayDate=function(){return this.attributes.displayDate},a.prototype.setDisplayDate=function(){var a;a=this.attributes.lastModified;return this.setDisplayDateFromDbDate(a)},a.prototype.setDisplayDateFromDbDate=function(a){var b,c;b=Date.parseExact(a,"yyyy-MM-ddTHH:mm:ssZ"),c=b.toString("dd MMM yyyy, HH:mm"),this.attributes.displayDate=c;return b},a.prototype.getAuthor=function(){return this.get("author")},a.prototype.getTitle=function(){return this.get("title")},a.prototype.setTitle=function(a){this.attributes.title=a;return this.set("title",a)},a.prototype.getDate=function(){return this.get("date")},a.prototype.setDate=function(a){return this.set("title",a)},a.prototype.getContent=function(){return this.get("content")},a.prototype.setContent=function(a){this.attributes.content=a;return this.set("content",a)},a.prototype["delete"]=function(){this.url="/notes/"+this.id+"/",this.destroy();return this.view.remove()},a.prototype.isNew=function(){return!this.id};return a}(),e=function(){function a(){a.__super__.constructor.apply(this,arguments)}l(a,Backbone.Collection),a.prototype.model=d,a.prototype.url="/notes/all/",a.prototype.parse=function(a){return a.rows};return a}(),g=function(){function a(){a.__super__.constructor.apply(this,arguments)}l(a,Backbone.View),a.prototype.el=$("#notes-list"),a.prototype.events={"click #notes-new-button":"onNewNoteClicked","click #notes-sort-date-button":"onSortDateClicked","click #notes-sort-title-button":"onSortTitleClicked"},a.prototype.initialize=function(){_.bindAll(this,"onNewNoteClicked"),_.bindAll(this,"onRowClicked"),_.bindAll(this,"onSortDateClicked"),_.bindAll(this,"onSortTitleClicked"),_.bindAll(this,"addAll"),_.bindAll(this,"appendOne"),_.bindAll(this,"prependOne"),_.bindAll(this,"reloadNotes"),this.notes=new e,this.converter=new Showdown.converter,this.notes.bind("add",this.prependOne);return this.notes.bind("refresh",this.addAll)},a.prototype.onNewNoteClicked=function(a){var b,c,e;c={title:"New Note",date:(new Date).toString("yyyy-MM-ddTHH:mm:ssZ"),content:""},b=new d(c),b.save({success:function(a,b){return a.id=b._id}}),e=this.prependOne(b),this.onRowClicked(e),e.focusTitle();return a},a.prototype.onRowClicked=function(a){this.selection!==void 0&&this.selection!==a?(this.selection.unselect(),a.select(),this.selection=a):this.selection===void 0&&(a.select(),this.selection=a);return this.displayText(this.selection)},a.prototype.onSortDateClicked=function(){if(this.dateButton.button("option","disabled")===!1){this.dateButton.button("disable"),this.titleButton.button("enable"),this.notes.url="/notes/all/order-by-date/";return this.reloadNotes()}},a.prototype.onSortTitleClicked=function(){if(this.titleButton.button("option","disabled")!==!0){this.titleButton.button("disable"),this.dateButton.button("enable"),this.notes.url="/notes/all/order-by-title/";return this.reloadNotes()}},a.prototype.addAll=function(){this.notes.each(this.appendOne);return i.hide()},a.prototype.appendOne=function(a){var b,c;c=new f(a),c.registerView(this),b=c.render(),$("#notes-list").append(b);return c},a.prototype.prependOne=function(a){var b,c;c=new f(a),c.registerView(this),b=c.render(),$("#notes-list").prepend(b);return c},a.prototype.displayTutorial=function(a){return $.get("/notes/tutorial/"+a+"/",function(a){return $("#tutorial-news").html(a)})},a.prototype.onSortDateClicked=function(){if(this.dateButton.button("option","disabled")===!1){this.dateButton.button("disable"),this.titleButton.button("enable"),this.notePreviewer.html(null),this.notes.url="/notes/all/order-by-date/";return this.reloadNotes()}},a.prototype.onSortTitleClicked=function(){if(this.titleButton.button("option","disabled")!==!0){this.titleButton.button("disable"),this.dateButton.button("enable"),this.notePreviewer.html(null),this.notes.url="/notes/all/order-by-title/";return this.reloadNotes()}},a.prototype.reloadNotes=function(){i.display(),this.el.html(null),this.notes.fetch();return this.notes},a.prototype.displayText=function(a){var b;this.notePreviewer.html(null),b=this.converter.makeHtml(a.getContent());return this.notePreviewer.html(b)},a.prototype.setListeners=function(){$("#notes-new-button").click(m(function(a){return j.onNewNoteClicked(a)},this)),$("#notes-sort-date-button").click(m(function(a){return j.onSortDateClicked(a)},this)),$("#notes-sort-title-button").click(m(function(a){return j.onSortTitleClicked(a)},this));return this},a.prototype.setWidgets=function(){this.titleButton=$("#notes-sort-title-button"),this.dateButton=$("#notes-sort-date-button"),this.newButton=$("#notes-new-button"),this.notePreviewer=$("#notes-preview"),this.titleButton.button(),this.dateButton.button(),this.dateButton.button("disable"),this.newButton.button();return $("#notes-a").addClass("disabled")};return a}(),f=function(){function a(b){this.model=b,a.__super__.constructor.apply(this,arguments),this.id=this.model.id,this.model.view=this}l(a,Backbone.View),a.prototype.tagName="div",a.prototype.className="notes-note-row",a.prototype.template=_.template('<a class="notes-note-delete">X</a>\n<a class="notes-note-edit">edit</a>\n<input class="notes-note-title" type="text" value="<%= title %>" />\n<p class="news-micropost-date">\n <%= displayDate %> \n</p>\n<div class="spacer"></div>\n<textarea class="notes-note-content"><%= content%> </textarea>'),a.prototype.events={"click .notes-note-delete":"onDeleteClicked","click .notes-note-edit":"onEditClicked","keyUp .notes-note-title":"onTitleKeyUp",mouseover:"onMouseOver",mouseout:"onMouseOut",click:"onRowClicked"},a.prototype.onRowClicked=function(a){return this.view.onRowClicked(this)},a.prototype.onMouseOver=function(){},a.prototype.onMouseOut=function(){},a.prototype.onTitleKeyUp=function(a){this.model.setTitle(this.titleField.val());return this.model.save()},a.prototype.onContentKeyUp=function(a){this.model.setContent(this.contentField.val()),this.view.displayText(this);return this.model.save()},a.prototype.onEditClicked=function(a){if(this.contentField.is(":hidden")){this.contentField.slideDown();return this.contentField.focus()}return this.contentField.slideUp()},a.prototype.onDeleteClicked=function(){return h.display("Are you sure you want to delete this note ?",m(function(){h.hide();return this.model["delete"]()},this))},a.prototype.select=function(){$(this.el).addClass("selected"),this.titleField.addClass("selected"),this.deleteButton.show();return this.editButton.show()},a.prototype.unselect=function(){$(this.el).removeClass("selected"),this.titleField.removeClass("selected"),this.deleteButton.hide();return this.editButton.hide()},a.prototype.focusTitle=function(){return this.titleField.focus()},a.prototype.registerView=function(a){return this.view=a},a.prototype.getContent=function(){return this.contentField.val()},a.prototype.remove=function(){return $(this.el).remove()},a.prototype.render=function(){this.model.getDisplayDate()||this.model.setDisplayDate(),$(this.el).html(this.template(this.model.toJSON())),this.deleteButton=this.$(".notes-note-delete"),this.editButton=this.$(".notes-note-edit"),this.titleField=this.$(".notes-note-title"),this.contentField=this.$(".notes-note-content"),this.deleteButton.button(),this.editButton.button(),this.deleteButton.hide(),this.editButton.hide(),this.contentField.hide();return this.setListeners()},a.prototype.setListeners=function(){this.titleField.keyup(m(function(a){return this.onTitleKeyUp(a)},this)),this.contentField.keyup(m(function(a){return this.onContentKeyUp(a)},this)),this.$(".notes-note-row").click(m(function(a){return this.onRowClicked(a)},this));return this.el};return a}(),j=new g,i=new c,h=new a,j.setWidgets(),j.setListeners(),j.reloadNotes()}).call(this)