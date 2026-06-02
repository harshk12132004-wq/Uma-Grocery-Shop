from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email



class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    image_url = models.TextField(blank=True, null=True)
    dedicated_image_url = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    image_url = models.TextField(blank=True, null=True)
    dedicated_image_url = models.TextField(blank=True, null=True)
    image_url_2 = models.TextField(blank=True, null=True)
    image_url_3 = models.TextField(blank=True, null=True)
    image_url_4 = models.TextField(blank=True, null=True)
    unit = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    sub_category = models.CharField(max_length=100, blank=True, null=True)
    in_stock = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} - ₹{self.price}"


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.product.name} x {self.quantity}"

    @property
    def total_price(self):
        return self.product.price * int(self.quantity)


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    delivery_address = models.TextField()
    phone = models.CharField(max_length=15)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    delivered_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.id} - {self.user.username} - ₹{self.total_amount}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

    @property
    def total_price(self):
        return self.price * self.quantity


class OTPVerification(models.Model):
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.email} - {self.otp}"


class ContactFeedback(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject}"


class Offer(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    discount_percentage = models.PositiveIntegerField(blank=True, null=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, blank=True, null=True, related_name='offers')
    image_url = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    send_email_notification = models.BooleanField(default=False, help_text="Check this to broadcast this offer to all registered users via email.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        should_send = self.send_email_notification or (is_new and self.is_active)
        
        # Reset the flag on the instance so it doesn't fire again unless checked
        if self.send_email_notification:
            self.send_email_notification = False
            
        super().save(*args, **kwargs)
        
        if should_send:
            from django.core.mail import send_mail
            from django.conf import settings
            
            # Fetch active user emails
            recipient_list = list(User.objects.filter(is_active=True, is_staff=False).exclude(email='').values_list('email', flat=True))
            
            if recipient_list:
                subject = f"🎉 Uma Grocery Special Offer: {self.title}!"
                message = f"Hello from Uma Grocery!\n\nWe have a special offer for you:\n\n✨ {self.title} ✨\n\n{self.description}\n"
                if self.discount_percentage:
                    message += f"Discount: {self.discount_percentage}% OFF!\n"
                if self.product:
                    message += f"Applicable on: {self.product.name} (Price: ₹{self.product.price})\n"
                
                message += f"\nCheck out this offer on our store today!\n\nBest Regards,\nUma Grocery Team"
                
                html_message = f"""
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
                      padding: 40px 35px;
                      text-align: left;
                    }}
                    .salutation {{
                      font-size: 18px;
                      line-height: 1.6;
                      color: #1D0130;
                      margin: 0 0 15px 0;
                      font-family: 'Georgia', serif;
                      font-weight: bold;
                    }}
                    .message-text {{
                      font-size: 15px;
                      line-height: 1.6;
                      color: #4A4A4A;
                      margin: 0 0 25px 0;
                    }}
                    .offer-card {{
                      background: linear-gradient(135deg, #1D0130 0%, #31034F 100%);
                      border: 2px solid #E4C560;
                      border-radius: 20px;
                      padding: 30px;
                      text-align: center;
                      margin: 30px 0;
                      box-shadow: 0 8px 25px rgba(29, 1, 48, 0.12);
                    }}
                    .offer-badge {{
                      background-color: #E4C560;
                      color: #1D0130;
                      padding: 5px 15px;
                      border-radius: 20px;
                      font-size: 11px;
                      font-weight: 800;
                      text-transform: uppercase;
                      letter-spacing: 1.5px;
                      display: inline-block;
                    }}
                    .offer-title {{
                      color: #E4C560;
                      margin: 15px 0 10px 0;
                      font-size: 24px;
                      font-family: 'Georgia', serif;
                      font-weight: bold;
                    }}
                    .offer-desc {{
                      margin: 0;
                      color: #EADBFA;
                      font-size: 14px;
                      line-height: 1.6;
                    }}
                    .discount-label {{
                      font-size: 32px;
                      font-weight: 800;
                      color: #1D0130;
                      margin: 20px 0;
                      text-align: center;
                      font-family: 'Georgia', serif;
                    }}
                    .product-box {{
                      border: 1px solid #EADBFA;
                      border-radius: 16px;
                      padding: 15px;
                      margin: 25px 0;
                      background-color: #FAF7FC;
                      text-align: left;
                    }}
                    .product-title {{
                      margin: 0 0 5px 0;
                      color: #1D0130;
                      font-size: 16px;
                      font-weight: 700;
                    }}
                    .product-price {{
                      margin: 8px 0 0 0;
                      font-weight: bold;
                      color: #8B9A46;
                      font-size: 16px;
                    }}
                    .cta-btn {{
                      background-color: #8B9A46;
                      color: white !important;
                      padding: 12px 30px;
                      text-decoration: none;
                      border-radius: 30px;
                      font-weight: bold;
                      display: inline-block;
                      transition: background-color 0.3s;
                      letter-spacing: 1px;
                      text-transform: uppercase;
                      font-size: 12px;
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
                      .content-td {{ padding: 25px 15px !important; }}
                      .header-title {{ font-size: 26px !important; }}
                      .offer-title {{ font-size: 20px !important; }}
                    }}
                  </style>
                </head>
                <body>
                  <div class="email-container">
                    <div class="header-banner">
                      <h1 class="header-title">UMA GROCERY</h1>
                      <div class="header-subtitle">Luxury Organic Supermarket</div>
                    </div>
                    <div class="content-td" style="text-align: center;">
                      <h2 class="salutation" style="text-align: left;">Dear Valued Customer,</h2>
                      <p class="message-text" style="text-align: left;">
                        We are thrilled to present our newest and highly curated organic savings offer at <strong>Uma Grocery Supermarket</strong>. Sourced directly from local partner farms to promote fresh, pure living!
                      </p>
                      
                      <div class="offer-card">
                        <span class="offer-badge">SPECIAL DISCOUNT OFFER</span>
                        <h3 class="offer-title">{self.title}</h3>
                        <p class="offer-desc">{self.description}</p>
                      </div>
                """

                if self.discount_percentage:
                    html_message += f"""
                      <div class="discount-label" style="color: #4A0E4E;">
                        ★ {self.discount_percentage}% INSTANT DISCOUNT ★
                      </div>
                    """
                
                if self.product:
                    product_img = self.product.image_url or "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500"
                    html_message += f"""
                      <div class="product-box" style="display: flex; align-items: center; border: 1px solid #EADBFA; background-color: #FAF7FC; padding: 15px; border-radius: 16px; margin: 20px 0;">
                        <img src="{product_img}" alt="{self.product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 12px; margin-right: 20px;" />
                        <div>
                          <h4 class="product-title" style="margin: 0; color: #1D0130;">{self.product.name}</h4>
                          <p style="margin: 3px 0 0 0; color: #666666; font-size: 12px;">Unit Volume: {self.product.unit}</p>
                          <p class="product-price" style="margin: 8px 0 0 0; font-weight: bold; color: #8B9A46;">Fresh Farm Rate: ₹{self.product.price}</p>
                        </div>
                      </div>
                    """
                
                html_message += f"""
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:5173" class="cta-btn" style="background-color: #8B9A46; color: white !important; padding: 12px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; font-size: 12px;">Shop Sourced Catalog →</a>
                      </div>
                    </div>
                    <div class="footer-banner">
                      <div class="footer-title">UMA GROCERY SUPERMARKET</div>
                      <div class="footer-subtitle">Srivilliputtur, Tamil Nadu | Phone: 7530085513, 6381225336</div>
                      <p class="footer-disclaimer">You received this notification because you hold a premium registered account with us. &copy; 2026 Uma Grocery.</p>
                    </div>
                  </div>
                </body>
                </html>
                """
                
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=recipient_list,
                    html_message=html_message,
                    fail_silently=True
                )


