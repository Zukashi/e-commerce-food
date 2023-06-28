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
import { ChangeItemDto } from './dto/ChangeItem.dto';
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

    const cartItems: { productId: string; quantity: number }[] =
      req.cookies['cart'] || [];
    if (cartItems.length === 0) return [];
    console.log(cartItems);
    const parsedCartItems = await this.productRepository.find({
      where: cartItems.map((cartItem) => ({
        id: cartItem.productId,
      })),
      relations: ['productImages', 'vendor'],
    });
    console.log(parsedCartItems);
    const productsWithQuantities = parsedCartItems.map((product, i) => {
      return {
        ...product,
        quantity: cartItems[i].quantity,
      };
    });

    return productsWithQuantities;
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

      const cartItems = await this.productRepository.find({
        where: cartItemsAsProductIds.map((cartItem) => ({
          id: cartItem.productId,
        })),
        relations: ['vendor'],
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

  async removeElementFromCart(
    req: ReqWithCustomer,
    productId: string,
    res: Response,
  ) {
    if (req.user) {
      await this.cartRepository
        .createQueryBuilder('cart')
        .delete()
        .from(CartItem)
        .where('product.id =:productId', { productId })
        .execute();
    } else {
      const cart: { productId: string; quantity: number }[] =
        req.cookies['cart'];
      const filtered = cart.filter(
        (product) => product.productId !== productId,
      );
      res.cookie('cart', [...filtered], {
        expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7),
        secure: true,
        httpOnly: true,
      });
    }
  }

  async changeItemQuantityInCart(
    req: ReqWithCustomer,
    changeItemDto: ChangeItemDto,
    productId: string,
    res: Response,
  ) {
    const cartItemsAsProductIds: { productId: string; quantity: number }[] =
      req.cookies['cart'] || [];
    const filtered = cartItemsAsProductIds.map((cartItem) => {
      if (cartItem.productId === productId) {
        cartItem.quantity = changeItemDto.quantity;
      }
      return cartItem;
    });
    console.log(filtered, 555);
    res.cookie('cart', [...filtered], {
      expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7),
      secure: true,
      httpOnly: true,
    });
    return this.getItems(req);
  }
}
