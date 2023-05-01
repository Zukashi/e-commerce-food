import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  Repository,
  SelectQueryBuilder,
  UpdateQueryBuilder,
} from 'typeorm';
import { Cart } from './entities/cart.entity';
import { ReqWithCustomer } from '../auth/types/Req/User';
import { AddItemDto } from './dto/AddItem.dto';
import { Product } from '../product/entities/product.entity';
import { CartItem } from './entities/cart-item.entity';
@Injectable()
export class CartService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}
  async getItems(req: ReqWithCustomer) {
    console.log(req.user);
    if (req.user) {
      // If the user is logged in, retrieve the cart items from the database
      const cartItems = await this.cartRepository.find({
        where: { user: req.user },
        relations: ['products'],
      });
      console.log(cartItems);
      console.log(888);
      return cartItems;
    } else {
      // If the user is not logged in, retrieve the cart items from the cookie
      const cartItems = req.cookies['cart'] || [];
      console.log(333);
      return cartItems;
    }
  }

  async addItemToCart(
    req: ReqWithCustomer,
    addItemDto: AddItemDto,
    productId: string,
  ) {
    const product = await this.productRepository.findOneBy({
      id: productId,
    });

    if (!product) {
      throw new Error('Product not found');
    }
    if (req.user) {
      // If the user is logged in, retrieve the cart items from the database
      let cart = await this.cartRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.user', 'user')
        .leftJoinAndSelect('cart.products', 'cartItems')
        .leftJoinAndSelect('cartItems.product', 'product')
        .where('user.id =:userId', { userId: req.user.id })
        .getOne();
      if (!cart) {
        // If cart does not exist, create a new one
        cart = await this.cartRepository.create({
          user: req.user,
          products: [],
        });
        await this.cartRepository.save(cart);
        const cartItem = await this.cartItemRepository.create({
          cart,
          product,
          quantity: 1,
        });
        cart.products.push(cartItem);
        await this.cartItemRepository.save(cartItem);
      } else {
        // If cart exists, add the new product to the existing products
        const cartItem = await this.cartItemRepository
          .createQueryBuilder('cartItem')
          .leftJoinAndSelect('cartItem.product', 'product')
          .where('product.id =:id', {
            id: productId,
          })
          .getOne();
        if (!cartItem) {
          const cartItem = await this.cartItemRepository.create({
            cart,
            product,
            quantity: 1,
          });
          cart.products.push(cartItem);
          await this.cartItemRepository.save(cartItem);
        } else {
          const cartItemNew = await this.cartItemRepository.preload({
            id: cartItem?.id,
            quantity: cartItem.quantity + 1,
          });
          if (!cartItemNew) throw new NotFoundException();
          await this.cartItemRepository.save(cartItemNew);
          await this.cartRepository.save(cart);
        }
        await this.cartRepository.save(cart);
      }
      console.log(cart.products[0]);
      return cart;
    } else {
      // If the user is not logged in, retrieve the cart items from the cookie
      const cartItems = req.cookies['cart'] || [];
      console.log(333);
      return cartItems;
    }
  }
}
