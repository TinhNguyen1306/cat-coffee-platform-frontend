import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { CoffeeShop, CoffeeShopProps } from '../../../domain/models';
import {
  bookTableThunk,
  getAllCoffeeShopsThunk,
  getCoffeeShopCatFoodThunk,
  getCoffeeShopCatsThunk,
  getSlotsThunk,
  getTableByShopIdThunk,
  searchCoffeeShopByNameThunk,
} from './coffeeShop.thunks';

export interface CoffeeShopApiResponse {
  shopId: string;
  accountId: string;
  shopName: string;
  startTime: string;
  endTime: string;
}

export interface CatFood {
  catFoodId: number;
  catFoodName: string;
  catFoodPrice: number;
}

export interface Cat {
  catId: string;
  catTypeId: string;
  areaId: string;
  shopId: string;
  catName: string;
}

export interface Slot {
  slotId: string;
  startTime: string;
  endTime: string;
}

export interface Table {
  tableId: string;
  shopId: string;
  areaId: string;
  tableName: string;
}

export interface Drink {}

export interface CoffeeShopState {
  coffeeShops?: CoffeeShop[];
  searchResults?: CoffeeShop[];
  isLoadingSearch: boolean;
  isLoadingGetAll: boolean;
  isLoadingGetCats: boolean;
  isLoadingGetCatFood: boolean;
  isLoadingBooking: boolean;
  selectedCoffeeShopCatFood?: CatFood[];
  selectedCoffeeShopCats?: Cat[];
  selectedCoffeeShopTables?: Table[];
  slots: Slot[];
  error?: string;
}

const initialState: CoffeeShopState = {
  searchResults: [],
  coffeeShops: [],
  slots: [],
  selectedCoffeeShopCatFood: [],
  selectedCoffeeShopCats: [],
  selectedCoffeeShopTables: [],
  isLoadingGetCats: false,
  isLoadingGetCatFood: false,
  isLoadingSearch: false,
  isLoadingGetAll: false,
  isLoadingBooking: false,
};

