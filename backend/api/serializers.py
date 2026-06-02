from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Category, Product, Cart, Order, OrderItem, ContactFeedback, Offer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'address', 'pincode', 'first_name', 'last_name', 'is_staff', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'phone', 'address', 'pincode']


    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=False)
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, attrs):
        email = attrs.get('email')
        username = attrs.get('username') or email
        password = attrs.get('password')

        if not username:
            raise serializers.ValidationError('Must include "email" or "username".')

        # If it is a mail ID, lookup the user username
        if '@' in username:
            try:
                user_obj = User.objects.get(email=username)
                username = user_obj.username
            except User.DoesNotExist:
                pass

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include "password".')

        return attrs



class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image_url', 'dedicated_image_url', 'product_count']

    def get_product_count(self, obj):
        return obj.products.filter(in_stock=True).count()


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'category', 'category_name', 'image_url', 'image_url_2', 'image_url_3', 'image_url_4', 'unit', 'description', 'sub_category', 'in_stock']


class CartSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'product', 'product_details', 'quantity', 'total_price', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_total_price(self, obj):
        return obj.total_price


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.CharField(source='product.image_url', read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 'price', 'total_price']

    def get_total_price(self, obj):
        return obj.total_price


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'user_name', 'status', 'delivery_address', 'phone',
                  'total_amount', 'delivery_charge', 'items', 'created_at', 'delivered_at']
        read_only_fields = ['id', 'created_at']


class OrderCreateSerializer(serializers.Serializer):
    delivery_address = serializers.CharField()
    phone = serializers.CharField(max_length=15)


class ContactFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactFeedback
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']


class OfferSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Offer
        fields = ['id', 'title', 'description', 'discount_percentage', 'product', 'product_details', 'image_url', 'is_active', 'send_email_notification', 'created_at']

