from rest_framework.response import Response
from rest_framework import permissions, status
import jwt
from django.core.cache import cache
import requests
from rest_framework_api.views import StandardAPIView
from django.conf import settings
import tempfile
import base64
from time import sleep
import rsa
import random
from core.producer import producer
import json
from decimal import Decimal
from web3 import Web3
secret_key = settings.SECRET_KEY
taxes = settings.TAXES
booth_contract_address = settings.BOOTH_CONTRACT
owner_wallet = settings.OWNER_WALLET
owner_wallet_key = settings.OWNER_WALLET_KEY
affiliates_contract = settings.AFFILIATES_CONTRACT
uridium_wallet = settings.URIDIUM_WALLET
uridium_wallet_key = settings.URIDIUM_WALLET_KEY

courses_ms_url = settings.COURSES_MS_URL
products_ms_url = settings.PRODUCTS_MS_URL
auth_ms_url = settings.AUTH_MS_URL
coupons_ms_url = settings.COUPONS_MS_URL
cryptography_ms_url = settings.CRYPTOGRAPHY_MS_URL

DEBUG=settings.DEBUG
ETHERSCAN_API_KEY=settings.ETHERSCAN_API_KEY
POLYGONSCAN_API_KEY=settings.POLYGONSCAN_API_KEY
polygon_url=settings.POLYGON_RPC
polygon_web3 = Web3(Web3.HTTPProvider(polygon_url))
import os
import re
from web3.middleware import geth_poa_middleware

