import { BaseRoom } from '../pricing/BaseRoom.js';
import type { RoomPricing } from '../pricing/RoomPricing.js';
import { ACDecorator, WiFiDecorator, MealDecorator } from '../pricing/PricingDecorators.js';

export class PricingEngine {
  static calculate(basePrice: number, roomNumber: string, extras: string[] = []) {
    let roomPricing: RoomPricing = new BaseRoom(basePrice, roomNumber);

    if (extras.includes('AC')) roomPricing = new ACDecorator(roomPricing);
    if (extras.includes('WiFi')) roomPricing = new WiFiDecorator(roomPricing);
    if (extras.includes('Food') || extras.includes('Meal')) roomPricing = new MealDecorator(roomPricing);

    return {
      totalPrice: roomPricing.calculate(),
      description: roomPricing.getDescription(),
    };
  }
}
