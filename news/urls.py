from django.conf.urls.defaults import patterns

from newebe.lib.resource import DirectTemplateResource
from newebe.news.views import MicroPostResource, ContactMicroPostResource

news_item_handler = MicroPostResource()

urlpatterns = patterns('',
    (r'^$', 
        DirectTemplateResource("news/news.html")),
    (r'^content/$', 
        DirectTemplateResource("news/news_content.html")),
    (r'^tutorial/1/$', 
        DirectTemplateResource("news/tutorial_1.html")),
    (r'^tutorial/2/$', 
        DirectTemplateResource("news/tutorial_2.html")),

    (r'^microposts/$', 
        news_item_handler),
    (r'^microposts/contacts/$', 
        ContactMicroPostResource()),
    (r'^microposts/(?P<startKey>[0-9\-]+)/$', 
        news_item_handler),
)