const coffeeShopSlice = createSlice({
  name: 'coffeeShop',
  initialState,
  reducers: {
    mockGetAllCoffeeShops: (state) => {},
    mockSearchCoffeeShopByName: (state, action) => {
      const { payload } = action;

      const mockCoffeeShops = [
        new CoffeeShop({
          shopId: '1',
          shopName: 'Shop 1',
          startDate: '8:00',
          endDate: '23:00',
        }),
        new CoffeeShop({
          shopId: '2',
          shopName: 'Shop 2',
          startDate: '8:00',
          endDate: '23:00',
        }),
      ];
      state.coffeeShops = mockCoffeeShops;
      state.searchResults = mockCoffeeShops.filter((shop) =>
        shop?.shopName?.toLowerCase().includes(payload.toLowerCase()),
      );
      state.isLoadingSearch = false;
    },
    mockGetTables: (state) => {
      // const mockTables = [
      //   {
      //     tableId: '1',
      //     tableName: 'Table 1',
      //     status: true,
      //   },
      //   {
      //     tableId: '2',
      //     tableName: 'Table 2',
      //     status: true,
      //   },
      // ];
      // state.selectedCoffeeShopTables = mockTables;
    },
    mockGetSlots: (state) => {
      const mockSlots = [
        {
          slotId: '1',
          startTime: '8:00',
          endTime: '9:00',
        },
        {
          slotId: '2',
          startTime: '9:00',
          endTime: '10:00',
        },
      ];
      state.slots = mockSlots;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(searchCoffeeShopByNameThunk.pending, (state) => {
        state.searchResults = [];
        state.isLoadingSearch = true;
      })
      .addCase(searchCoffeeShopByNameThunk.fulfilled, (state, action) => {
        const { payload } = action;

        const coffeeShops: CoffeeShop[] = [];
        payload.forEach((shop: CoffeeShopApiResponse) => {
          const { shopId, accountId, shopName, startTime, endTime } = shop;

          const coffeeShop = new CoffeeShop({
            shopId,
            accountId,
            shopName,
            startDate: startTime,
            endDate: endTime,
          });
          coffeeShops.push(coffeeShop);
        });
        state.searchResults = [...coffeeShops];
        state.isLoadingSearch = false;
      })
      .addCase(searchCoffeeShopByNameThunk.rejected, (state, action) => {
        const { error } = action;
        state.searchResults = [];
        toast.error(error.message);
        state.isLoadingSearch = false;
      });

    builder
      .addCase(getAllCoffeeShopsThunk.pending, (state, action) => {
        state.coffeeShops = [];
        state.isLoadingGetAll = true;
      })
      .addCase(getAllCoffeeShopsThunk.fulfilled, (state, action) => {
        const { payload } = action;

        const coffeeShops: CoffeeShop[] = [];
        payload.forEach((shop: CoffeeShopApiResponse) => {
          const { shopId, accountId, shopName, startTime, endTime } = shop;
          const formattedStartDate = dayjs(startTime).format('DD/MM/YYYY');
          const formattedEndDate = dayjs(endTime).format('DD/MM/YYYY');

          const coffeeShop = new CoffeeShop({
            shopId,
            accountId,
            shopName,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          });
          coffeeShops.push(coffeeShop);
        });
        state.coffeeShops = coffeeShops;
        state.isLoadingGetAll = false;
      })
      .addCase(getAllCoffeeShopsThunk.rejected, (state, action) => {
        const { error } = action;
        state.coffeeShops = [];
        toast.error(error.message);
        state.isLoadingGetAll = false;
      });

    builder
      .addCase(getCoffeeShopCatFoodThunk.pending, (state, action) => {
        state.selectedCoffeeShopCatFood = [];
        state.isLoadingGetCatFood = true;
      })
      .addCase(getCoffeeShopCatFoodThunk.fulfilled, (state, action) => {
        const { payload } = action;
        const catFoods: CatFood[] = payload;

        state.selectedCoffeeShopCatFood = catFoods;
        state.isLoadingGetCatFood = false;
      })
      .addCase(getCoffeeShopCatFoodThunk.rejected, (state, action) => {
        const { error } = action;
        toast.error(error.message);
        state.isLoadingGetCatFood = false;
      });

    builder
      .addCase(getCoffeeShopCatsThunk.pending, (state, action) => {
        state.selectedCoffeeShopCatFood = [];
        state.isLoadingGetCats = true;
      })
      .addCase(getCoffeeShopCatsThunk.fulfilled, (state, action) => {
        const { payload } = action;
        const cats: Cat[] = payload;
        state.selectedCoffeeShopCats = cats;
        state.isLoadingGetCats = false;
      })
      .addCase(getCoffeeShopCatsThunk.rejected, (state, action) => {
        const { error } = action;
        toast.error(error.message);
        state.isLoadingGetCats = false;
      });

    builder
      .addCase(getSlotsThunk.pending, (state, action) => {
        state.slots = [];
      })
      .addCase(getSlotsThunk.fulfilled, (state, action) => {
        const { payload } = action;
        state.slots = payload;
      })
      .addCase(getSlotsThunk.rejected, (state, action) => {
        const { error } = action;
        toast.error(error.message);
      });

    builder
      .addCase(getTableByShopIdThunk.pending, (state, action) => {
        state.selectedCoffeeShopTables = [];
      })
      .addCase(getTableByShopIdThunk.fulfilled, (state, action) => {
        const { payload } = action;
        state.selectedCoffeeShopTables = payload;
      })
      .addCase(getTableByShopIdThunk.rejected, (state, action) => {
        const { error } = action;
        toast.error(error.message);
      });

    builder
      .addCase(bookTableThunk.pending, (state) => {
        state.isLoadingBooking = true;
      })
      .addCase(bookTableThunk.fulfilled, (state) => {
        toast.success('Booking successful');
        state.isLoadingBooking = false;
      })
      .addCase(bookTableThunk.rejected, (state, action) => {
        const { error } = action;
        toast.error(error.message);
        state.isLoadingBooking = false;
      });
  },
});

export const coffeeShopReducer = coffeeShopSlice.reducer;
export const {
  mockGetAllCoffeeShops,
  mockSearchCoffeeShopByName,
  mockGetSlots,
  mockGetTables,
} = coffeeShopSlice.actions;
