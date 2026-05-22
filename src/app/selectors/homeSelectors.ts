import { RootState } from '../../types';

export const selectHome = (state: RootState) => state.home;
export const selectMenuVisible = (state: RootState) => state.home.menuVisible;
export const selectRooms = (state: RootState) => state.home.rooms;
export const selectAmenities = (state: RootState) => state.home.amenities;
export const selectSectionLayouts = (state: RootState) => state.home.sectionLayouts;
export const selectHomeLoading = (state: RootState) => state.home.loading;
export const selectHomeError = (state: RootState) => state.home.error;
