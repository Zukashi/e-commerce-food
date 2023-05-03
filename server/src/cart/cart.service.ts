import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  In,
  Repository,
  SelectQueryBuilder,
  UpdateQueryBuilder,
} from 'typeorm';
import { Response } from 'express';
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
    if (req.user && req.cookies['cart'].length < 1) {
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

      const cartItems: { productId: string; quantity: number }[] =
        req.cookies['cart'] || [];
      if (cartItems.length === 0) return [];
      const parsedCartItems = await this.productRepository.find({
        where: cartItems.map((cartItem) => ({
          id: cartItem.productId,
        })),
      });
      console.log(cartItems);
      const productsWithQuantities = parsedCartItems.map((product, i) => {
        return {
          ...product,
          quantity: cartItems[i].quantity,
        };
      });

      return productsWithQuantities;
    }
  }

  async addItemToCartOrUpdateQuantity(
    req: ReqWithCustomer,
    addItemDto: AddItemDto,
    productId: string,
    res: Response,
  ) {
    const product = await this.productRepository.findOneBy({
      id: productId,
    });

    if (!product) {
      throw new Error('Product not found');
    }
    if (addItemDto.quantity > product?.quantity) {
      throw new ConflictException('Too high quantity');
    }
    if (req.user && req.cookies['cart'].length < 1) {
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

      const cartUpdated = await this.cartRepository.findOne({
        where: {
          id: cart.id,
        },
        relations: {
          cartItems: {
            product: true,
          },
          user: true,
        },
      });
      return cartUpdated;
    } else {
      // If the user is not logged in, retrieve the cart items from the cookie
      let cartItemsAsProductIds: { productId: string; quantity: number }[] =
        req.cookies['cart'] || [];
      console.log(cartItemsAsProductIds.length);
      if (!Boolean(cartItemsAsProductIds.length)) {
        console.log(9999);
        cartItemsAsProductIds.push({
          productId,
          quantity: addItemDto.quantity,
        });
        res.cookie(
          'cart',
          [
            {
              productId,
              quantity: addItemDto.quantity,
            },
          ],
          {
            expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7),
            secure: true,
            httpOnly: true,
          },
        );
      } else {
        if (
          cartItemsAsProductIds.some((cartItem) => {
            return cartItem.productId === productId;
          })
        ) {
          console.log(cartItemsAsProductIds);
          /// if productId already exists in cartItems then delete and replace
          cartItemsAsProductIds = cartItemsAsProductIds.filter((cartItem) => {
            return cartItem.productId !== productId;
          });
          console.log(cartItemsAsProductIds);
          cartItemsAsProductIds.push({
            quantity: addItemDto.quantity,
            productId,
          });
        } else {
          cartItemsAsProductIds.push({
            quantity: addItemDto.quantity,
            productId,
          });
        }
        res.cookie('cart', [...cartItemsAsProductIds], {
          expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7),
          secure: true,
          httpOnly: true,
        });
      }

      const cartItems = await this.productRepository.find({
        where: cartItemsAsProductIds.map((cartItem) => ({
          id: cartItem.productId,
        })),
      });
      console.log(cartItems);
      const productsWithQuantities = cartItems.map((product, i) => {
        return {
          ...product,
          quantity: cartItemsAsProductIds[i]?.quantity,
        };
      });
      console.log(productsWithQuantities);
      return productsWithQuantities;
    }
  }

  async deleteItemFromCart(
    req: ReqWithCustomer,
    productId: string,
    response: Response,
  ) {
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
        .leftJoinAndSelect('cartItem.product', 'product')
        .delete()
        .from(CartItem)
        .where('product.id =:productId', { productId })
        .execute();
    } else {
      const cartItemsAsProductIds: { productId: string; quantity: number }[] =
        req.cookies['cart'] || [];
      const filteredProducts = cartItemsAsProductIds.filter((cartItem) => {
        return cartItem.productId !== productId;
      });
      response.cookie('cart', filteredProducts, {
        expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7),
        secure: true,
        httpOnly: true,
      });
    }
  }
}
