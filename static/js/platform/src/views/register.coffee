## Register view

# This view is displayed when no user is set for the newebe current instance.
# It displays form to user for registering. Newebe is mono user so 
# only one person can register. When the first person registers, it will become
# the newebe owner.
class RegisterView extends Backbone.View
  el: $("body")

  constructor: ->
    super

  # Clears and focus name field. Registers events.
  initialize: ->
    _.bindAll(this, 'onUserFieldKeyUp')

    @isPosting = false
    $("#platform-user-text-field").val(null)
    $("#platform-user-text-field").focus()
    $("#platform-user-text-field").keyup(@onUserFieldKeyUp)


  # When user field key is up, if it is enter key, it posts typed name to 
  # backend services (commit registration) and displays profile app.
  onUserFieldKeyUp: (event) ->
    if event.keyCode == 13 and not @isPosting
      dataPost = '{ "name":"' + $("#platform-user-text-field").val() + '"}'
      @isPosting = true
      url = "/user/"
      $.post(url, dataPost,
        (data) ->
          $("#register").fadeOut(1600,
            () ->
              $("body").hide()
              $.get("/profile/menu-content/",
                (data) ->
                  $("body").prepend(data)
                  $("#menu").hide()
                  $("#apps").hide()
                  $("body").show()
                  $("#menu").fadeIn()
                  $("#apps").fadeIn()
              )
          )
        , "json"
      )
      
    