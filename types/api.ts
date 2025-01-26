export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
}

export interface ErrorResponse {
  message: string;
  status: number;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
}

export interface CreateDrinkRunDto {
  participants: { userId: string }[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  drinkOrders: DrinkOrder[];
}

export interface DrinkOrder {
  id: string;
  userId: string;
  name: string;
  type: string;
  additionalSpecification: Record<string, string>;
}

export interface DrinkRun {
  id: string;
  drinkMaker: User;
  orders: DrinkOrder[];
}

export interface ApiErrorResponse {
  detail: string;
  status: number;
}

export interface ApiSuccessResponse<T> {
  data: T;
  status: number;
}
