from django.conf import settings
from django.contrib.sessions.middleware import SessionMiddleware

class PortScopedSessionMiddleware(SessionMiddleware):
    def process_request(self, request):
        referer = request.META.get('HTTP_REFERER', '')
        # Check if requested from the admin panel (port 5175)
        if ':5175' in referer or '127.0.0.1:5175' in referer:
            cookie_name = 'admin_sessionid'
        else:
            cookie_name = 'sessionid'
            
        session_key = request.COOKIES.get(cookie_name)
        request.session = self.SessionStore(session_key)

    def process_response(self, request, response):
        referer = request.META.get('HTTP_REFERER', '')
        if ':5175' in referer or '127.0.0.1:5175' in referer:
            cookie_name = 'admin_sessionid'
        else:
            cookie_name = 'sessionid'
            
        # Temporarily override settings.SESSION_COOKIE_NAME for the parent process_response call
        original_cookie_name = getattr(settings, 'SESSION_COOKIE_NAME', 'sessionid')
        settings.SESSION_COOKIE_NAME = cookie_name
        try:
            response = super().process_response(request, response)
        finally:
            settings.SESSION_COOKIE_NAME = original_cookie_name
            
        return response
