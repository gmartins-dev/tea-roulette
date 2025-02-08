export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  drinkOrders?: DrinkOrder[];
}

export interface DrinkOrder {
  id?: string;
  userId: string;
  name: string;
  type: string;
  additionalSpecification: Record<string, string>;
}

export interface DrinkRun {
  id?: string;
  drinkMaker: User;
  orders: DrinkOrder[];
}

export interface Participant {
  userId: string;
}
