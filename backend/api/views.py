import random
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.contrib.auth import login, logout
from django.db.models import Q
from .models import User, Category, Product, Cart, Order, OrderItem, OTPVerification, ContactFeedback, Offer
from .serializers import (
    UserSerializer, UserRegistrationSerializer, LoginSerializer,
    CategorySerializer, ProductSerializer, CartSerializer,
    OrderSerializer, OrderCreateSerializer, ContactFeedbackSerializer, OfferSerializer
)




@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp_view(request):
    email = request.data.get('email')
    if not email:
        return Response({'email': ['Email field is required']}, status=status.HTTP_400_BAD_REQUEST)
    
    # Generate 6 digit numeric OTP
    otp = f"{random.randint(100000, 999999)}"
    
    # Save/Update in database
    OTPVerification.objects.update_or_create(
        email=email,
        defaults={'otp': otp}
    )
    
    # Write OTP to a local file for convenient offline testing
    try:
        otp_file_path = 'E:/Shop Sales Uma/backend/last_otp.txt'
        with open(otp_file_path, 'w') as f:
            f.write(f"OTP for {email} is: {otp}\n")
    except Exception as e:
        print("Failed to write OTP to file:", e)
        
    # Attempt to send real-time email
    email_sent = False
    try:
        subject = 'Verify Your Email - Uma Grocery Shop'
        message = f'''Dear Customer,

Thank you for choosing Uma Grocery Shop!

Your OTP for registration verification is: {otp}

Please enter this verification number on the signup page to complete your registration and place your order.

Happy Shopping!
Best regards,
Uma Grocery Shop Team'''

        html_message = f'''
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Georgia&family=Outfit:wght@300;400;600;700&display=swap');
            body {{
              background-color: #FAF7FC;
              font-family: 'Outfit', sans-serif;
              margin: 0;
              padding: 20px 10px;
              -webkit-font-smoothing: antialiased;
            }}
            .email-container {{
              max-width: 600px;
              background-color: #ffffff;
              border-radius: 24px;
              box-shadow: 0 12px 30px rgba(29, 1, 48, 0.06);
              overflow: hidden;
              border: 1px solid #EADBFA;
              margin: 0 auto;
            }}
            .header-banner {{
              background-color: #1D0130;
              padding: 35px 20px;
              text-align: center;
              border-bottom: 4px solid #E4C560;
            }}
            .header-title {{
              color: #E4C560;
              font-family: 'Georgia', serif;
              font-size: 32px;
              font-weight: bold;
              margin: 0;
              letter-spacing: 3px;
            }}
            .header-subtitle {{
              color: #ffffff;
              font-size: 11px;
              margin: 8px 0 0 0;
              letter-spacing: 4px;
              text-transform: uppercase;
              font-weight: 300;
              opacity: 0.9;
            }}
            .content-td {{
              padding: 45px 40px;
              text-align: left;
            }}
            .salutation {{
              font-size: 18px;
              line-height: 1.6;
              color: #1D0130;
              margin: 0 0 20px 0;
              font-family: 'Georgia', serif;
              font-weight: bold;
            }}
            .message-text {{
              font-size: 15px;
              line-height: 1.6;
              color: #4A4A4A;
              margin: 0 0 30px 0;
            }}
            .otp-card {{
              background: linear-gradient(135deg, #1D0130 0%, #31034F 100%);
              border: 2px solid #E4C560;
              border-radius: 20px;
              padding: 30px;
              text-align: center;
              margin: 35px 0;
              box-shadow: 0 8px 25px rgba(29, 1, 48, 0.12);
            }}
            .otp-title {{
              color: #ffffff;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 3px;
              margin: 0 0 12px 0;
              font-weight: 600;
              opacity: 0.8;
            }}
            .otp-code {{
              color: #E4C560;
              font-family: 'Courier New', Courier, monospace;
              font-size: 42px;
              font-weight: 900;
              letter-spacing: 8px;
              display: inline-block;
              margin: 0;
            }}
            .security-text {{
              font-size: 13px;
              line-height: 1.6;
              color: #888888;
              margin: 30px 0 0 0;
              border-top: 1px solid #FAF7FC;
              padding-top: 20px;
            }}
            .footer-banner {{
              background-color: #FAF7FC;
              padding: 30px 20px;
              border-top: 1px solid #EADBFA;
              text-align: center;
            }}
            .footer-title {{
              font-size: 13px;
              font-weight: 700;
              color: #1D0130;
              margin: 0 0 6px 0;
              letter-spacing: 1.5px;
            }}
            .footer-subtitle {{
              font-size: 11px;
              color: #666666;
              margin: 0 0 15px 0;
            }}
            .footer-disclaimer {{
              font-size: 10px;
              color: #999999;
              margin: 0;
            }}
            @media only screen and (max-width: 600px) {{
              .content-td {{ padding: 30px 20px !important; }}
              .otp-code {{ font-size: 32px !important; letter-spacing: 5px !important; }}
              .header-title {{ font-size: 26px !important; }}
            }}
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header-banner">
              <h1 class="header-title">UMA GROCERY</h1>
              <div class="header-subtitle">Luxury Organic Supermarket</div>
            </div>
            <div class="content-td">
              <h2 class="salutation">Dear Premium Customer,</h2>
              <p class="message-text">
                Thank you for choosing <strong>Uma Grocery Supermarket</strong>. We are committed to delivering the absolute finest organic greens, fresh farm vegetables, and premium daily essentials directly to your doorstep.
              </p>
              <div class="otp-card">
                <div class="otp-title">Your Email OTP Verification Code</div>
                <div class="otp-code">{otp}</div>
              </div>
              <p class="security-text">
                Please enter this 6-digit verification code on the registration page to complete your premium customer account signup. For security reasons, this code will expire shortly and should not be shared with anyone.
              </p>
            </div>
            <div class="footer-banner">
              <div class="footer-title">UMA GROCERY SUPERMARKET</div>
              <div class="footer-subtitle">Fresh • Quality • Trusted • Delivered to your Doorstep</div>
              <p class="footer-disclaimer">This is an automated security verification email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </body>
        </html>
        '''

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
            html_message=html_message
        )
        email_sent = True
    except Exception as e:
        print("Real-time email sending failed:", e)

        
    return Response({
        'message': 'OTP sent successfully to your email.',
        'email_sent': email_sent,
        'dev_otp': otp # UI helper
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    otp_received = request.data.get('otp')
    email = request.data.get('email')
    
    if not email:
        return Response({'email': ['Email field is required']}, status=status.HTTP_400_BAD_REQUEST)
        
    if not otp_received:
        return Response({'otp': ['OTP verification code is required']}, status=status.HTTP_400_BAD_REQUEST)
        
    # Verify OTP
    try:
        otp_verification = OTPVerification.objects.get(email=email)
        if otp_verification.otp != str(otp_received):
            return Response({'otp': ['Invalid OTP verification number']}, status=status.HTTP_400_BAD_REQUEST)
    except OTPVerification.DoesNotExist:
        return Response({'otp': ['Please request an OTP first']}, status=status.HTTP_400_BAD_REQUEST)
        
    # Standard registration
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Delete OTP record after successful registration
        otp_verification.delete()
        login(request, user)
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([AllowAny])
def contact_feedback_view(request):
    name = request.data.get('name', '').strip()
    email = request.data.get('email', '').strip()
    subject = request.data.get('subject', '').strip()
    message = request.data.get('message', '').strip()
    
    if not email or not name:
        return Response({'error': 'Name and Email are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
    # Save feedback to database for the Admin Panel
    ContactFeedback.objects.create(name=name, email=email, subject=subject, message=message)
        
    email_sent = False
    try:
        mail_subject = f"Thank you for your feedback! - Uma Grocery Shop"
        text_message = f"Dear {name},\n\nThank you for contacting Uma Grocery Shop! We have received your inquiry regarding '{subject}' and our team will get back to you shortly.\n\nBest regards,\nM. Uma\nOwner, Uma Grocery Shop"
        
        html_message = f'''
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @media only screen and (max-width: 600px) {{
              .email-container {{
                border-radius: 12px !important;
                box-shadow: 0 4px 10px rgba(0,0,0,0.05) !important;
              }}
              .content-td {{
                padding: 25px 15px !important;
              }}
            }}
          </style>
        </head>
        <body style="background-color: #FAF7FC; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 20px 10px; -webkit-font-smoothing: antialiased;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 25px rgba(29, 1, 48, 0.08); overflow: hidden; border-top: 8px solid #1D0130;">
            <!-- Header Banner -->
            <tr>
              <td align="center" style="background-color: #1D0130; padding: 30px 20px;">
                <h1 style="color: #E4C560; font-family: 'Georgia', serif; font-size: 26px; font-weight: bold; margin: 0; letter-spacing: 2px;">UMA GROCERY</h1>
                <p style="color: #ffffff; font-size: 11px; margin: 5px 0 0 0; letter-spacing: 3px; text-transform: uppercase; font-weight: 300;">Luxury Organic Supermarket</p>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td class="content-td" style="padding: 30px 20px; text-align: left;">
                <p style="font-size: 16px; line-height: 1.6; color: #2A0033; margin: 0 0 20px 0; font-family: 'Georgia', serif; font-style: italic; font-weight: bold;">
                  Hello {name},
                </p>
                <p style="font-size: 14px; line-height: 1.6; color: #555555; margin: 0 0 20px 0;">
                  Thank you for reaching out to <strong>Uma Grocery Supermarket</strong>! We have received your message and truly appreciate you taking the time to share your feedback.
                </p>
                
                <!-- Feedback Details Box -->
                <div style="background-color: #FDFBFD; border: 1px dashed #4A0E4E; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: left;">
                  <p style="margin: 0 0 8px 0; font-size: 12px; color: #4A0E4E; font-weight: bold;">Inquiry Subject:</p>
                  <p style="margin: 0 0 15px 0; font-size: 14px; color: #2A0033; font-weight: bold;">{subject}</p>
                  
                  <p style="margin: 0 0 8px 0; font-size: 12px; color: #4A0E4E; font-weight: bold;">Your Message:</p>
                  <p style="margin: 0; font-size: 13px; color: #555555; line-height: 1.5; font-style: italic;">"{message}"</p>
                </div>
                
                <p style="font-size: 14px; line-height: 1.6; color: #555555; margin: 0 0 25px 0;">
                  Our sourcing and concierge team is currently reviewing your request. We will contact you at this email address within the next 24 business hours to address any concerns.
                </p>
                
                <p style="font-size: 14px; line-height: 1.6; color: #2A0033; margin: 0; font-family: 'Georgia', serif; font-style: italic; font-weight: bold;">
                  Warmest regards,<br />
                  M. Uma<br />
                  <span style="font-size: 12px; color: #777777; font-weight: normal; font-family: sans-serif;">Owner & Sourcing Director</span>
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td align="center" style="background-color: #FAF7FC; padding: 25px 20px; border-top: 1px solid #EADBFA;">
                <p style="font-size: 12px; font-weight: bold; color: #1D0130; margin: 0 0 5px 0; letter-spacing: 1px;">UMA GROCERY SUPERMARKET</p>
                <p style="font-size: 10px; color: #777777; margin: 0 0 15px 0;">Srivilliputtur, Tamil Nadu | Phone: 7530085513, 6381225336</p>
                <p style="font-size: 9px; color: #999999; margin: 0;">This is an automated copy of your inquiry submission.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
        '''
        
        send_mail(
            subject=mail_subject,
            message=text_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
            html_message=html_message
        )
        email_sent = True
    except Exception as e:
        print("Real-time feedback thank-you email sending failed:", e)

    return Response({
        'message': 'Feedback received and thank-you email dispatched successfully.',
        'email_sent': email_sent
    }, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([AllowAny])
def current_user_view(request):
    if not request.user.is_authenticated:
        return Response(None, status=status.HTTP_200_OK)
        
    if request.method in ['PUT', 'PATCH']:
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
        
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.request.method in ['GET', 'OPTIONS'] or self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method in ['GET', 'OPTIONS'] or self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated(), IsAdminUser()]

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)

        if category and category != 'All':
            queryset = queryset.filter(category__name=category)

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )

        # Standard users only see in-stock products, staff can view/edit everything
        if not self.request.user.is_authenticated or not self.request.user.is_staff:
            queryset = queryset.filter(in_stock=True)

        return queryset

    @action(detail=False, methods=['get'], url_path='sub_categories')
    def sub_categories(self, request):
        category_id = request.query_params.get('category_id')
        if not category_id:
            return Response([], status=status.HTTP_200_OK)
        subs = (
            Product.objects
            .filter(category_id=category_id, sub_category__isnull=False)
            .exclude(sub_category='')
            .values_list('sub_category', flat=True)
            .distinct()
            .order_by('sub_category')
        )
        return Response(list(subs), status=status.HTTP_200_OK)


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = ContactFeedback.objects.all()
    serializer_class = ContactFeedbackSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminUsersViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.filter(is_staff=False).order_by('-created_at')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product')
        quantity = int(request.data.get('quantity', 1))

        try:
            product = Product.objects.get(id=product_id, in_stock=True)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = Cart.objects.get_or_create(
            user=request.user,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        serializer = self.get_serializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        Cart.objects.filter(user=request.user).delete()
        return Response({'message': 'Cart cleared'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'])
    def update_quantity(self, request, pk=None):
        cart_item = self.get_object()
        quantity = request.data.get('quantity')

        if quantity is not None:
            try:
                qty_val = int(quantity)
            except (ValueError, TypeError):
                return Response({'error': 'Invalid quantity'}, status=status.HTTP_400_BAD_REQUEST)

            if qty_val <= 0:
                cart_item.delete()
                return Response({'message': 'Item removed from cart'}, status=status.HTTP_204_NO_CONTENT)

            cart_item.quantity = qty_val
            cart_item.save()
            serializer = self.get_serializer(cart_item)
            return Response(serializer.data)

        return Response({'error': 'Quantity is required'}, status=status.HTTP_400_BAD_REQUEST)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        cart_items = Cart.objects.filter(user=request.user)
        if not cart_items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        subtotal = sum(item.total_price for item in cart_items)
        delivery_charge = 0 if subtotal >= 500 else 40
        total_amount = subtotal + delivery_charge

        order = Order.objects.create(
            user=request.user,
            delivery_address=serializer.validated_data['delivery_address'],
            phone=serializer.validated_data['phone'],
            total_amount=total_amount,
            delivery_charge=delivery_charge,
            status='confirmed'
        )

        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )

        cart_items.delete()

        order_serializer = OrderSerializer(order)
        return Response(order_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        if not request.user.is_staff:
            return Response({'error': 'Only staff/administrators can update order status'}, status=status.HTTP_403_FORBIDDEN)

        order = self.get_object()
        new_status = request.data.get('status')

        if new_status in dict(Order.STATUS_CHOICES):
            order.status = new_status
            order.save()
            serializer = self.get_serializer(order)
            return Response(serializer.data)

        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'])
    def update_address(self, request, pk=None):
        order = self.get_object()
        
        # Only allow changing address if order is not delivered/cancelled
        if order.status in ['delivered', 'cancelled']:
            return Response({'error': 'Cannot update address for delivered or cancelled orders'}, status=status.HTTP_400_BAD_REQUEST)
            
        new_address = request.data.get('delivery_address')
        if not new_address:
            return Response({'error': 'delivery_address is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        order.delivery_address = new_address
        order.save()
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        
        if order.status in ['delivered', 'cancelled']:
            return Response({'error': 'Order is already delivered or cancelled'}, status=status.HTTP_400_BAD_REQUEST)
            
        order.status = 'cancelled'
        order.save()
        serializer = self.get_serializer(order)
        return Response(serializer.data)

class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer

    def get_permissions(self):
        if self.request.method in ['GET', 'OPTIONS'] or self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated, IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        active_only = self.request.query_params.get('active', None)
        if active_only == 'true':
            queryset = queryset.filter(is_active=True)
        return queryset

