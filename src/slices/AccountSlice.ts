import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sBHD } from "../abi/sBHD.json";
import { abi as pBHD } from "../abi/pBHD.json";
import { abi as presaleAbi} from "../abi/Presale.json"
import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { Bond, NetworkID } from "src/lib/Bond"; // TODO: this type definition needs to move out of BOND.
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const lavadaoContract = new ethers.Contract(addresses[networkID].LAVADAO_ADDRESS as string, ierc20Abi, provider);
    const lavadaoBalance = await lavadaoContract.balanceOf(address);
    const slavadaoContract = new ethers.Contract(addresses[networkID].SLAVADAO_ADDRESS as string, sBHD, provider);
    const slavadaoBalance = await slavadaoContract.balanceOf(address);
    let poolBalance = 0;
    const poolTokenContract = new ethers.Contract(addresses[networkID].PT_TOKEN_ADDRESS as string, ierc20Abi, provider);
    poolBalance = await poolTokenContract.balanceOf(address);

    console.log('debug->dashboard1')
    return {
      balances: {
        lavadao: ethers.utils.formatUnits(lavadaoBalance, "gwei"),
        slavadao: ethers.utils.formatUnits(slavadaoBalance, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let lavadaoBalance = 0;
    let slavadaoBalance = 0;
    let plavadaoBalance = 0;
    let mimBalance = 0;
    let presaleAllowance = 0;
    let claimAllowance = 0;
    let stakeAllowance = 0;
    let unstakeAllowance = 0;
    let daiBondAllowance = 0;
    let poolAllowance = 0;
    let multiSignBalance = 0;
    
    const daiContract = new ethers.Contract(addresses[networkID].MIM_ADDRESS as string, ierc20Abi, provider);
    const daiBalance = await daiContract.balanceOf(address);
    
    const mimContract = new ethers.Contract(addresses[networkID].MIM_ADDRESS as string, ierc20Abi, provider);
    mimBalance = await mimContract.balanceOf(address);

    multiSignBalance = await mimContract.balanceOf(addresses[networkID].MULTISIGN_ADDRESS) / Math.pow(10, 18);
    console.log('debug multiSignBalance account', mimBalance);
    const plavadaoContract = new ethers.Contract(addresses[networkID].ALAVADAO_ADDRESS as string, pBHD, provider);
    plavadaoBalance = await plavadaoContract.balanceOf(address);


    const lavadaoContract = new ethers.Contract(addresses[networkID].LAVADAO_ADDRESS as string, ierc20Abi, provider);
    lavadaoBalance = await lavadaoContract.balanceOf(address);
    stakeAllowance = await lavadaoContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);

    const slavadaoContract = new ethers.Contract(addresses[networkID].SLAVADAO_ADDRESS as string, sBHD, provider);
    slavadaoBalance = await slavadaoContract.balanceOf(address);
    unstakeAllowance = await slavadaoContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    poolAllowance = await slavadaoContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);

    if (addresses[networkID].MIM_ADDRESS) {
      presaleAllowance = await mimContract.allowance(address, addresses[networkID].PRESALE_ADDRESS);
    }

    if (addresses[networkID].ALAVADAO_ADDRESS) {
      claimAllowance = await plavadaoContract.allowance(address, addresses[networkID].PRESALE_ADDRESS);
    }

    console.log('debug->dashboard5')
    
    const presaleContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, presaleAbi, provider);
    console.log('presaleContract',presaleContract)
    const lavadaoPrice = await presaleContract.getPriceForThisAddress(address);
    const remainingAmount = await presaleContract.getUserRemainingAllocation(address);
    const isStarted = await presaleContract.started();
    const isEnded = await presaleContract.ended();
    const minCap = await presaleContract.minCap();

    console.log('mincap',minCap)
    const cap = await presaleContract.cap();
    let presaleStatus = "Presale has not yet started.";
    if(isStarted){
      presaleStatus = "Presales is Active!";
    } 
    if(isEnded)
      presaleStatus = "Presales was ended";
    
    

    return {
      balances: {
        dai: ethers.utils.formatEther(daiBalance),
        busd: ethers.utils.formatEther(mimBalance),
        lavadao: ethers.utils.formatUnits(lavadaoBalance, "gwei"),
        slavadao: ethers.utils.formatUnits(slavadaoBalance, "gwei"),
        plavadao: ethers.utils.formatUnits(plavadaoBalance, "gwei"),
        
      },

      presale: {
        presaleAllowance: +presaleAllowance,
        tokenPrice: ethers.utils.formatEther(lavadaoPrice),
        remainingAmount: ethers.utils.formatEther(remainingAmount),
        presaleStatus: presaleStatus,
        minCap: ethers.utils.formatEther(minCap),
        cap: ethers.utils.formatEther(cap),
        multiSignBalance: multiSignBalance,
      },
      claim: {
        claimAllowance: +claimAllowance,
      },
      staking: {
        lavadaoStake: +stakeAllowance,
        lavadaoUnstake: +unstakeAllowance,
      },
      bonding: {
        daiAllowance: daiBondAllowance,
      },
      pooling: {
        slavadaoPool: +poolAllowance,
      },
    };
  },
);

export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationTime: number;
  pendingPayout: string; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationTime: 0,
        pendingPayout: "",
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    const mimContract = new ethers.Contract(addresses[networkID].MIM_ADDRESS as string, ierc20Abi, provider);
   
    let multiSignBalance = await mimContract.balanceOf(addresses[networkID].MULTISIGN_ADDRESS);
   
  
    let interestDue, pendingPayout, bondMaturationTime;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationTime = +bondDetails.vesting + +bondDetails.lastTime;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = 0;
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    // formatEthers takes BigNumber => String
    // let balanceVal = ethers.utils.formatEther(balance);
    // balanceVal should NOT be converted to a number. it loses decimal precision
    let deciamls = 18;
    if (bond.name == "usdc") {
      deciamls = 6;
    }
    const balanceVal = balance / Math.pow(10, deciamls);
    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance),
      balance: balanceVal.toString(),
      interestDue,
      bondMaturationTime,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

interface IAccountSlice {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    bhd: string;
    sbhd: string;
    pbhd: string;
    dai: string;
    busd: string;
  };
  loading: boolean;
}
const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { bhd: "", sbhd: "", pbhd: "", dai: "", busd: "" },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
