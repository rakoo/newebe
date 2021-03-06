## NewsView


# Main view for news application
class NewsView extends Backbone.View
  el: $("#news")

  # Local variable needed to test if user type a CTRL+Enter keyboard shortcut
  # while typing his post content.
  isCtrl: false


  ### Events ###

  events:
    "click #news-post-button" : "onPostClicked"
    "click #news-attach-button" : "onAttachClicked"
    "click #news-my-button" : "onMineClicked"
    "click #news-all-button" : "onAllClicked"
    "click #news-more" : "onMoreNewsClicked"


  constructor: ->
    super()

  # Initiliaze binds functions to this view, sets up micropost colleciton
  # behaviours.
  initialize: ->
    _.bindAll(this, 'postNewPost', 'appendOne', 'prependOne', 'addAll')
    _.bindAll(this, 'displayMyNews', 'onMoreNewsClicked', 'addAllMore')
    _.bindAll(this, 'onDatePicked')

    @tutorialOn = true
    @microposts = new MicroPostCollection
    
    @microposts.bind 'add', @prependOne
    @microposts.bind 'reset', @addAll
        
    @moreMicroposts = new MicroPostCollection
    @moreMicroposts.bind 'reset', @addAllMore

    @currentPath = '/microposts/all/'

    @selectedRow = null
    @attachments = []


  ### Listeners  ###

  # When key control is up it set is ctrl pressed variable to false.
  onKeyUp: (event) ->
    if(event.keyCode == 17)
      @isCtrl = false
    event


  # When key is down, if enter and CTRL are down together, the content field
  # is posted.
  onKeyDown: (event) ->
    if(event.keyCode == 17)
      @isCtrl = true

    if (event.keyCode == 13 and @isCtrl)
      @isCtrl = false
      @postNewPost()
    event
 

  # When post button is clicked the content field is posted.
  onPostClicked: (event) ->
    event.preventDefault()
    @postNewPost()
    event


  # When attach button is clicked a new document selector dialog is displayed.
  # Once attachment is selected, document is added to attachment list.
  onAttachClicked: (event) ->
    selectorDialog.display ["Note", "Picture"], (attachment) =>
        @attachments.push attachment
        if attachment.type == "Note"
            $("#news-attach-note-image").show()
        else
            $("#news-attach-picture-image").show()

  
  # When my news is clicked it reloads all news from current user since today.
  onMineClicked: (event) ->
    $("#news-my-button").button("disable")
    $("#news-all-button").button("enable")
    @clearNews(null)
    $("#news-from-datepicker").val(null)
    @currentPath = '/microposts/mine/'
    @reloadMicroPosts(null)
    event


  # When all news is clicked it reloads news from contacts and user since today.
  onAllClicked: (event) ->
    $("#news-all-button").button("disable")
    $("#news-my-button").button("enable")
    @clearNews(null)
    $("#news-from-datepicker").val(null)
    @currentPath = '/microposts/all/'
    @reloadMicroPosts(null)
    event

  
  # When a date is picked it loads all news from current user since this date.
  onDatePicked: (dateText, event) ->
    d = Date.parse(dateText)
    sinceDate = d.toString("yyyy-MM-dd")

    @clearNews()
    @reloadMicroPosts(sinceDate)


  # Select clicked row and deselect previously clicked row.
  onRowClicked: (row) ->
    if row != @selectedRow
      if @selectedRow
        @selectedRow.deselect()
      row.select()
      @selectedRow = row

  
  # When more news is clicked, GET URL is updated with last register date,
  # (because /news/news-item/*date* returns 10 last micro posts until *date*).
  # Then it retrieves posts and display them after current post list.
  onMoreNewsClicked: ->
    loadingIndicator.display()
    if @lastDate
      @moreMicroposts.url = @currentPath + @lastDate
    else
      @moreMicroposts.url = @currentPath

    @moreMicroposts.fetch()
    @moreMicroposts


  ### Functions  ###

  
  # Clear micro posts list then display more news button.
  clearNews: ->
    $("#micro-posts").empty()
    $("#news-more").show()

  
  # Add more news to current list. It skips first result to not display again
  # last post. If less thant 10 rows are returned, it means that there are 
  # no more posts, so more button is hidden.
  addAllMore: ->
    microPostsArray = @moreMicroposts.toArray().reverse()
    microPostsArray = _.rest(microPostsArray)
    _.each(microPostsArray, @appendOne)
    @lastDate = @moreMicroposts.last().getUrlDate()
    
    if(microPostsArray.length < 10)
      $("#news-more").hide()

    loadingIndicator.hide()
    @lastDate

  
  # Add news to current list. If less thant 10 rows are returned, 
  # it means that there are no more posts, so more button is hidden.
  addAll: ->
    if @microposts.length > 0
      @tutorialOn = false
      @lastDate = @microposts.first().getUrlDate()
      if @microposts.length < 10
        $("#news-more").hide()
    else
      if @tutorialOn
        @displayTutorial(1)
      else
        $("#tutorial").html(null)
      $("#news-more").hide()
    @microposts.each(@prependOne)

    loadingIndicator.hide()
    @microposts.length

   
  # Appends *micropost* to the beginning of current post list (render it).
  appendOne: (micropost) ->
    row = new MicroPostRow micropost, @
    el = row.render()
    $("#micro-posts").append(el)
    row

   
  # Prepends *micropost* to the end of current post list (render it).
  # Displays second tutorial of tutorial mode is on.
  prependOne: (micropost) ->
    row = new MicroPostRow micropost, @
    el = row.render()
    $("#micro-posts").prepend(el)
    loadingIndicator.hide()
    if @tutorialOn
      @displayTutorial(2)
      @tutorialOn = false
    row


  # Displays tutorial in the tutorial DIV element.
  displayTutorial: (index) ->
    $.get("/microposts/tutorial/" + index + "/", (data) ->
      $("#tutorial-news").html(data)
    )


  # Clears post field and focus it.
  clearPostField: () ->
    $("#id_content").val(null)
    $("#id_content").focus()
    $("#id_content")

  
  # Clears micro posts lists and reload micro posts until *date*.
  reloadMicroPosts: (date, path) ->
    loadingIndicator.display()
    @selectedRow = null

    @microposts.url = @currentPath
    if date
      @microposts.url = @currentPath + date + '-23-59-00/'
    @microposts.fetch()
    @microposts

  
  # Reloads micro post list.
  fetch: () ->
    @selectedRow = null
    @microposts.fetch()
    @microposts

  
  # Sends a post request to server and add post at the beginning of current 
  # post list. 
  # Urls are converted to markdown links to be displayed automatically as href
  # links.
  postNewPost: ->
    content = $("#id_content").val()
    if content
      loadingIndicator.display()
      content = @convertUrlToMarkdownLink(content)

      @microposts.create {
          content: content
          attachments: @attachments
        },
        {
          success : (nextModel, resp) =>
            loadingIndicator.hide()
            nextModel.view.el.id = resp._id
            nextModel.id = resp._id
            nextModel.attachments = resp.attachments
            $("#news-attach-note-image").hide()
            $("#news-attach-picture-image").hide()
            @attachments = []
          error: ->
            infoDialog.display "An error occured micropost was not posted."
            loadingIndicator.hide()
        }
      $("#id_content").val(null)
      $("#id_content").focus()

  # Convert markdown url to href link for better display.
  convertUrlToMarkdownLink: (content) ->
    regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g

    urls = content.match(regexp)

    if urls
     for url in urls
       urlIndex = content.indexOf(url)
       if urlIndex == 0 or content.charAt(urlIndex - 1) != '('
         content = content.replace(url, "[" + url + "]" + "(" + url + ")" )
    content


  # When more news is clicked, GET URL is updated with last register date,
  # (because /news/news-item/*date* returns 10 last micro posts until *date*).
  # Then it retrieves posts and display it at the follown of current post list.
  onMoreNewsClicked: ->
    loadingIndicator.display()
    if @lastDate
      @moreMicroposts.url = @currentPath + @lastDate
    else
      @moreMicroposts.url = @currentPath

    @moreMicroposts.fetch()
    @moreMicroposts


  ### UI Builders  ###

  
  # Set listeners and corresponding callbacks on view widgets.
  setListeners: ->
    $("#id_content").keyup((event) -> newsApp.onKeyUp(event))
    $("#id_content").keydown((event) -> newsApp.onKeyDown(event))
    $("input#news-from-datepicker").datepicker({
      onSelect : @onDatePicked
    })

  
  # Build JQuery widgets.
  setWidgets: ->
    $("#news-post-button").button()
    $("#news-attach-button").button()
    $("#news-my-button").button()
    $("#news-all-button").button()
    $("#news-all-button").button("disable")
    $("#news-more").button()
    $("#news-from-datepicker").val(null)
    $("#news-a").addClass("disabled")
    $("#news-attach-note-image").hide()
    $("#news-attach-picture-image").hide()

