import { Room } from '../services/customerApi';

export type RootStackParamList = {
  Rooms: undefined;
  RoomDetail: { roomId: number };
  CreateBooking: { roomId: number; room: Room };
  MyBookings: undefined;
  Profile: undefined;
  EditProfile: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
};
