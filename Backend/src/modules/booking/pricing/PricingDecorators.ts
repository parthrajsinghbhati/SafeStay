import type { RoomPricing } from './RoomPricing.js';

/**
 * RoomPricingDecorator (Abstract Base Decorator)
 * 
 * SOLID Principles:
 * - Single Responsibility Principle (SRP): Each decorator handles one specific add-on.
 * - Open/Closed Principle (OCP): New add-ons can be created by simply extending this base decorator 
 *   without modifying existing code.
 */
export abstract class RoomPricingDecorator implements RoomPricing {
  constructor(protected baseRoom: RoomPricing) {}

  calculate(): number {
    return this.baseRoom.calculate();
  }

  getDescription(): string {
    return this.baseRoom.getDescription();
  }
}

/**
 * Air Conditioning Decorator
 */
export class ACDecorator extends RoomPricingDecorator {
  private static readonly AC_PRICE = 50.0;

  calculate(): number {
    return super.calculate() + ACDecorator.AC_PRICE;
  }

  getDescription(): string {
    return super.getDescription() + ', AC Included';
  }
}

/**
 * Wi-Fi Decorator
 */
export class WiFiDecorator extends RoomPricingDecorator {
  private static readonly WIFI_PRICE = 20.0;

  calculate(): number {
    return super.calculate() + WiFiDecorator.WIFI_PRICE;
  }

  getDescription(): string {
    return super.getDescription() + ', Wi-Fi Included';
  }
}

/**
 * Food/Meal Plan Decorator
 */
export class MealDecorator extends RoomPricingDecorator {
  private static readonly FOOD_PRICE = 150.0;

  calculate(): number {
    return super.calculate() + MealDecorator.FOOD_PRICE;
  }

  getDescription(): string {
    return super.getDescription() + ', Food Plan Included';
  }
}
