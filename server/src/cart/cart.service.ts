import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cart } from './entities/cart';
import { ReqWithCustomer } from '../auth/types/Req/User';
import { AddItemDto } from './dto/AddItem.dto';
import { Product } from '../product/entities/product.entity';
@Injectable()
export class CartService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
        .innerJoinAndSelect('cart.user', 'user')
        .innerJoinAndSelect('cart.products', 'products')
        .where('user.id =:userId', { userId: req.user.id })
        .getOne();
      console.log(cart);
      if (!cart) {
        // If cart does not exist, create a new one
        cart = new Cart();
        cart.user = req.user;
        cart.products = [product];
      } else {
        // If cart exists, add the new product to the existing products
        cart.products.push(product);
      }
      await this.cartRepository.save(cart);
      console.log(cart);
      return cart;
    } else {
      // If the user is not logged in, retrieve the cart items from the cookie
      const cartItems = req.cookies['cart'] || [];
      console.log(333);
      return cartItems;
    }
  }
}
