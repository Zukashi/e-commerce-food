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
        relations: ['cartItems'],
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
      console.log(999);
      let cart = await this.cartRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.user', 'user')
        .leftJoinAndSelect('cart.cartItems', 'cartItems')
        .leftJoinAndSelect('cartItems.product', 'product')
        .where('user.id =:userId', { userId: req.user.id })
        .getOne();
      if (!cart) {
        // If cart does not exist, create a new one
        cart = await this.cartRepository.create({
          user: req.user,
          cartItems: [],
        });
        console.log(cart);
        await this.cartRepository.save(cart);
        const cartItem = await this.cartItemRepository.create({
          cart,
          product,
          quantity: addItemDto.quantity,
        });
        console.log(cartItem);
        await this.cartItemRepository.save(cartItem);
        cart.cartItems.push(cartItem);
      } else {
        // If cart exists, add the new product to the existing products
        const cartItem = await this.cartItemRepository
          .createQueryBuilder('cartItem')
          .leftJoinAndSelect('cartItem.product', 'product')
          .where('product.id =:id', {
            id: productId,
          })
          .getOne();
        console.log(cartItem, 999999);
        if (!cartItem) {
          const cartItem = await this.cartItemRepository.create({
            cart,
            product,
            quantity: addItemDto.quantity,
          });
          cart.cartItems.push(cartItem);
          await this.cartItemRepository.save(cartItem);
        } else {
          const cartItemNew = await this.cartItemRepository
            .createQueryBuilder('cartItem')
            .leftJoinAndSelect('cartItem.product', 'product')
            .leftJoinAndSelect('cartItem.cart', 'cart')
            .update(CartItem)
            .set({
              quantity: addItemDto.quantity,
            })
            .where('product.id = :productId', { productId })
            .andWhere('cart.id = :cartId', { cartId: cart.id })
            .execute();
          if (!cartItemNew) throw new NotFoundException();
        }
      }
      console.log(cart.cartItems[0]);
      const cartUpdated = await this.cartRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.cartItems', 'cartItem')
        .leftJoinAndSelect('cartItem.product', 'product')
        .where('cart.id = :cartId', { cartId: cart.id })
        .getOne();
      return cartUpdated;
    } else {
      // If the user is not logged in, retrieve the cart items from the cookie
      const cartItems = req.cookies['cart'] || [];
      console.log(333);
      return cartItems;
    }
  }

  async deleteItemFromCart(req: ReqWithCustomer, productId: string) {
    const product = await this.productRepository.findOneBy({
      id: productId,
    });
    if (req.user) {
      // If the user is logged in, retrieve the cart items from the database
      const cart = await this.cartRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.user', 'user')
        .leftJoinAndSelect('cart.cartItems', 'cartItems')
        .leftJoinAndSelect('cartItems.product', 'product')
        .where('user.id =:userId', { userId: req.user.id })
        .getOne();

      if (!cart) throw new NotFoundException();
      await this.cartItemRepository
        .createQueryBuilder('cartItem')
        .delete()
        .from(CartItem)
        .where('cart =:cart', { cart });
    }
  }
}