def validate_token(request):
    token = request.META.get('HTTP_AUTHORIZATION').split()[1]

    try:
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response({"error": "Token has expired."}, status=status.HTTP_401_UNAUTHORIZED)
    except jwt.DecodeError:
        return Response({"error": "Token is invalid."}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception:
        return Response({"error": "An error occurred while decoding the token."}, status=status.HTTP_401_UNAUTHORIZED)

    return payload


def get_contract_abi(address):
    url = f'https://api-goerli.etherscan.io/api?module=contract&action=getabi&address={address}&apikey={ETHERSCAN_API_KEY}'
    # if DEBUG:
    # else:
    #     url = f'https://api.etherscan.io/api?module=contract&action=getabi&address={address}&apikey={ETHERSCAN_API_KEY}'

    response = requests.get(url)
    data = response.json()

    if data['status'] == '1':
        return data['result']
    else:
        return None


def get_polygon_contract_abi(address):
    url = f'https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address={address}&apikey={POLYGONSCAN_API_KEY}'
    # if DEBUG:
    # else:
    #     url = f'https://api.polygonscan.com/api?module=contract&action=getabi&address={address}&apikey={POLYGONSCAN_API_KEY}'

    response = requests.get(url)
    data = response.json()
    if data['status'] == '1':
        return data['result']
    else:
        return None

def get_polygon_contract_bytecode(address):
    url = f'https://api-testnet.polygonscan.com/api?module=proxy&action=eth_getCode&address={address}&apikey={POLYGONSCAN_API_KEY}'
    # if DEBUG:
    # else:
    #     url = f'https://api.polygonscan.com/api?module=proxy&action=eth_getCode&address={address}&apikey={POLYGONSCAN_API_KEY}'

    response = requests.get(url)
    data = response.json()
    return data['result']

def calculate_course_price(course):
    total_cost = Decimal('0')
    total_compare_cost = Decimal('0')
    # CALCULATE PRICE TO PAY, Including IF Discount or Coupon
    course_id = course['course'] if course['course'] else None
    coupon = course['coupon'] if course['coupon'] else None
    course_response = requests.get(f'{courses_ms_url}/api/courses/get/' + course_id + '/').json()
    is_discounted = False
    if coupon:
        is_discounted = True

        coupon_response = requests.get(f'{coupons_ms_url}/api/coupons/get/' + coupon).json()['results']
        coupon_fixed_price_coupon = coupon_response.get('fixed_price_coupon')
        coupon_percentage_coupon = coupon_response.get('percentage_coupon')
        
        if coupon_fixed_price_coupon:
            coupon_fixed_discount_price = coupon_fixed_price_coupon['discount_price']
        else:
            coupon_fixed_discount_price = None
        
        if coupon_percentage_coupon:
            coupon_discount_percentage = coupon_percentage_coupon['discount_percentage']
        else:
            coupon_discount_percentage = None

    else:
        coupon_fixed_price_coupon = None
        coupon_fixed_discount_price = None
        coupon_percentage_coupon = None
        coupon_discount_percentage = None

    course_price = course_response.get('results', {}).get('details', {}).get('price', 0)
    course_compare_price = course_response.get('results', {}).get('details', {}).get('compare_price', 0)
    course_discount = course_response.get('results', {}).get('details', {}).get('discount', False)

    # Calculate Total Cost Without Discounts and Coupons and Taxes (total_cost)
    if course_discount == False:
        total_cost += Decimal(course_price)
    else:
        total_cost += Decimal(course_compare_price)
    # Calculate Total Cost With Discount and Coupons if present (total_compare_cost)
    if course_discount == True:
        if coupon_fixed_discount_price is not None:
            total_compare_cost += max(Decimal(course_compare_price) - Decimal(coupon_fixed_discount_price), 0)
        elif coupon_discount_percentage is not None:
            total_compare_cost += Decimal(course_compare_price) * (1 - (Decimal(coupon_discount_percentage) / 100))
        else:
            total_compare_cost += Decimal(course_compare_price)
    else:
        if coupon_fixed_discount_price is not None:
            total_compare_cost += max(Decimal(course_price) - Decimal(coupon_fixed_discount_price), 0)
        elif coupon_discount_percentage is not None:
            total_compare_cost += Decimal(course_price) * (1 - (Decimal(coupon_discount_percentage) / 100))
        else:
            total_compare_cost += Decimal(course_price)
    
    # Calculate Taxes for Total Cost (tax_estimate)
    tax_estimate = Decimal(total_compare_cost) * Decimal(taxes)
    # print('Tax Estimate: ',tax_estimate )
    finalCoursePrice = Decimal(total_compare_cost) + Decimal(tax_estimate)
    return finalCoursePrice, course_response, is_discounted

def calculate_product_price(object):
    base_price = Decimal('0')
    total_cost = Decimal('0')
    total_compare_cost = Decimal('0')
    shipping_estimate = Decimal('0')

    # CALCULATE PRICE TO PAY, Including IF Discount or Coupon
    product_id = object['product'] if object['product'] else None
    coupon = object['coupon'] if object['coupon'] else None
    count = object['count'] if object['count'] else 1  # set default count to 1 if not provided

    response_data = requests.get(f'{products_ms_url}/api/products/get/' + product_id + '/').json()

    is_discounted = False
    if coupon:
        is_discounted = True

        coupon_response = requests.get(f'{coupons_ms_url}/api/coupons/get/' + coupon).json()['results']
        coupon_fixed_price_coupon = coupon_response.get('fixed_price_coupon')
        coupon_percentage_coupon = coupon_response.get('percentage_coupon')
        
        if coupon_fixed_price_coupon:
            coupon_fixed_discount_price = coupon_fixed_price_coupon['discount_price']
        else:
            coupon_fixed_discount_price = None
        
        if coupon_percentage_coupon:
            coupon_discount_percentage = coupon_percentage_coupon['discount_percentage']
        else:
            coupon_discount_percentage = None

    else:
        coupon_fixed_price_coupon = None
        coupon_fixed_discount_price = None
        coupon_percentage_coupon = None
        coupon_discount_percentage = None

    # GET Shipping
    shipping_id = object['shipping']
    filtered_shipping = [shipping for shipping in response_data['results']['shipping'] if shipping['id'] == shipping_id]
    selected_shipping = None
    if filtered_shipping:
        selected_shipping = filtered_shipping[0]
    
    # GET WEIGHT
    weight_id = object['weight']
    filtered_weights = [weight for weight in response_data['results']['weights'] if weight['id'] == weight_id]
    selected_weight = None
    if filtered_weights:
        selected_weight = filtered_weights[0]
    
    # GET MATERIAL
    material_id = object['material']
    filtered_materials = [material for material in response_data['results']['materials'] if material['id'] == material_id]
    selected_material = None
    if filtered_materials:
        selected_material = filtered_materials[0]
    
    # GET COLOR
    color_id = object['color']
    filtered_colors = [color for color in response_data['results']['colors'] if color['id'] == color_id]
    selected_color = None
    if filtered_colors:
        selected_color = filtered_colors[0]
    
    # GET Size
    size_id = object['size']
    filtered_sizes = [size for size in response_data['results']['sizes'] if size['id'] == size_id]
    selected_size = None
    if filtered_sizes:
        selected_size = filtered_sizes[0]

    price = response_data['results']['details']['price']
    compare_price = response_data['results']['details']['compare_price']
    discount = response_data['results']['details']['discount']

    if price is not None:
        base_price = Decimal(price)

    if selected_weight:
        base_price += Decimal(selected_weight.get('price'))
    if selected_material:
        base_price += Decimal(selected_material.get('price'))
    if selected_color:
        base_price += Decimal(selected_color.get('price'))
    if selected_size:
        base_price += Decimal(selected_size.get('price'))

    # Calculate Total Cost Without Discounts and Coupons and Taxes (total_cost)
    if discount == False:
        total_cost += Decimal(base_price) * count
    else:
        total_cost += Decimal(compare_price) * count

    # Calculate Total Cost With Discount and Coupons if present (total_compare_cost)
    if discount == True:
        if coupon_fixed_discount_price is not None:
            total_compare_cost += max(Decimal(compare_price) - Decimal(coupon_fixed_discount_price), 0) * count
        elif coupon_discount_percentage is not None:
            total_compare_cost += Decimal(compare_price) * (1 - (Decimal(coupon_discount_percentage) / 100)) * count
        else:
            total_compare_cost += Decimal(compare_price) * count
    else:
        if coupon_fixed_discount_price is not None:
            total_compare_cost += max(Decimal(base_price) - Decimal(coupon_fixed_discount_price), 0) * count
        elif coupon_discount_percentage is not None:
            total_compare_cost += Decimal(base_price) * (1 - (Decimal(coupon_discount_percentage) / 100)) * count
        else:
            total_compare_cost += Decimal(base_price) * count

    # Calculate shipping
    if response_data['results'].get('shipping'):
        shipping_price = Decimal(selected_shipping.get('price'))
        shipping_estimate += shipping_price
        total_compare_cost += shipping_price

    # Calculate Taxes for Total Cost (tax_estimate)
    tax_estimate = Decimal(total_compare_cost) * Decimal(taxes)
    final_price = Decimal(total_compare_cost) + Decimal(tax_estimate)
    return final_price, response_data, is_discounted


def decrypt_polygon_private_key(address):
    # Get wallet information from the backend API
    wallet_request = requests.get(f'{auth_ms_url}/api/wallets/get/?address={address}').json()
    base64_encoded_private_key_string = wallet_request['results']['polygon_private_key']
    
    # Get RSA private key from the backend API
    rsa_private_key_string = requests.get(f'{cryptography_ms_url}/api/crypto/key/').json()
    
    # Create a temporary file to store the RSA private key
    with tempfile.NamedTemporaryFile(mode='w', delete=False) as temp_file:
        # Write the contents of rsa_private_key_string to the file
        temp_file.write(rsa_private_key_string)
    # Load the private key from the temporary file
    with open(temp_file.name, "rb") as f:
        privkey = rsa.PrivateKey.load_pkcs1(f.read())
    
    # Decode the Base64-encoded string
    decoded_bytes = base64.b64decode(base64_encoded_private_key_string)
    
    # Decrypt the bytes using the private key
    decrypted_bytes = rsa.decrypt(decoded_bytes, privkey)
    
    # Convert the decrypted bytes to a string
    wallet_private_key = decrypted_bytes.decode('ascii')
    
    return wallet_private_key


class CryptoPaymentView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']
        data= request.data
        userID = data['userID']
        buyer_address = data['address']
        guy = data['polygonAddress']

        # Create an empty list to hold transaction hashes
        tx_hashes = []
        courses = []
        products = []
        
        finalPrice = 0.0

        # Fetch Matic and ETH price in USD
        eth_price = cache.get('eth_price')
        matic_price = cache.get('matic_price')
        if not eth_price:
            eth_price_response = requests.get('https://api.coingecko.com/api/v3/simple/price?ids=matic-network%2Cethereum&vs_currencies=usd').json()
            eth_price = eth_price_response.get('ethereum').get('usd')
            matic_price = eth_price_response.get('matic-network').get('usd')
            cache.set('eth_price', eth_price, 1 * 60) # cache for 1 minutes
            cache.set('matic_price', matic_price, 1 * 60) # cache for 1 minutes

        if user_id == userID:
            # Get user cart items
            cart_items = data.get('cartItems')
            print('Cart Items to Buy: ', cart_items)

            for item in cart_items:
                if item.get('course'):
                    courses.append(item)
                elif item.get('product'):
                    products.append(item)
            
            # PROCESS COURSE PAYMENT
            for object in courses:
                print('Purchasing Course object: ', object)
                finalCoursePrice = Decimal('0')
                # Calculate Price to Pay Per Course
                final_course_price, course_response, is_discounted = calculate_course_price(object)
                finalCoursePrice += final_course_price
                course_matic_price = float(final_course_price) / matic_price
                price_in_wei = polygon_web3.toWei(course_matic_price, 'ether')
                course_uuid = course_response.get('results').get('details').get('id')
                
                token_id = course_response.get('results').get('details').get('token_id')
                tokenId = int(token_id)
                nft_id = random.randint(10000, 999999999)
                qty = 1

                # Pay for course
                seller_id = course_response.get('results').get('details').get('sellers')[0].get('author')
                seller_ethereum_address = course_response.get('results').get('details').get('sellers')[0].get('address')
                seller_polygon_address = course_response.get('results').get('details').get('sellers')[0].get('polygon_address')
                seller_private_key = decrypt_polygon_private_key(seller_ethereum_address)

                # Decrypt private key for buyer
                buyer_private_key = decrypt_polygon_private_key(buyer_address)

                # Build Instance of Contract
                contract_address = course_response.get('results').get('details').get('nft_address')
                # Fetch ABI
                # abi = get_polygon_contract_abi(contract_address)
                ticket_location = os.path.join(settings.BASE_DIR, 'contracts', 'marketplace', 'ticket.sol')
                with open(os.path.join(ticket_location, 'Ticket.json'), "r") as f:
                    contract_json = json.load(f)
                abi = contract_json['abi']
                # bytecode = contract_json['bytecode']
                # Creat Contract Instance
                ticket_contract = polygon_web3.eth.contract(abi=abi, address=contract_address)

                # Check if user has sufficient balance
                balance = polygon_web3.eth.get_balance(guy)
                if balance < polygon_web3.eth.gas_price + price_in_wei:
                    return self.send_error('insufficient funds for gas * price + value', status=status.HTTP_400_BAD_REQUEST)
                
                # Call the getStock function for the given tokenId
                stock = ticket_contract.functions.getStock(tokenId).call()

                # Check if the stock is unlimited or greater than zero
                if stock == -1 or stock > 0:
                    # Continue with the purchase
                    print("Stock is available, continue with the purchase")
                else:
                    return self.send_error("No stock available, cannot continue with the purchase", status=status.HTTP_400_BAD_REQUEST)                

                # Register NFT in BOOTH Marketplace
                # abi_booth = get_polygon_contract_abi(booth_contract_address)
                # bytecode_booth = get_polygon_contract_bytecode(booth_contract_address)
                booth_location = os.path.join(settings.BASE_DIR, 'contracts', 'marketplace', 'booth.sol')
                with open(os.path.join(booth_location, 'Booth.json'), "r") as f:
                    contract_json = json.load(f)
                abi_booth = contract_json['abi']
                # 3) create contract instance
                booth_contract_instance = polygon_web3.eth.contract(abi=abi_booth, address=booth_contract_address)
                # Get the BUYER_ROLE from the contract
                buyer_role = booth_contract_instance.functions.BUYER_ROLE().call()
                # Check if the user has the BUYER_ROLE
                hasRole = booth_contract_instance.functions.hasRole(buyer_role, guy).call()

                if not hasRole:
                    print(f'Setting Buyer ROLE for {guy}')
                    # Create Approve Buyer as Discounted method
                    role = booth_contract_instance.functions.BUYER_ROLE().call()
                    grant_role_txn = booth_contract_instance.functions.grantRole(role, guy).buildTransaction(
                        {
                            "gasPrice": polygon_web3.eth.gas_price,
                            "chainId": 80001,
                            "from": owner_wallet,
                            "nonce": polygon_web3.eth.getTransactionCount(owner_wallet),
                        }
                    )
                    signed_tx = polygon_web3.eth.account.sign_transaction(grant_role_txn, private_key=owner_wallet_key)
                    tx_hash = polygon_web3.eth.send_raw_transaction(signed_tx.rawTransaction)
                    txReceipt = polygon_web3.eth.wait_for_transaction_receipt(tx_hash)

                    if txReceipt.get('status') == 0:
                        return self.send_error('Error Setting Buyer Role')
                
                isObjectRegistered = booth_contract_instance.functions.isObjectRegistered(int(tokenId)).call()

                if not isObjectRegistered:
                    # Register NFT in BOOTH Marketplace
                    abi_booth = get_polygon_contract_abi(booth_contract_address)
                    booth_contract_instance = polygon_web3.eth.contract(abi=abi_booth, address=booth_contract_address)

                    transaction_params = {
                        'from': owner_wallet,
                        'nonce': polygon_web3.eth.get_transaction_count(owner_wallet),
                        'gasPrice': polygon_web3.eth.gas_price,
                    }

                    register_object_function = booth_contract_instance.functions.registerObject(int(tokenId), contract_address)
                    gas_estimate = register_object_function.estimateGas(transaction_params)
                    transaction_params['gas'] = gas_estimate

                    tx_booth = register_object_function.buildTransaction(transaction_params)

                    signed_tx_booth = polygon_web3.eth.account.sign_transaction(tx_booth, private_key=owner_wallet_key)
                    tx_hash_booth = polygon_web3.eth.send_raw_transaction(signed_tx_booth.rawTransaction)
                    txReceipt_booth = polygon_web3.eth.wait_for_transaction_receipt(tx_hash_booth)
                    # Check if the transaction was successful
                    if txReceipt_booth['status'] == 1:
                        print("Successfully registered the NFT in the Booth contract.")
                    else:
                        print("Failed to register the NFT in the Booth contract.")
                        return self.send_error('Failed to register the NFT in the Booth contract', status=status.HTTP_400_BAD_REQUEST)
                                    
                # PURCAHSE NFT
                # Get the referrer value
                referrer = object.get('referrer', None)

                booth_transaction_params = {
                    'from': guy,
                    'nonce': polygon_web3.eth.get_transaction_count(guy),
                    'gasPrice': polygon_web3.eth.gas_price,
                    'value': price_in_wei,
                    'gas': 600000,
                }

                
                if referrer:
                    print('Purchasing NFT with join Affiliate Program and Buy')
                    abi_affiliates = get_polygon_contract_abi(affiliates_contract)
                    affiliate_contract_instance = polygon_web3.eth.contract(abi=abi_affiliates, address=affiliates_contract)
                    # Get the AFFILIATE_ROLE from the contract
                    affiliate_role = affiliate_contract_instance.functions.AFFILIATE_ROLE().call()
                    # Check if the user has the BUYER_ROLE
                    hasAffiliateRole = affiliate_contract_instance.functions.hasRole(affiliate_role, guy).call()
                    if not hasAffiliateRole:
                        print(f"Granting affiliate role to {guy}")
                        grant_role_txn = affiliate_contract_instance.functions.grantRole(affiliate_role, guy).buildTransaction(
                            {
                                "from": owner_wallet,
                                "nonce": polygon_web3.eth.getTransactionCount(owner_wallet),
                                "gasPrice": polygon_web3.eth.gas_price,
                            }
                        )
                        sign_grant_role_txn = polygon_web3.eth.account.sign_transaction(grant_role_txn, owner_wallet_key)
                        grant_role_txHash = polygon_web3.eth.send_raw_transaction(sign_grant_role_txn.rawTransaction)
                        grant_role_txReceipt = polygon_web3.eth.wait_for_transaction_receipt(grant_role_txHash)

                        if grant_role_txReceipt['status'] == 1:
                            print(f"Successfully Granted Affiliate Role to {guy}.")
                        else:
                            print("Failed to grant affiliate role.")
                            return self.send_error('Failed to register the NFT in the Booth contract', status=status.HTTP_400_BAD_REQUEST)
                    purchase = booth_contract_instance.functions.joinAffiliateProgramAndBuy(tokenId, nft_id, qty, referrer).buildTransaction(booth_transaction_params)
                else:
                    print('Purchasing NFT with Buy Method')
                    purchase = booth_contract_instance.functions.buy(tokenId, nft_id, qty, guy).buildTransaction(booth_transaction_params)

                signed_tx_booth = polygon_web3.eth.account.sign_transaction(purchase, private_key=buyer_private_key)
                tx_hash_booth = polygon_web3.eth.send_raw_transaction(signed_tx_booth.rawTransaction)
                txReceipt_booth = polygon_web3.eth.wait_for_transaction_receipt(tx_hash_booth)
                transaction_hash = txReceipt_booth.get('transactionHash').hex()
                tx_hashes.append(transaction_hash)
                if(txReceipt_booth['status']==0):
                    print('Payment Failed')
                    return self.send_error('Payment Failed Transaction')
                print(f'NFT {tokenId} succesfully purchased by {guy}')

                # Add TX HASH to List of Transactions for User to Verify
                # Kafka Producer including Ticket_Address = NFT ddress
                print('Adding NFT to NFT List, kafka producer')
                item={}
                item['nft_id']=nft_id
                item['ticket_id']=token_id
                item['ticket_address']=contract_address
                item['wallet_address']=buyer_address
                item['transaction_hash']=transaction_hash

                producer.produce(
                    'nft_minted',
                    key='create_and_add_nft_to_nftList',
                    value=json.dumps(item).encode('utf-8')
                )
                producer.flush()

                # Create Notification Object through kafka producer
                print('Creating Notification, kafka producer')
                notification_data = {
                    'from_user': user_id,
                    'to_user': seller_id,
                    'notification_type': 4,
                    'text_preview': """Congratulations! Your course has just been sold! 🎉🎊!""",
                    'url': '/courses/'+course_uuid,
                    'is_seen': False,
                    'icon': 'bx bxs-graduation',
                    'course': course_uuid,
                }
                producer.produce(
                    'notifications',
                    key='course_sold',
                    value=json.dumps(notification_data).encode('utf-8')
                )
                # encode notification data as JSON and produce to Kafka topic
                producer.flush()

                # ADD Course to user library
                print('Adding Course to Library, kafka producer')
                course_data = {
                    'user_id': user_id,
                    'course': course_uuid,
                    'tokenID': tokenId,
                    'contractAddress': contract_address,
                }
                producer.produce(
                    'nft_minted',
                    key='course_bought',
                    value=json.dumps(course_data).encode('utf-8')
                )
                producer.flush()

                #  ADD instructor to user conntact list
                print('Adding Instructor to Buyer Contacts, kafka producer')
                contact_data = {
                    'buyer_id': user_id,
                    'seller_id': seller_id,
                }
                producer.produce(
                    'user_contacts',
                    key='add_instructor_contact',
                    value=json.dumps(contact_data).encode('utf-8')
                )
                producer.flush()

                # Create Order
                print('Creating Order, sending message with kafka Producer')
                order_data = {
                    'cartItems': cart_items,
                    'userID': user_id,
                    'course_response': course_response
                }
                producer.produce(
                    'orders',
                    key='create_order',
                    value=json.dumps(order_data).encode('utf-8')
                )
                producer.flush()

                # Delete course from cart
                print('Deleting Course from Cart, kafka producer')
                delete_cart_item_data = {
                    'user_id': user_id,
                    'course_id': course_uuid,
                }
                producer.produce(
                    'cart',
                    key='course_bought',
                    value=json.dumps(delete_cart_item_data).encode('utf-8')
                )
                producer.flush()

                # RELEASE FUNDS FOR PLATFORM AND FUNDRAISER
                # Release funds for platform
                tx1 = ticket_contract.functions.release(uridium_wallet).buildTransaction({
                    'from': uridium_wallet,
                    'nonce': polygon_web3.eth.get_transaction_count(uridium_wallet),
                    'gasPrice': polygon_web3.eth.gas_price,
                    'gas': 1000000,  # replace with the gas limit for the transaction
                })
                signed_tx1 = polygon_web3.eth.account.sign_transaction(tx1, private_key=uridium_wallet_key)
                tx1_hash = polygon_web3.eth.send_raw_transaction(signed_tx1.rawTransaction)
                tx1_receipt = polygon_web3.eth.wait_for_transaction_receipt(tx1_hash)

                if tx1_receipt.status == 1:
                    print("Funds released to uridium_wallet successfully!")
                else:
                    print("Error releasing funds to uridium_wallet")
                    
                # Release funds for fundraiser
                tx2 = ticket_contract.functions.release(owner_wallet).buildTransaction({
                    'from': owner_wallet,
                    'nonce': polygon_web3.eth.get_transaction_count(owner_wallet),
                    'gasPrice': polygon_web3.eth.gas_price,
                    'gas': 1000000,  # replace with the gas limit for the transaction
                })

                signed_tx2 = polygon_web3.eth.account.sign_transaction(tx2, private_key=owner_wallet_key)
                tx2_hash = polygon_web3.eth.send_raw_transaction(signed_tx2.rawTransaction)
                tx2_receipt = polygon_web3.eth.wait_for_transaction_receipt(tx2_hash)
                if tx2_receipt.status == 1:
                    print("Funds released to owner_wallet successfully!")
                else:
                    print("Error releasing funds to owner_wallet")
                
                # Release funds for seller
                tx3 = ticket_contract.functions.release(seller_polygon_address).buildTransaction({
                    'from': seller_polygon_address,
                    'nonce': polygon_web3.eth.get_transaction_count(seller_polygon_address),
                    'gasPrice': polygon_web3.eth.gas_price,
                    'gas': 1000000,  # replace with the gas limit for the transaction
                })

                signed_tx3 = polygon_web3.eth.account.sign_transaction(tx3, private_key=seller_private_key)
                tx3_hash = polygon_web3.eth.send_raw_transaction(signed_tx3.rawTransaction)
                tx3_receipt = polygon_web3.eth.wait_for_transaction_receipt(tx3_hash)
                if tx3_receipt.status == 1:
                    print("Funds released to seller successfully!")
                else:
                    print("Error releasing funds to seller")
                
            # PROCESS PRODUCT PAYMENT
            for object in products:
                finalProductPrice = Decimal('0')
                final_product_price, product_response, is_discounted = calculate_product_price(object)
                

                finalProductPrice += Decimal(final_product_price)
                product_matic_price = Decimal(final_product_price) / Decimal(matic_price)
                price_in_wei = polygon_web3.toWei(float(product_matic_price), 'ether')

                product_uuid = product_response.get('results').get('details').get('id')

                token_id = product_response.get('results').get('details').get('token_id')
                tokenId = int(token_id)
                nft_id = random.randint(10000, 999999999)
                qty = object.get('count')

                
                # Pay for course
                seller_id = product_response.get('results').get('details').get('sellers')[0].get('author')
                seller_ethereum_address = product_response.get('results').get('details').get('sellers')[0].get('address')
                seller_polygon_address = product_response.get('results').get('details').get('sellers')[0].get('polygon_address')
                seller_private_key = decrypt_polygon_private_key(seller_ethereum_address)

                # Decrypt private key for buyer
                buyer_private_key = decrypt_polygon_private_key(buyer_address)

                print(f"""
                Private Key: {buyer_private_key}
                Token ID: {tokenId}
                NFT ID: {nft_id}
                Quantity: {qty}
                Price in WEI: {price_in_wei}
                Product Price: {final_product_price}
                """)

                # Build Instance of Contract
                contract_address = product_response.get('results').get('details').get('nft_address')
                # Fetch ABI
                abi = get_polygon_contract_abi(contract_address)

                ticket_contract = polygon_web3.eth.contract(abi=abi, address=contract_address)

                # Check if user has sufficient balance
                balance = polygon_web3.eth.get_balance(guy)
                if balance < polygon_web3.eth.gas_price + price_in_wei:
                    return self.send_error('insufficient funds for gas * price + value', status=status.HTTP_400_BAD_REQUEST)
                
                # Call the getStock function for the given tokenId
                stock = ticket_contract.functions.getStock(tokenId).call()

                # Check if the stock is unlimited or greater than zero
                if stock == -1 or stock > 0:
                    # Continue with the purchase
                    print("Stock is available, continue with the purchase")
                else:
                    return self.send_error("No stock available, cannot continue with the purchase", status=status.HTTP_400_BAD_REQUEST)                

                # Register NFT in BOOTH Marketplace
                # abi_booth = get_polygon_contract_abi(booth_contract_address)
                # bytecode_booth = get_polygon_contract_bytecode(booth_contract_address)
                booth_location = os.path.join(settings.BASE_DIR, 'contracts', 'marketplace', 'booth.sol')
                with open(os.path.join(booth_location, 'Booth.json'), "r") as f:
                    contract_json = json.load(f)
                abi_booth = contract_json['abi']
                # 3) create contract instance
                booth_contract_instance = polygon_web3.eth.contract(abi=abi_booth, address=booth_contract_address)
                # Get the BUYER_ROLE from the contract
                buyer_role = booth_contract_instance.functions.BUYER_ROLE().call()
                # Check if the user has the BUYER_ROLE
                hasRole = booth_contract_instance.functions.hasRole(buyer_role, guy).call()

                if not hasRole:
                    print(f'Setting Buyer ROLE for {guy}')
                    # Create Approve Buyer as Discounted method
                    role = booth_contract_instance.functions.BUYER_ROLE().call()
                    grant_role_txn = booth_contract_instance.functions.grantRole(role, guy).buildTransaction(
                        {
                            "gasPrice": polygon_web3.eth.gas_price,
                            "chainId": 80001,
                            "from": owner_wallet,
                            "nonce": polygon_web3.eth.getTransactionCount(owner_wallet),
                        }
                    )
                    signed_tx = polygon_web3.eth.account.sign_transaction(grant_role_txn, private_key=owner_wallet_key)
                    tx_hash = polygon_web3.eth.send_raw_transaction(signed_tx.rawTransaction)
                    txReceipt = polygon_web3.eth.wait_for_transaction_receipt(tx_hash)

                    if txReceipt.get('status') == 0:
                        return self.send_error('Error Setting Buyer Role')
                
                isObjectRegistered = booth_contract_instance.functions.isObjectRegistered(int(tokenId)).call()

                if not isObjectRegistered:
                    # Register NFT in BOOTH Marketplace
                    abi_booth = get_polygon_contract_abi(booth_contract_address)
                    booth_contract_instance = polygon_web3.eth.contract(abi=abi_booth, address=booth_contract_address)

                    transaction_params = {
                        'from': owner_wallet,
                        'nonce': polygon_web3.eth.get_transaction_count(owner_wallet),
                        'gasPrice': polygon_web3.eth.gas_price,
                    }

                    register_object_function = booth_contract_instance.functions.registerObject(int(tokenId), contract_address)
                    gas_estimate = register_object_function.estimateGas(transaction_params)
                    transaction_params['gas'] = gas_estimate

                    tx_booth = register_object_function.buildTransaction(transaction_params)

                    signed_tx_booth = polygon_web3.eth.account.sign_transaction(tx_booth, private_key=owner_wallet_key)
                    tx_hash_booth = polygon_web3.eth.send_raw_transaction(signed_tx_booth.rawTransaction)
                    txReceipt_booth = polygon_web3.eth.wait_for_transaction_receipt(tx_hash_booth)
                    # Check if the transaction was successful
                    if txReceipt_booth['status'] == 1:
                        print("Successfully registered the NFT in the Booth contract.")
                    else:
                        print("Failed to register the NFT in the Booth contract.")
                        return self.send_error('Failed to register the NFT in the Booth contract', status=status.HTTP_400_BAD_REQUEST)
                                    
                # PURCAHSE NFT
                # Get the referrer value
                referrer = object.get('referrer', None)

                booth_transaction_params = {
                    'from': guy,
                    'nonce': polygon_web3.eth.get_transaction_count(guy),
                    'gasPrice': polygon_web3.eth.gas_price,
                    'value': price_in_wei,
                    'gas': 600000,
                }

                
                if referrer:
                    print('Purchasing NFT with join Affiliate Program and Buy')
                    abi_affiliates = get_polygon_contract_abi(affiliates_contract)
                    affiliate_contract_instance = polygon_web3.eth.contract(abi=abi_affiliates, address=affiliates_contract)
                    # Get the AFFILIATE_ROLE from the contract
                    affiliate_role = affiliate_contract_instance.functions.AFFILIATE_ROLE().call()
                    # Check if the user has the BUYER_ROLE
                    hasAffiliateRole = affiliate_contract_instance.functions.hasRole(affiliate_role, guy).call()
                    if not hasAffiliateRole:
                        print(f"Granting affiliate role to {guy}")
                        grant_role_txn = affiliate_contract_instance.functions.grantRole(affiliate_role, guy).buildTransaction(
                            {
                                "from": owner_wallet,
                                "nonce": polygon_web3.eth.getTransactionCount(owner_wallet),
                                "gasPrice": polygon_web3.eth.gas_price,
                            }
                        )
                        sign_grant_role_txn = polygon_web3.eth.account.sign_transaction(grant_role_txn, owner_wallet_key)
                        grant_role_txHash = polygon_web3.eth.send_raw_transaction(sign_grant_role_txn.rawTransaction)
                        grant_role_txReceipt = polygon_web3.eth.wait_for_transaction_receipt(grant_role_txHash)

                        if grant_role_txReceipt['status'] == 1:
                            print(f"Successfully Granted Affiliate Role to {guy}.")
                        else:
                            print("Failed to grant affiliate role.")
                            return self.send_error('Failed to register the NFT in the Booth contract', status=status.HTTP_400_BAD_REQUEST)
                    purchase = booth_contract_instance.functions.joinAffiliateProgramAndBuy(tokenId, nft_id, qty, referrer).buildTransaction(booth_transaction_params)
                else:
                    print('Purchasing NFT with Buy Method')
                    purchase = booth_contract_instance.functions.buy(tokenId, nft_id, qty, guy).buildTransaction(booth_transaction_params)

                signed_tx_booth = polygon_web3.eth.account.sign_transaction(purchase, private_key=buyer_private_key)
                tx_hash_booth = polygon_web3.eth.send_raw_transaction(signed_tx_booth.rawTransaction)
                txReceipt_booth = polygon_web3.eth.wait_for_transaction_receipt(tx_hash_booth)
                transaction_hash = txReceipt_booth.get('transactionHash').hex()
                tx_hashes.append(transaction_hash)
                if(txReceipt_booth['status']==0):
                    print('Payment Failed')
                    return self.send_error('Payment Failed Transaction')
                print(f'NFT {tokenId} succesfully purchased by {guy}')

                # Add TX HASH to List of Transactions for User to Verify
                # Kafka Producer including Ticket_Address = NFT ddress
                print('Adding NFT to NFT List, sending message with kafka Producer')
                item={}
                item['nft_id']=nft_id
                item['ticket_id']=token_id
                item['ticket_address']=contract_address
                item['wallet_address']=buyer_address
                item['transaction_hash']=transaction_hash

                producer.produce(
                    'nft_minted',
                    key='create_and_add_nft_to_nftList',
                    value=json.dumps(item).encode('utf-8')
                )
                producer.flush()

                # Create Notification Object through kafka producer
                print('Creating Notification, sending message with kafka Producer')
                notification_data = {
                    'from_user': user_id,
                    'to_user': seller_id,
                    'notification_type': 4,
                    'text_preview': """Congratulations! Your product has just been sold! 🎉🎊!""",
                    'url': '/products/' + product_uuid,
                    'is_seen': False,
                    'icon': 'bx bxs-graduation',
                    'product': product_uuid,
                }
                producer.produce(
                    'notifications',
                    key='course_sold',
                    value=json.dumps(notification_data).encode('utf-8')
                )
                # encode notification data as JSON and produce to Kafka topic
                producer.flush()


                print('Adding seller to buyer contacts, sending message with kafka Producer')
                contact_data = {
                    'buyer_id': user_id,
                    'seller_id': seller_id,
                }

                producer.produce(
                    'user_contacts',
                    key='add_seller_contact',
                    value=json.dumps(contact_data).encode('utf-8')
                )
                producer.flush()


                # Create Order
                print('Creating Order, sending message with kafka Producer')
                order_data = {
                    'cartItems': cart_items,
                    'deliveryAddress': data.get('deliveryAddress'),
                    'saveDeliveryAddress': data.get('agreed'),
                    'userID': user_id,
                    'product_response': product_response
                }
                producer.produce(
                    'orders',
                    key='create_order',
                    value=json.dumps(order_data).encode('utf-8')
                )
                producer.flush()
                
                # Delete product from cart
                print('Deleting Product from cart, sending message with kafka Producer')
                delete_cart_item_data = {
                    'user_id': user_id,
                    'product_id': product_uuid,
                }
                producer.produce(
                    'cart',
                    key='product_bought',
                    value=json.dumps(delete_cart_item_data).encode('utf-8')
                )
                producer.flush()

                # RELEASE FUNDS FOR PLATFORM AND FUNDRAISER
                # Release funds for platform
                tx1 = ticket_contract.functions.release(uridium_wallet).buildTransaction({
                    'from': uridium_wallet,
                    'nonce': polygon_web3.eth.get_transaction_count(uridium_wallet),
                    'gasPrice': polygon_web3.eth.gas_price,
                    'gas': 1000000,  # replace with the gas limit for the transaction
                })
                signed_tx1 = polygon_web3.eth.account.sign_transaction(tx1, private_key=uridium_wallet_key)
                tx1_hash = polygon_web3.eth.send_raw_transaction(signed_tx1.rawTransaction)
                tx1_receipt = polygon_web3.eth.wait_for_transaction_receipt(tx1_hash)

                if tx1_receipt.status == 1:
                    print("Funds released to uridium_wallet successfully!")
                else:
                    print("Error releasing funds to uridium_wallet")
                    
                # Release funds for fundraiser
                tx2 = ticket_contract.functions.release(owner_wallet).buildTransaction({
                    'from': owner_wallet,
                    'nonce': polygon_web3.eth.get_transaction_count(owner_wallet),
                    'gasPrice': polygon_web3.eth.gas_price,
                    'gas': 1000000,  # replace with the gas limit for the transaction
                })

                signed_tx2 = polygon_web3.eth.account.sign_transaction(tx2, private_key=owner_wallet_key)
                tx2_hash = polygon_web3.eth.send_raw_transaction(signed_tx2.rawTransaction)
                tx2_receipt = polygon_web3.eth.wait_for_transaction_receipt(tx2_hash)
                if tx2_receipt.status == 1:
                    print("Funds released to owner_wallet successfully!")
                else:
                    print("Error releasing funds to owner_wallet")
                
                # Release funds for seller
                tx3 = ticket_contract.functions.release(seller_polygon_address).buildTransaction({
                    'from': seller_polygon_address,
                    'nonce': polygon_web3.eth.get_transaction_count(seller_polygon_address),
                    'gasPrice': polygon_web3.eth.gas_price,
                    'gas': 1000000,  # replace with the gas limit for the transaction
                })

                signed_tx3 = polygon_web3.eth.account.sign_transaction(tx3, private_key=seller_private_key)
                tx3_hash = polygon_web3.eth.send_raw_transaction(signed_tx3.rawTransaction)
                tx3_receipt = polygon_web3.eth.wait_for_transaction_receipt(tx3_hash)
                if tx3_receipt.status == 1:
                    print("Funds released to seller successfully!")
                else:
                    print("Error releasing funds to seller")
            
            responseDictionary = {
                'transaction_hashes':tx_hashes
            }

            return self.send_response(responseDictionary, status=status.HTTP_200_OK)
        else:
            return self.send_error('User must be logged in', status=status.HTTP_401_UNAUTHORIZED)


class VerifyTicketOwnershipView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        # payload = validate_token(request)
        data= request.data
        polygon_address = data['polygon_address']
        # Build Instance of Contract
        ticket_id = data['ticket_id']
        contract_address = data['nft_address']
        # Fetch ABI
        abi = get_polygon_contract_abi(contract_address)
        # Creat Contract Instance
        contract = polygon_web3.eth.contract(abi=abi, address=contract_address)
        # balance = contract.functions.get_balance(payload['polygon_address'])
        result = contract.functions.hasAccess(int(ticket_id),polygon_address).call()
        return self.send_response(result, status=status.HTTP_200_OK)


class GetStockView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        data= request.data
        # Build Instance of Contract
        ticket_id = data['ticketId']
        contract_address = data['address']
        # Fetch ABI
        abi = get_polygon_contract_abi(contract_address)
        # Creat Contract Instance
        contract = polygon_web3.eth.contract(abi=abi, address=contract_address)
        # balance = contract.functions.get_balance(payload['polygon_address'])
        result = contract.functions.getStock(int(ticket_id)).call()
        return self.send_response(result, status=status.HTTP_200_OK)


class BuyCourseNFT(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']
        data= request.data
        print(data)
        guy = data['polygon_address']
        buyer_address = data['buyer_address']

        # Create an empty list to hold transaction hashes
        tx_hashes = []
        finalCoursePrice = Decimal('0')

        # Fetch Matic and ETH price in USD
        eth_price = cache.get('eth_price')
        matic_price = cache.get('matic_price')
        if not eth_price:
            eth_price_response = requests.get('https://api.coingecko.com/api/v3/simple/price?ids=matic-network%2Cethereum&vs_currencies=usd').json()
            eth_price = eth_price_response.get('ethereum').get('usd')
            matic_price = eth_price_response.get('matic-network').get('usd')
            cache.set('eth_price', eth_price, 1 * 60) # cache for 1 minutes
            cache.set('matic_price', matic_price, 1 * 60) # cache for 1 minutes

        # Calculate Price to Pay Per Course
        final_course_price, course_response, is_discounted = calculate_course_price(data)
        finalCoursePrice += Decimal(final_course_price)
        course_matic_price = Decimal(final_course_price) / Decimal(matic_price)
        price_in_wei = polygon_web3.toWei(course_matic_price, 'ether')
        course_uuid = course_response.get('results').get('details').get('id')

        
        token_id = course_response.get('results').get('details').get('token_id')
        tokenId = int(token_id)
        nft_id = random.randint(10000, 999999999)
        qty = 1
        
        # Pay for course
        seller_id = course_response.get('results').get('details').get('sellers')[0].get('author')
        seller_ethereum_address = course_response.get('results').get('details').get('sellers')[0].get('address')
        seller_polygon_address = course_response.get('results').get('details').get('sellers')[0].get('polygon_address')

        seller_private_key = decrypt_polygon_private_key(seller_ethereum_address)

        # Decrypt private key for buyer
        buyer_private_key = decrypt_polygon_private_key(buyer_address)

        # Build Instance of Contract
        contract_address = course_response.get('results').get('details').get('nft_address')
        # Fetch ABI
        # abi = get_polygon_contract_abi(contract_address)
        ticket_location = os.path.join(settings.BASE_DIR, 'contracts', 'marketplace', 'ticket.sol')
        with open(os.path.join(ticket_location, 'Ticket.json'), "r") as f:
            contract_json = json.load(f)
        abi = contract_json['abi']
        # bytecode = contract_json['bytecode']
        # Creat Contract Instance
        ticket_contract = polygon_web3.eth.contract(abi=abi, address=contract_address)

        # Check if user has sufficient balance
        balance = polygon_web3.eth.get_balance(guy)
        if balance < polygon_web3.eth.gas_price + price_in_wei:
            return self.send_error('insufficient funds for gas * price + value', status=status.HTTP_400_BAD_REQUEST)
        
        # Call the getStock function for the given tokenId
        stock = ticket_contract.functions.getStock(tokenId).call()

        # Check if the stock is unlimited or greater than zero
        if stock == -1 or stock > 0:
            # Continue with the purchase
            print("Stock is available, continue with the purchase")
        else:
            return self.send_error("No stock available, cannot continue with the purchase", status=status.HTTP_400_BAD_REQUEST)                

        # Register NFT in BOOTH Marketplace
        # abi_booth = get_polygon_contract_abi(booth_contract_address)
        # bytecode_booth = get_polygon_contract_bytecode(booth_contract_address)
        booth_location = os.path.join(settings.BASE_DIR, 'contracts', 'marketplace', 'booth.sol')
        with open(os.path.join(booth_location, 'Booth.json'), "r") as f:
            contract_json = json.load(f)
        abi_booth = contract_json['abi']
        # 3) create contract instance
        booth_contract_instance = polygon_web3.eth.contract(abi=abi_booth, address=booth_contract_address)
        # Get the BUYER_ROLE from the contract
        buyer_role = booth_contract_instance.functions.BUYER_ROLE().call()
        # Check if the user has the BUYER_ROLE
        hasRole = booth_contract_instance.functions.hasRole(buyer_role, guy).call()

        if not hasRole:
            print(f'Setting Buyer ROLE for {guy}')
            # Create Approve Buyer as Discounted method
            role = booth_contract_instance.functions.BUYER_ROLE().call()
            grant_role_txn = booth_contract_instance.functions.grantRole(role, guy).buildTransaction(
                {
                    "gasPrice": polygon_web3.eth.gas_price,
                    "chainId": 80001,
                    "from": owner_wallet,
                    "nonce": polygon_web3.eth.getTransactionCount(owner_wallet),
                }
            )
            signed_tx = polygon_web3.eth.account.sign_transaction(grant_role_txn, private_key=owner_wallet_key)
            tx_hash = polygon_web3.eth.send_raw_transaction(signed_tx.rawTransaction)
            txReceipt = polygon_web3.eth.wait_for_transaction_receipt(tx_hash)

            if txReceipt.get('status') == 0:
                return self.send_error('Error Setting Buyer Role')
        
        isObjectRegistered = booth_contract_instance.functions.isObjectRegistered(int(tokenId)).call()

        if not isObjectRegistered:
            # Register NFT in BOOTH Marketplace
            abi_booth = get_polygon_contract_abi(booth_contract_address)
            booth_contract_instance = polygon_web3.eth.contract(abi=abi_booth, address=booth_contract_address)

            transaction_params = {
                'from': owner_wallet,
                'nonce': polygon_web3.eth.get_transaction_count(owner_wallet),
                'gasPrice': polygon_web3.eth.gas_price,
            }

            register_object_function = booth_contract_instance.functions.registerObject(int(tokenId), contract_address)
            gas_estimate = register_object_function.estimateGas(transaction_params)
            transaction_params['gas'] = gas_estimate

            tx_booth = register_object_function.buildTransaction(transaction_params)

            signed_tx_booth = polygon_web3.eth.account.sign_transaction(tx_booth, private_key=owner_wallet_key)
            tx_hash_booth = polygon_web3.eth.send_raw_transaction(signed_tx_booth.rawTransaction)
            txReceipt_booth = polygon_web3.eth.wait_for_transaction_receipt(tx_hash_booth)
            # Check if the transaction was successful
            if txReceipt_booth['status'] == 1:
                print("Successfully registered the NFT in the Booth contract.")
            else:
                print("Failed to register the NFT in the Booth contract.")
                return self.send_error('Failed to register the NFT in the Booth contract', status=status.HTTP_400_BAD_REQUEST)
                            
        # PURCAHSE NFT
        # Get the referrer value
        referrer = data.get('referrer', None)

        booth_transaction_params = {
            'from': guy,
            'nonce': polygon_web3.eth.get_transaction_count(guy),
            'gasPrice': polygon_web3.eth.gas_price,
            'value': price_in_wei,
            'gas': 600000,
        }

        
        if referrer:
            print('Purchasing NFT with join Affiliate Program and Buy')
            abi_affiliates = get_polygon_contract_abi(affiliates_contract)
            affiliate_contract_instance = polygon_web3.eth.contract(abi=abi_affiliates, address=affiliates_contract)
            # Get the AFFILIATE_ROLE from the contract
            affiliate_role = affiliate_contract_instance.functions.AFFILIATE_ROLE().call()
            # Check if the user has the BUYER_ROLE
            hasAffiliateRole = affiliate_contract_instance.functions.hasRole(affiliate_role, guy).call()
            if not hasAffiliateRole:
                print(f"Granting affiliate role to {guy}")
                grant_role_txn = affiliate_contract_instance.functions.grantRole(affiliate_role, guy).buildTransaction(
                    {
                        "from": owner_wallet,
                        "nonce": polygon_web3.eth.getTransactionCount(owner_wallet),
                        "gasPrice": polygon_web3.eth.gas_price,
                    }
                )
                sign_grant_role_txn = polygon_web3.eth.account.sign_transaction(grant_role_txn, owner_wallet_key)
                grant_role_txHash = polygon_web3.eth.send_raw_transaction(sign_grant_role_txn.rawTransaction)
                grant_role_txReceipt = polygon_web3.eth.wait_for_transaction_receipt(grant_role_txHash)

                if grant_role_txReceipt['status'] == 1:
                    print(f"Successfully Granted Affiliate Role to {guy}.")
                else:
                    print("Failed to grant affiliate role.")
                    return self.send_error('Failed to register the NFT in the Booth contract', status=status.HTTP_400_BAD_REQUEST)
            purchase = booth_contract_instance.functions.joinAffiliateProgramAndBuy(tokenId, nft_id, qty, referrer).buildTransaction(booth_transaction_params)
        else:
            print('Purchasing NFT with Buy Method')
            purchase = booth_contract_instance.functions.buy(tokenId, nft_id, qty, guy).buildTransaction(booth_transaction_params)

        signed_tx_booth = polygon_web3.eth.account.sign_transaction(purchase, private_key=buyer_private_key)
        tx_hash_booth = polygon_web3.eth.send_raw_transaction(signed_tx_booth.rawTransaction)
        txReceipt_booth = polygon_web3.eth.wait_for_transaction_receipt(tx_hash_booth)
        transaction_hash = txReceipt_booth.get('transactionHash').hex()
        tx_hashes.append(transaction_hash)
        if(txReceipt_booth['status']==0):
            print('Payment Failed')
            return self.send_error('Payment Failed Transaction')
        print(f'NFT {tokenId} succesfully purchased by {guy}')

        # Add TX HASH to List of Transactions for User to Verify
        # Kafka Producer including Ticket_Address = NFT ddress
        print('Adding NFT to NFT List, kafka producer')
        item={}
        item['nft_id']=nft_id
        item['ticket_id']=token_id
        item['ticket_address']=contract_address
        item['wallet_address']=buyer_address
        item['transaction_hash']=transaction_hash

        producer.produce(
            'nft_minted',
            key='create_and_add_nft_to_nftList',
            value=json.dumps(item).encode('utf-8')
        )
        producer.flush()

        # Create Notification Object through kafka producer
        print('Creating Notification, kafka producer')
        notification_data = {
            'from_user': user_id,
            'to_user': seller_id,
            'notification_type': 4,
            'text_preview': """Congratulations! Your course has just been sold! 🎉🎊!""",
            'url': '/courses/'+course_uuid,
            'is_seen': False,
            'icon': 'bx bxs-graduation',
            'course': course_uuid,
        }
        producer.produce(
            'notifications',
            key='course_sold',
            value=json.dumps(notification_data).encode('utf-8')
        )
        # encode notification data as JSON and produce to Kafka topic
        producer.flush()

        # ADD Course to user library
        print('Adding Course to Library, kafka producer')
        course_data = {
            'user_id': user_id,
            'course': course_uuid,
            'tokenID': tokenId,
            'contractAddress': contract_address,
        }
        producer.produce(
            'nft_minted',
            key='course_bought',
            value=json.dumps(course_data).encode('utf-8')
        )
        producer.flush()

        #  ADD instructor to user conntact list
        print('Adding Instructor to Buyer Contacts, kafka producer')
        contact_data = {
            'buyer_id': user_id,
            'seller_id': seller_id,
        }
        producer.produce(
            'user_contacts',
            key='add_instructor_contact',
            value=json.dumps(contact_data).encode('utf-8')
        )
        producer.flush()

        # Delete course from cart
        print('Deleting Course from Cart, kafka producer')
        delete_cart_item_data = {
            'user_id': user_id,
            'course_id': course_uuid,
        }
        producer.produce(
            'cart',
            key='course_bought',
            value=json.dumps(delete_cart_item_data).encode('utf-8')
        )
        producer.flush()

        # RELEASE FUNDS FOR PLATFORM AND FUNDRAISER
        # Release funds for platform
        tx1 = ticket_contract.functions.release(uridium_wallet).buildTransaction({
            'from': uridium_wallet,
            'nonce': polygon_web3.eth.get_transaction_count(uridium_wallet),
            'gasPrice': polygon_web3.eth.gas_price,
            'gas': 1000000,  # replace with the gas limit for the transaction
        })
        signed_tx1 = polygon_web3.eth.account.sign_transaction(tx1, private_key=uridium_wallet_key)
        tx1_hash = polygon_web3.eth.send_raw_transaction(signed_tx1.rawTransaction)
        tx1_receipt = polygon_web3.eth.wait_for_transaction_receipt(tx1_hash)

        if tx1_receipt.status == 1:
            print("Funds released to uridium_wallet successfully!")
        else:
            print("Error releasing funds to uridium_wallet")
            
        # Release funds for fundraiser
        tx2 = ticket_contract.functions.release(owner_wallet).buildTransaction({
            'from': owner_wallet,
            'nonce': polygon_web3.eth.get_transaction_count(owner_wallet),
            'gasPrice': polygon_web3.eth.gas_price,
            'gas': 1000000,  # replace with the gas limit for the transaction
        })

        signed_tx2 = polygon_web3.eth.account.sign_transaction(tx2, private_key=owner_wallet_key)
        tx2_hash = polygon_web3.eth.send_raw_transaction(signed_tx2.rawTransaction)
        tx2_receipt = polygon_web3.eth.wait_for_transaction_receipt(tx2_hash)
        if tx2_receipt.status == 1:
            print("Funds released to owner_wallet successfully!")
        else:
            print("Error releasing funds to owner_wallet")
        
        # Release funds for seller
        tx3 = ticket_contract.functions.release(seller_polygon_address).buildTransaction({
            'from': seller_polygon_address,
            'nonce': polygon_web3.eth.get_transaction_count(seller_polygon_address),
            'gasPrice': polygon_web3.eth.gas_price,
            'gas': 1000000,  # replace with the gas limit for the transaction
        })

        signed_tx3 = polygon_web3.eth.account.sign_transaction(tx3, private_key=seller_private_key)
        tx3_hash = polygon_web3.eth.send_raw_transaction(signed_tx3.rawTransaction)
        tx3_receipt = polygon_web3.eth.wait_for_transaction_receipt(tx3_hash)
        if tx3_receipt.status == 1:
            print("Funds released to seller successfully!")
        else:
            print("Error releasing funds to seller")
        return self.send_response('Payment Successfull')

